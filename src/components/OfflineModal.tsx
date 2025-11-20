import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import Logo from './Logo';
import styles from '../styles/Modals.module.css';

interface OfflineModalProps {
  onRetry: () => void;
}

const OfflineModal = ({ onRetry }: OfflineModalProps) => {
  const t = useTranslations();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.api.openExternalLink('https://ollama.com/download');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.offlineModalContent}>
        <div style={{ marginBottom: '1.5rem' }}>
             <Logo />
        </div>
        <h2>{t.offlineTitle || "API is not responding"}</h2>
        <p>{t.offlineMessage || "Please check if your Ollama or local server is running."}</p>
        
        <button className={styles.retryBtn} onClick={onRetry}>
          {t.tryAgain || "Try Again"}
        </button>
        
        <p className={styles.downloadPrompt}>
          {t.downloadOllama?.split('?')[0]}?{' '}
          <a href="#" onClick={handleLinkClick}>
            {t.downloadOllama?.split('?')[1] || "Download it here."}
          </a>
        </p>
        <small>{t.offlineHint || "Default URL: http://localhost:11434"}</small>
      </div>
    </div>
  );
};

export default OfflineModal;