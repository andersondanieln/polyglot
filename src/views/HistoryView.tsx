import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Modals.module.css';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const HistoryView = () => {
    const { settings } = useSettings();
    const t = useTranslations();

    const handleClear = async () => {
        if (confirm('Are you sure you want to clear the history?')) {
            await window.api.saveSettings({ history: [] });
        }
    };

    const handleExport = () => {
        if (!settings?.history) return;
        const jsonString = JSON.stringify(settings.history, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `polyglot-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className={styles.viewContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.viewTitle}>{t.historyTitle || "History Log"}</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {settings?.history && settings.history.length > 0 && (
                        <>
                            <button 
                                onClick={handleExport}
                                className={styles.actionBtnSecondary}
                                title="Export JSON"
                            >
                                <DownloadIcon /> {t.exportBtn || "Export"}
                            </button>
                            <button 
                                onClick={handleClear}
                                className={styles.actionBtnDanger}
                                title="Clear History"
                            >
                                <TrashIcon /> {t.clearBtn || "Clear"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.modalBody}>
                {!settings?.history || settings.history.length === 0 ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '300px', 
                        color: 'var(--subtext-color)',
                        border: '2px dashed var(--border-color)',
                        borderRadius: '12px'
                    }}>
                        <p>{t.noHistoryAvailable || "No history available."}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {settings.history.map((item, index) => (
                            <div key={index} className={styles.historyCard}>
                                <div className={styles.historyHeader}>
                                    <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleString()}</span>
                                    <span className={styles.historyModel}>{item.model}</span>
                                </div>
                                
                                <div className={styles.historyContentBlock}>
                                    <strong className={styles.label}>{t.originalLabel || "Original"}</strong>
                                    <p className={styles.contentText}>{item.original}</p>
                                </div>
                                
                                <div className={`${styles.historyContentBlock} ${styles.resultBlock}`}>
                                    <div className={styles.resultHeader}>
                                        <strong className={styles.label}>{t.resultLabel || "Result"}</strong>
                                        <button 
                                            onClick={() => handleCopy(item.result)}
                                            className={styles.copyBtnSmall}
                                        >
                                            {t.copy || "Copy"}
                                        </button>
                                    </div>
                                    <p className={styles.contentText} style={{ color: 'var(--primary-color)' }}>{item.result}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;