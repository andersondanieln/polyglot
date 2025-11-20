import { contextBridge, ipcRenderer } from 'electron';
import { AppSettings } from './src/types';

export interface Api {
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  getOllamaModels: () => Promise<{ success: boolean; models?: { name: string }[]; error?: string }>;
  checkOllamaStatus: () => Promise<{ success: boolean; error?: string }>;
  onOllamaStatusChanged: (callback: (args: { status: string }) => void) => () => void;
  onSettingsUpdated: (callback: (settings: AppSettings) => void) => () => void;
  openExternalLink: (url: string) => Promise<void>;
  onProcessingStatusChanged: (callback: (args: { status: 'start' | 'end' }) => void) => () => void;
  onPlaySound: (callback: (args: { type: 'start' | 'success' | 'error' }) => void) => () => void;
}

const api: Api = {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    getOllamaModels: () => ipcRenderer.invoke('get-ollama-models'),
    
    checkOllamaStatus: () => ipcRenderer.invoke('check-ollama-status'),
    onOllamaStatusChanged: (callback) => {
        const subscription = (_event: unknown, value: { status: string }) => callback(value);
        ipcRenderer.on('ollama-status-changed', subscription);
        return () => ipcRenderer.removeListener('ollama-status-changed', subscription);
    },

    onSettingsUpdated: (callback) => {
        const subscription = (_event: unknown, value: AppSettings) => callback(value);
        ipcRenderer.on('settings-updated', subscription);
        return () => ipcRenderer.removeListener('settings-updated', subscription);
    },

    openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),

    onProcessingStatusChanged: (callback) => {
      const subscription = (_event: unknown, value: { status: 'start' | 'end' }) => callback(value);
      ipcRenderer.on('processing-status', subscription);
      return () => ipcRenderer.removeListener('processing-status', subscription);
    },

    onPlaySound: (callback) => {
        const subscription = (_event: unknown, value: { type: 'start' | 'success' | 'error' }) => callback(value);
        ipcRenderer.on('play-sound', subscription);
        return () => ipcRenderer.removeListener('play-sound', subscription);
    }
};

contextBridge.exposeInMainWorld('api', api);

declare global {
  interface Window {
    api: Api;
  }
}