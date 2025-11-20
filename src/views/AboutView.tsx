import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Settings.module.css';

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const AboutView = () => {
    const t = useTranslations();
    const handleLink = (url: string) => {
        window.api.openExternalLink(url);
    };

    return (
        <div className={styles.homeContainer}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-color)', fontWeight: 700 }}>
                {t.aboutTitle || "About"}
            </h2>

            <div className={styles.modernCard}>
                <div className={styles.cardHeader}>
                    <img src="/images/logo-dark.svg" alt="Polyglot Air" style={{ height: '24px' }} /> 
                    <h3>{t.missionTitle || "The Mission"}</h3>
                </div>
                <div className={styles.aboutText}>
                    <p><strong>Polyglot Air</strong> {t.missionText1?.replace("Polyglot Air", "") || "was born from a simple need..."}</p>
                    <p>{t.missionText2 || "By integrating with..."}</p>
                    <p>{t.missionText3 || "But it doesn't stop there..."}</p>
                </div>
            </div>

            <div className={styles.modernCard}>
                <div className={styles.cardHeader}>
                    <h3>{t.developerTitle || "About the Developer"}</h3>
                </div>
                <div className={styles.aboutText}>
                    <p>{t.developerText1 || "I hold a Bachelor's degree..."}</p>
                    <p>{t.developerText2 || "I specialize in..."}</p>
                    <p>{t.developerText3 || "I am driven by..."}</p>
                </div>

                <div className={styles.socialLinks}>
                    <button onClick={() => handleLink('https://github.com/andersondanieln')} className={styles.socialBtn}>
                        <GithubIcon /> GitHub
                    </button>
                    <button onClick={() => handleLink('https://www.linkedin.com/in/andersondn')} className={styles.socialBtn}>
                        <LinkedinIcon /> LinkedIn
                    </button>
                    <button onClick={() => handleLink('https://andercoder.com')} className={styles.socialBtn}>
                        <GlobeIcon /> Website
                    </button>
                </div>
            </div>

            <div className={styles.cheatSheetCard} style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <h4 style={{ margin: 0, color: 'var(--text-color)' }}>{t.creditsTitle || "Credits & Licenses"}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--subtext-color)', margin: 0 }}>
                    {t.soundCreditPre || "Sound Effect by"} <a href="#" onClick={(e) => { e.preventDefault(); handleLink('https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=96243'); }} style={{ color: 'var(--primary-color)' }}>freesound_community</a> {t.soundCreditFrom || "from"} <a href="#" onClick={(e) => { e.preventDefault(); handleLink('https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=96243'); }} style={{ color: 'var(--primary-color)' }}>Pixabay</a>.
                </p>
            </div>
        </div>
    );
};

export default AboutView;