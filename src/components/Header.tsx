import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import Logo from './Logo';
import styles from '../styles/Header.module.css';

const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);
const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const appLanguages = [
    { value: 'pt-BR', label: 'Português' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'zh', label: '中文' }
];

interface HeaderProps {
    ollamaStatus: string;
    onHelpClick: () => void;
}

const Header = ({ ollamaStatus, onHelpClick }: HeaderProps) => {
    const { settings, toggleTheme, handleLanguageChange } = useSettings();
    const [t, setT] = React.useState<Record<string, string>>({});
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (settings?.appLanguage) {
          import(`../../locales/${settings.appLanguage}.json`).then((module) => {
            setT(module.default);
          });
        }
      }, [settings?.appLanguage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleLangSelect = (lang: string) => {
        handleLanguageChange(lang);
        setIsLangMenuOpen(false);
    };

    if (!settings) return null;

    return (
        <header className={styles.header}>
            <Logo />
            <div className={styles.headerControls}>
                <div className={styles.statusIndicator}>
                    <div className={`${styles.statusDot} ${styles[ollamaStatus]}`}></div>
                    <span>{t.ollamaStatus?.replace('{status}', ollamaStatus) || `API ${ollamaStatus}`}</span>
                </div>
                
                <button onClick={onHelpClick} className={styles.iconBtn} title={t.helpTooltip}>
                    <HelpIcon />
                </button>

                <div className={styles.languageSelector} ref={menuRef}>
                    <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className={styles.iconBtn} title="Change language">
                        <LanguageIcon />
                    </button>
                    {isLangMenuOpen && (
                        <div className={styles.languageMenu}>
                            {appLanguages.map(lang => (
                                <button
                                    key={lang.value}
                                    className={`${styles.languageMenuItem} ${settings.appLanguage === lang.value ? styles.active : ''}`}
                                    onClick={() => handleLangSelect(lang.value)}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={toggleTheme} className={styles.iconBtn} title={settings.theme === 'light' ? t.themeDark : t.themeLight}>
                    {settings.theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
            </div>
        </header>
    );
};

export default Header;