import React, { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import styles from '../styles/Modals.module.css';

interface TutorialModalProps {
    onClose: () => void;
}

const TutorialModal = ({ onClose }: TutorialModalProps) => {
    const { settings } = useSettings();
    const [t, setT] = React.useState<Record<string, any>>({});
    const modalRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (settings?.appLanguage) {
          import(`../../locales/${settings.appLanguage}.json`).then((module) => {
            setT(module.default);
          });
        }
    }, [settings?.appLanguage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    const langSuffixCodes = ['ptbr', 'en', 'es', 'zh'];
    
    const translationRows = (t.targetLanguages || []).map((desc: string, index: number) => ({
        code: `::${langSuffixCodes[index]}`,
        description: desc
    }));

    translationRows.unshift({ code: '::pt', description: 'Português (Portugal)' });

    const specialActionCodes = ['fix', 'formal', 'informal', 'friendly', 'summarize', 'shorten', 'expand'];
    const actionRows = (t.specialActions || []).map((desc: string, index: number) => ({
        code: `::${specialActionCodes[index]}`,
        description: desc
    }));

    const allRows = [...translationRows, ...actionRows];

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} ref={modalRef}>
                <div className={styles.modalHeader}>
                    <h2>{t.tutorialTitle}</h2>
                    <button onClick={onClose} className={styles.modalCloseBtn}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.tutorialSection}>
                        <h3>{t.generalUsageTitle}</h3>
                        <ol>
                            <li>{t.step1}</li>
                            <li>{t.step2}</li>
                            <li>{t.step3}</li>
                        </ol>
                    </div>
                    <div className={styles.tutorialSection}>
                        <h3>{t.suffixTitle}</h3>
                        <p>{t.suffixExplanation}</p>
                        <table className={styles.langTable}>
                            <thead>
                                <tr>
                                    <th>{t.codeColumn}</th>
                                    <th>{t.languageColumn}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allRows.map((row) => (
                                    <tr key={row.code}>
                                        <td><code>{row.code}</code></td>
                                        <td>{row.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;