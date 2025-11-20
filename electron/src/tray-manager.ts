import { app, Menu, nativeImage, Tray, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import { AppSettings } from './types';
import './electron.d';

let tray: Tray | null = null;
let store: Store<AppSettings>;

const languages = [
  { value: 'Português Brasileiro', label: 'Português (Brasil)' },
  { value: 'Inglês', label: 'English' },
  { value: 'Espanhol', label: 'Español' },
  { value: 'Chinês', label: '中文' },
];

export const loadTranslations = (langCode: string) => {
  const isDev = !app.isPackaged;
  
  const basePath = isDev 
    ? process.cwd() 
    : path.join(app.getAppPath(), '..', 'dist');

  try {
    const filePath = path.join(basePath, 'locales', `${langCode}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load translation for ${langCode}:`, error);
    try {
        const fallbackFilePath = path.join(basePath, 'locales', 'en.json');
        const fileContent = fs.readFileSync(fallbackFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (fallbackError) {
        console.error('Failed to load fallback translation:', fallbackError);
        return {}; 
    }
  }
};

export function createTray() {
  if (!process.env.PUBLIC) {
    console.error('process.env.PUBLIC is not defined. Cannot create tray icon.');
    return;
  }


  const iconPath = path.join(process.env.PUBLIC, 'images/icon.png');
  try {
    const image = nativeImage.createFromPath(iconPath);
    tray = new Tray(image);
    tray.setToolTip('Polyglot Air');

    const window = BrowserWindow.getAllWindows()[0];
    if (window) {
      tray.on('click', () => (window.isVisible() ? window.hide() : window.show()));
    }

    const currentSettings = store.store;
    updateTrayMenu(currentSettings.targetLanguage, currentSettings.appLanguage);
  } catch (error) {
    console.error('Failed to create tray icon:', error);
  }
}

export function updateTrayMenu(selectedLanguage: string, appLanguage: string) {
  if (!tray) return;

  const t = loadTranslations(appLanguage);
  const window = BrowserWindow.getAllWindows()[0];

  const languageMenu = languages.map((lang) => ({
    label: lang.label,
    type: 'radio' as const,
    checked: lang.value === selectedLanguage,
    click: () => {
      store.set('targetLanguage', lang.value);
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    { label: t.showApp || 'Show App', click: () => window?.show() },
    { type: 'separator' },
    { label: t.targetLanguageTray || 'Target Language', submenu: languageMenu },
    { type: 'separator' },
    {
      label: t.quit || 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

export function initializeTrayManager(appStore: Store<AppSettings>) {
  store = appStore;
}