import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Settings.module.css';

const canonicalLanguages = ['Português Brasileiro', 'Inglês', 'Espanhol', 'Chinês'];

const KeyboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <line x1="6" y1="8" x2="6" y2="8"></line>
        <line x1="10" y1="8" x2="10" y2="8"></line>
        <line x1="14" y1="8" x2="14" y2="8"></line>
        <line x1="18" y1="8" x2="18" y2="8"></line>
        <line x1="6" y1="12" x2="6" y2="12"></line>
        <line x1="10" y1="12" x2="10" y2="12"></line>
        <line x1="14" y1="12" x2="14" y2="12"></line>
        <line x1="18" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="16" x2="6" y2="16"></line>
        <line x1="10" y1="16" x2="14" y2="16"></line>
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const ServerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
);

const MagicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><polyline points="9 18 15 12 9 6"></polyline></svg>;

interface HomeViewProps {
    onOpenTutorial: () => void;
}

const HomeView = ({ onOpenTutorial }: HomeViewProps) => {
    const { settings, handleSettingChange } = useSettings();
    const t = useTranslations();
    const [models, setModels] = useState<string[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const languageOptions = canonicalLanguages.map((lang, index) => ({
        value: lang,
        label: t.targetLanguages?.[index] || lang,
    }));

    const fetchModels = async () => {
        const result = await window.api.getOllamaModels();
        if (result.success && result.models) {
            setModels(result.models.map((m) => m.name));
        } else {
            setModels([]);
        }
    };

    useEffect(() => {
        fetchModels();
    }, [settings?.apiType, settings?.apiUrl]);

    const handleCopyCommand = () => {
        navigator.clipboard.writeText("ollama pull gemma3:4b");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShortcutKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const keys: string[] = [];
        if (e.ctrlKey) keys.push('Control');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        const key = e.key.toUpperCase();
        if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) keys.push(key);
        const shortcut = keys.join('+');
        if (keys.length > 1 && settings && shortcut !== settings.shortcut) {
            handleSettingChange('shortcut', shortcut);
        }
        setIsRecording(false);
    };

    if (!settings) return null;
    const isOllama = settings.apiType === 'ollama';

    return (
        <div className={styles.homeContainer}>
            <header className={styles.welcomeHeader}>
                <h1>{t.welcomeGreeting || "Hello,"} <span>{t.welcomeName || "Human"}</span>.</h1>
                <p>{t.welcomeSubtitle || "Ready to break language barriers?"}</p>
            </header>

            <div className={styles.heroCard}>
                <div className={styles.heroContent}>
                    <div className={styles.heroIconWrapper}>
                        <KeyboardIcon />
                    </div>
                    <div className={styles.heroText}>
                        <h2>{t.shortcutLabel || "Quick Action Shortcut"}</h2>
                        <p>{t.shortcutHint || "Use this shortcut to activate the magic."}</p>
                    </div>
                </div>
                <div 
                    className={`${styles.shortcutDisplay} ${isRecording ? styles.recording : ''}`}
                    onClick={() => document.getElementById('shortcut-input')?.focus()}
                >
                    <input 
                        id="shortcut-input"
                        type="text"
                        readOnly
                        value={settings.shortcut.replace(/\+/g, ' + ')}
                        placeholder={isRecording ? "Press keys..." : "Click to set"}
                        onFocus={() => setIsRecording(true)}
                        onBlur={() => setIsRecording(false)}
                        onKeyDown={handleShortcutKeyDown}
                    />
                    {isRecording && <div className={styles.recordingDot}></div>}
                </div>
            </div>

            <div className={styles.gridContainer}>

                <div className={styles.modernCard}>
                    <div className={styles.cardHeader}>
                        <GlobeIcon />
                        <h3>{t.targetLanguageLabel || "Target Language"}</h3>
                    </div>
                    <p className={styles.cardDescription}>{t.targetLanguageHint || "Default language for translations."}</p>
                    <div className={styles.selectWrapper}>
                        <select
                            value={settings.targetLanguage}
                            onChange={(e) => handleSettingChange('targetLanguage', e.target.value)}
                        >
                            {languageOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className={styles.modernCard}>
                    <div className={styles.cardHeader}>
                        <ServerIcon />
                        <h3>{t.ollamaModelLabel || "AI Model"}</h3>
                    </div>
                    <p className={styles.cardDescription}>
                        {isOllama ? (t.ollamaModelHint || "Local Ollama model.") : "Remote OpenAI compatible model."}
                    </p>
                    
                    <div className={styles.selectWithAction}>
                        <div className={styles.selectWrapper}>
                            <select
                                value={settings.selectedModel}
                                onChange={(e) => handleSettingChange('selectedModel', e.target.value)}
                            >
                                <option value="" disabled>{t.selectModel || "Select Model"}</option>
                                {models.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <button className={styles.actionButton} onClick={fetchModels} title="Reload Models">
                            <RefreshIcon />
                        </button>
                    </div>
                    
                    {isOllama && (
                        <div className={styles.terminalBox}>
                            <div className={styles.terminalHeader}>
                                <span className={styles.terminalDot}></span>
                                <span className={styles.terminalDot}></span>
                                <span className={styles.terminalDot}></span>
                            </div>
                            <div className={styles.terminalContent}>
                                <code>ollama pull gemma3:4b</code>
                                <button 
                                    onClick={handleCopyCommand} 
                                    className={styles.terminalCopy}
                                    title="Copy Command"
                                >
                                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.cheatSheetCard} onClick={onOpenTutorial}>
                <div className={styles.cheatSheetContent}>
                    <div className={styles.iconBg}>
                        <MagicIcon />
                    </div>
                    <div className={styles.cheatSheetText}>
                        <h3>{t.suffixTableTitle || "Available Suffixes"}</h3>
                        <p>{t.suffixTableHint || "See the magic codes like ::formal, ::fix, ::summary"}</p>
                    </div>
                </div>
                <ChevronRight />
            </div>
        </div>
    );
};

export default HomeView;