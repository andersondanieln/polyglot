import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Modals.module.css';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const ActionsView = () => {
    const { settings } = useSettings();
    const t = useTranslations();
    const [keyInput, setKeyInput] = useState('');
    const [promptInput, setPromptInput] = useState('');
    const [error, setError] = useState('');

    const handleAdd = async () => {
        if (!keyInput || !promptInput) {
            setError('Both fields are required');
            return;
        }
        const cleanKey = keyInput.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (!cleanKey) return;

        const newPrompts = { ...settings?.customPrompts, [cleanKey]: promptInput };
        await window.api.saveSettings({ customPrompts: newPrompts });
        setKeyInput('');
        setPromptInput('');
        setError('');
    };

    const handleDelete = async (key: string) => {
        if (!settings?.customPrompts) return;
        const newPrompts = { ...settings.customPrompts };
        delete newPrompts[key];
        window.api.saveSettings({ customPrompts: newPrompts });
    };

    return (
        <div className={styles.viewContainer}>
            <h2 className={styles.viewTitle}>{t.customActionsTitle || "Custom Actions"}</h2>
            
            <div className={styles.configSection} style={{ marginTop: '1.5rem' }}>
                <p className={styles.hint}>
                    {t.customActionsHint || "Create custom suffixes. Usage: select text and type"} <code>::yourkey</code>
                </p>
                
                <div className={styles.inputGroupRow}>
                    <input 
                        className={styles.configInput} 
                        placeholder={t.keyPlaceholder || "Key (e.g. dev)"}
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        style={{ width: '140px' }}
                    />
                    <input 
                        className={styles.configInput} 
                        placeholder={t.promptPlaceholder || "Prompt"}
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        style={{ flexGrow: 1 }}
                    />
                    <button 
                        className={styles.saveBtn} 
                        onClick={handleAdd} 
                        title={t.addActionTooltip || "Add Action"}
                    >
                        <PlusIcon />
                    </button>
                </div>
                {error && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
            </div>

            <div className={styles.langTable}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t.codeColumn || "Suffix"}</th>
                            <th style={{ textAlign: 'left', padding: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t.languageColumn || "Action"}</th>
                            <th style={{ width: '60px', borderBottom: '1px solid var(--border-color)' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {settings?.customPrompts && Object.entries(settings.customPrompts).map(([key, prompt]) => (
                            <tr key={key}>
                                <td style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <code>::{key}</code>
                                </td>
                                <td style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem', color: 'var(--subtext-color)' }}>
                                    {prompt}
                                </td>
                                <td style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => handleDelete(key)}
                                        className={styles.deleteActionBtn}
                                        title={t.deleteActionTooltip || "Delete Action"}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!settings?.customPrompts || Object.keys(settings.customPrompts).length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--subtext-color)' }}>
                                    {t.noActionsMessage || "No custom actions defined."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActionsView;