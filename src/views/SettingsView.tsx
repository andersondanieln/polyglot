import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Settings.module.css';

const SettingsView = () => {
    const { settings } = useSettings();
    const t = useTranslations();
    const [localApi, setLocalApi] = useState({ type: 'ollama', url: '', key: '' });

    useEffect(() => {
        if (settings) {
            setLocalApi({
                type: settings.apiType,
                url: settings.apiUrl,
                key: settings.apiKey
            });
        }
    }, [settings]);

    const handleSaveApi = async () => {
        await window.api.saveSettings({
            apiType: localApi.type as any,
            apiUrl: localApi.url,
            apiKey: localApi.key
        });
    };

    const toggleBoolean = async (key: 'enableSound' | 'copyOnly' | 'autoLaunch') => {
        if (settings) await window.api.saveSettings({ [key]: !settings[key] });
    };

    if (!settings) return null;

    return (
        <div style={{ width: '100%', paddingBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-color)', fontWeight: 700 }}>
                {t.appSettingsTitle || "App Settings"}
            </h2>
            
            <div className={styles.settingItem} style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{t.apiConfigTitle || "API Configuration"}</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>{t.providerLabel || "Provider"}</label>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="apiType" 
                                checked={localApi.type === 'ollama'} 
                                onChange={() => setLocalApi({ ...localApi, type: 'ollama', url: 'http://localhost:11434' })}
                            /> 
                            <span>Ollama (Local)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="apiType" 
                                checked={localApi.type === 'openai'} 
                                onChange={() => setLocalApi({ ...localApi, type: 'openai', url: 'https://api.openai.com' })}
                            /> 
                            <span>OpenAI Compatible</span>
                        </label>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.baseUrlLabel || "Base URL"}</label>
                    <input 
                        type="text" 
                        value={localApi.url} 
                        onChange={(e) => setLocalApi({...localApi, url: e.target.value})}
                        placeholder="http://localhost:11434"
                    />
                </div>

                {localApi.type === 'openai' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t.apiKeyLabel || "API Key"}</label>
                        <input 
                            type="password" 
                            value={localApi.key} 
                            onChange={(e) => setLocalApi({...localApi, key: e.target.value})}
                            placeholder="sk-..."
                        />
                    </div>
                )}
                
                <button 
                    onClick={handleSaveApi} 
                    style={{ 
                        width: '100%', 
                        marginTop: '0.5rem', 
                        backgroundColor: 'var(--primary-color)', 
                        color: '#1A1D1F', 
                        fontWeight: 'bold',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {t.saveApiSettings || "Save API Settings"}
                </button>
            </div>

            <div className={styles.settingItem} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '1rem', fontWeight: 500 }}>{t.soundEffectsLabel || "Sound Effects"}</label>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--subtext-color)' }}>{t.soundEffectsHint || "Play sound on start/finish"}</p>
                </div>
                <input type="checkbox" checked={settings.enableSound} onChange={() => toggleBoolean('enableSound')} />
            </div>

            <div className={styles.settingItem} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '1rem', fontWeight: 500 }}>{t.copyOnlyLabel || "Copy Only Mode"}</label>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--subtext-color)' }}>{t.copyOnlyHint || "Do not auto-replace text"}</p>
                </div>
                <input type="checkbox" checked={settings.copyOnly} onChange={() => toggleBoolean('copyOnly')} />
            </div>

            <div className={styles.settingItem} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '1rem', fontWeight: 500 }}>{t.autoLaunchLabel || "Auto-Launch"}</label>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--subtext-color)' }}>{t.autoLaunchHint || "Start minimized on system login"}</p>
                </div>
                <input type="checkbox" checked={settings.autoLaunch} onChange={() => toggleBoolean('autoLaunch')} />
            </div>
        </div>
    );
};

export default SettingsView;