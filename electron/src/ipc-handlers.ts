import { ipcMain, shell, BrowserWindow } from 'electron';
import Store from 'electron-store';
import { AppSettings } from './types';
import { checkOllamaStatus, getApiModels } from './ollama-api';
import { registerGlobalShortcut } from './shortcut-handler';
import { updateTrayMenu } from './tray-manager';

export function setupIpcHandlers(store: Store<AppSettings>) {
  ipcMain.handle('check-ollama-status', () => {
    return checkOllamaStatus(store.store);
  });

  ipcMain.handle('get-settings', () => store.store);

  ipcMain.handle(
    'save-settings',
    (event, settings: Partial<AppSettings>) => {
      store.set(settings);
      
      const currentSettings = store.store;

      if (settings.shortcut) {
        registerGlobalShortcut(settings.shortcut);
      }
      
      if (settings.targetLanguage || settings.appLanguage) {
        updateTrayMenu(currentSettings.targetLanguage, currentSettings.appLanguage);
      }

      const window = BrowserWindow.fromWebContents(event.sender);
      if (window) {
        window.webContents.send('settings-updated', currentSettings);
      }
      return currentSettings;
    },
  );

  ipcMain.handle('get-ollama-models', () => {
    return getApiModels(store.store);
  });

  ipcMain.handle('open-external-link', (_event, url: string) => {
    shell.openExternal(url);
  });
}