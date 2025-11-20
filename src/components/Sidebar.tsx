import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Sidebar.module.css';

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ActionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
    const t = useTranslations();
    return (
        <nav className={styles.sidebar}>
            <div className={styles.menuGroup}>
                <button 
                    className={`${styles.menuItem} ${activeView === 'home' ? styles.active : ''}`}
                    onClick={() => onNavigate('home')}
                    title={t.sidebarHome || "Home"}
                >
                    <HomeIcon />
                </button>
                <button 
                    className={`${styles.menuItem} ${activeView === 'actions' ? styles.active : ''}`}
                    onClick={() => onNavigate('actions')}
                    title={t.sidebarActions || "Custom Actions"}
                >
                    <ActionsIcon />
                </button>
                <button 
                    className={`${styles.menuItem} ${activeView === 'history' ? styles.active : ''}`}
                    onClick={() => onNavigate('history')}
                    title={t.sidebarHistory || "History"}
                >
                    <HistoryIcon />
                </button>
            </div>
            <div className={styles.menuGroup}>
                <button 
                    className={`${styles.menuItem} ${activeView === 'settings' ? styles.active : ''}`}
                    onClick={() => onNavigate('settings')}
                    title={t.sidebarSettings || "Settings"}
                >
                    <SettingsIcon />
                </button>
                <button 
                    className={`${styles.menuItem} ${activeView === 'about' ? styles.active : ''}`}
                    onClick={() => onNavigate('about')}
                    title="About"
                >
                    <InfoIcon />
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;