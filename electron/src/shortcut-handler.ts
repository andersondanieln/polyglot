import { globalShortcut, clipboard, Notification, BrowserWindow } from 'electron';
import { keyboard, Key } from '@nut-tree-fork/nut-js';
import Store from 'electron-store';
import { AppSettings } from './types';
import { generateResponse } from './ollama-api';
import { actionPrompts, translationPrompt } from './prompts';
import { loadTranslations } from './tray-manager';

let store: Store<AppSettings>;

const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Portugal)',
    'ptbr': 'Portuguese (Brazil)',
    'br': 'Portuguese (Brazil)',
    'portugues': 'Portuguese (Brazil)',
    'en': 'English',
    'eng': 'English',
    'english': 'English',
    'zh': 'Chinese',
    'chines': 'Chinese',
    'chinese': 'Chinese',
    'es': 'Spanish',
    'esp': 'Spanish',
    'espanol': 'Spanish',
    'spanish': 'Spanish',
};

export function initializeShortcutHandler(appStore: Store<AppSettings>) {
  store = appStore;
}

function playSound(type: 'start' | 'success' | 'error') {
    const settings = store.store;
    if (settings.enableSound) {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            win.webContents.send('play-sound', { type });
        }
    }
}

async function handleShortcut() {
    const originalClipboard = clipboard.readText();
    clipboard.clear();
    const settings = store.store;
    const t = loadTranslations(settings.appLanguage);

    const win = BrowserWindow.getAllWindows()[0];

    try {
        await keyboard.pressKey(Key.LeftControl, Key.C);
        await keyboard.releaseKey(Key.LeftControl, Key.C);
    } catch (err) {
        console.error("nut-js failed to simulate copy:", err);
        playSound('error');
        new Notification({ title: 'Polyglot Air Error', body: t.copyError || 'Failed to copy selected text.'}).show();
        return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 200)); 
    
    const selectedText = clipboard.readText();
    
    if (!selectedText || selectedText.trim() === '') {
        playSound('error');
        new Notification({ title: 'Polyglot Air', body: t.noTextError || 'No text was copied.' }).show();
        clipboard.writeText(originalClipboard);
        return;
    }

    if (!settings.selectedModel) {
        playSound('error');
        new Notification({ title: 'Polyglot Air Error', body: t.noModelError || 'No Model selected.' }).show();
        clipboard.writeText(originalClipboard);
        return;
    }

    let textToProcess = selectedText;
    let prompt;

    const suffixRegex = /::(\w+)$/;
    const match = selectedText.match(suffixRegex);

    if (match) {
        const suffix = match[1].toLowerCase();
        textToProcess = selectedText.replace(suffixRegex, '').trim();
        
        // Check Custom Prompts First
        if (settings.customPrompts && settings.customPrompts[suffix]) {
             prompt = settings.customPrompts[suffix].replace('${text}', textToProcess);
             if (!prompt.includes(textToProcess)) {
                 prompt = `${settings.customPrompts[suffix]}\n\nText:\n"""\n${textToProcess}\n"""`;
             }
        } else if (actionPrompts[suffix]) {
            prompt = actionPrompts[suffix](textToProcess);
        } else if (languageMap[suffix]) {
            const targetLanguage = languageMap[suffix];
            prompt = translationPrompt(textToProcess, targetLanguage);
        }
    }
    
    if (!prompt) {
        const defaultTargetLanguage = settings.targetLanguage === 'Português Brasileiro' ? 'Portuguese (Brazil)' : settings.targetLanguage;
        prompt = translationPrompt(textToProcess, defaultTargetLanguage);
    }
    
    const progressNotification = new Notification({
        title: 'Polyglot Air',
        body: t.processingText || 'Processing text...',
        silent: true,
    });
    
    playSound('start');
    if (win) win.webContents.send('processing-status', { status: 'start' });
    progressNotification.show();

    console.log("\n--- NEW REQUEST ---");
    console.log("▶️ PROMPT SENT TO API:");
    console.log(prompt);
    console.log("--------------------");

    try {
        const processedText = await generateResponse(settings, prompt);
        
        console.log("✅ RESPONSE RECEIVED:");
        console.log(processedText);
        console.log("--- END REQUEST ---\n");
        
        progressNotification.close();

        if (processedText) {

            const newHistory = [{
                original: textToProcess,
                result: processedText,
                timestamp: Date.now(),
                model: settings.selectedModel
            }, ...(settings.history || [])].slice(0, 20);
            store.set('history', newHistory);
            if (win) win.webContents.send('settings-updated', store.store);

            clipboard.writeText(processedText);
            
            if (!settings.copyOnly) {
                await keyboard.pressKey(Key.LeftControl, Key.V);
                await keyboard.releaseKey(Key.LeftControl, Key.V);
            }

            playSound('success');
            new Notification({
                title: 'Polyglot Air',
                body: settings.copyOnly 
                    ? (t.textCopied || 'Text processed and copied to clipboard!') 
                    : (t.processedText || 'Text processed and pasted!'),
                silent: true,
            }).show();
        }
    } catch (error) {
        progressNotification.close();
        console.error('Processing error:', error);
        playSound('error');
        new Notification({ title: 'Polyglot Air Error', body: t.ollamaError || 'Failed to connect to API.' }).show();
    } finally {
        if (win) win.webContents.send('processing-status', { status: 'end' });
    }
}

export function registerGlobalShortcut(shortcut: string) {
    globalShortcut.unregisterAll();
    if (!shortcut || !shortcut.includes('+')) {
        console.error(`Attempted to register invalid shortcut: "${shortcut}". Registration skipped.`);
        return;
    }
    if (globalShortcut.register(shortcut, handleShortcut)) {
        console.log(`Shortcut ${shortcut} registered successfully.`);
    } else {
        console.error(`Failed to register shortcut ${shortcut}.`);
    }
}