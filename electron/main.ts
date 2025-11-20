import { app, BrowserWindow, globalShortcut, nativeImage } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { AppSettings } from './src/types';
import { checkOllamaStatus } from './src/ollama-api';
import { createTray, initializeTrayManager } from './src/tray-manager';
import {
  initializeShortcutHandler,
  registerGlobalShortcut,
} from './src/shortcut-handler';
import { setupIpcHandlers } from './src/ipc-handlers';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

const store = new Store<AppSettings>({
  defaults: {
    shortcut: 'CommandOrControl+B',
    targetLanguage: 'Inglês',
    selectedModel: '',
    theme: 'dark',
    appLanguage: 'en',
    apiType: 'ollama',
    apiUrl: 'http://localhost:11434',
    apiKey: '',
    customPrompts: {},
    history: [],
    enableSound: true,
    copyOnly: false,
    autoLaunch: false,
  },
});

let ollamaCheckInterval: NodeJS.Timeout | null = null;
let lastOllamaStatus = 'checking';

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0];
  if (window) {
    if (window.isMinimized()) window.restore();
    if (!window.isVisible()) window.show();
    window.focus();
  }
});

function updateAutoLaunch(enable: boolean) {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: app.getPath('exe'),
  });
}

function startOllamaStatusPolling() {
  if (ollamaCheckInterval) {
    clearInterval(ollamaCheckInterval);
  }
  
  ollamaCheckInterval = setInterval(async () => {
    const settings = store.store;
    const { success } = await checkOllamaStatus(settings);
    const currentStatus = success ? 'online' : 'offline';
    if (currentStatus !== lastOllamaStatus) {
      lastOllamaStatus = currentStatus;
      const window = BrowserWindow.getAllWindows()[0];
      if (window) {
        window.webContents.send('ollama-status-changed', {
          status: currentStatus,
        });
      }
    }
  }, 5000);
}

function createWindow() {
  if (!process.env.PUBLIC) {
    throw new Error('process.env.PUBLIC is not defined');
  }

  const isAutostart = process.argv.includes('--autostart');

  const iconPath = path.join(process.env.PUBLIC, 'images/icon.png');
  const icon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    show: !isAutostart, 
    width: 1000,
    height: 700,
    webPreferences: { 
        preload: path.join(__dirname, 'preload.js'),
        autoplayPolicy: 'no-user-gesture-required' 
    },
    autoHideMenuBar: true,
    icon: icon,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    if (!isAutostart) {
        win.webContents.openDevTools();
    }
  } else {
    if (!process.env.DIST) {
      throw new Error('process.env.DIST is not defined');
    }
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
    const settings = store.store;
    updateAutoLaunch(settings.autoLaunch);

    createWindow();
    initializeTrayManager(store);
    initializeShortcutHandler(store);

    createTray();
    registerGlobalShortcut(store.get('shortcut'));
    setupIpcHandlers(store);
    startOllamaStatusPolling();

    store.onDidChange('autoLaunch', (newValue) => {
        updateAutoLaunch(!!newValue);
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

app.on('will-quit', () => {
  if (ollamaCheckInterval) clearInterval(ollamaCheckInterval);
  globalShortcut.unregisterAll();
});