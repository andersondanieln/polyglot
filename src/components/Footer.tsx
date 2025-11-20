import React from 'react';
import styles from '../styles/Footer.module.css';
import { useTranslations } from '../hooks/useTranslations';

const LinkedInIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer: React.FC = () => {
  const t = useTranslations();
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.api.openExternalLink(url);
  };

  return (
    <footer className={styles.footer}>
      <a
        href="https://andercoder.com"
        className={styles.footerLeftContent}
        onClick={(e) => handleLinkClick(e, 'https://andercoder.com')}
      >
        <div 
            className={styles.footerIcon} 
            style={{ 
                WebkitMaskImage: `url('images/andercoder.svg')`, 
                maskImage: `url('images/andercoder.svg')` 
            }}
        />
        <p>
          {t.footerText}
          <strong>AnderCoder</strong>
        </p>
      </a>
      <a
        href="https://www.linkedin.com/in/andersondn"
        onClick={(e) => handleLinkClick(e, 'https://www.linkedin.com/in/andersondn')}
        title="LinkedIn"
        className={styles.socialLink}
      >
        <LinkedInIcon />
      </a>
    </footer>
  );
};

export default Footer;