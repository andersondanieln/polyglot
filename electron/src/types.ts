export interface HistoryItem {
  original: string;
  result: string;
  timestamp: number;
  model: string;
}

export interface AppSettings {
  shortcut: string;
  targetLanguage: string;
  selectedModel: string;
  theme: 'light' | 'dark';
  appLanguage: string;
  apiType: 'ollama' | 'openai';
  apiUrl: string;
  apiKey: string;
  customPrompts: Record<string, string>;
  history: HistoryItem[];
  enableSound: boolean;
  copyOnly: boolean;
  autoLaunch: boolean;
}