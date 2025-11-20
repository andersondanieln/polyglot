import { useState, useEffect } from 'react';
import { useSettings } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import OfflineModal from './components/OfflineModal';
import TutorialModal from './components/TutorialModal';

import HomeView from './views/HomeView';
import ActionsView from './views/ActionsView';
import HistoryView from './views/HistoryView';
import SettingsView from './views/SettingsView';
import AboutView from './views/AboutView';

import styles from './styles/App.module.css';
import { useTranslations } from './hooks/useTranslations';

const App: React.FC = () => {
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [activeView, setActiveView] = useState('home');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { settings } = useSettings();
  const t = useTranslations();

  const retryConnection = () => {
    setOllamaStatus('checking');
    window.api.checkOllamaStatus().then((status) => {
      setOllamaStatus(status.success ? 'online' : 'offline');
    });
  };

  const playAudio = () => {
      try {
          const audio = new Audio('/sounds/beep.mp3');
          
          audio.volume = 0.5;
          
          audio.play().catch(err => console.warn("Audio blocked or failed:", err));

      } catch (error) {
          console.error("Error initializing audio:", error);
      }
  };

  useEffect(() => {
    retryConnection();
    const cleanupStatusListener = window.api.onOllamaStatusChanged(({ status }) => setOllamaStatus(status as any));
    const cleanupProcessingListener = window.api.onProcessingStatusChanged(({ status }) => {
        document.body.style.cursor = status === 'start' ? 'wait' : 'default';
    });
    const cleanupSoundListener = window.api.onPlaySound(() => {
        playAudio();
    });

    return () => {
      cleanupStatusListener();
      cleanupProcessingListener();
      cleanupSoundListener();
    };
  }, []);

  if (ollamaStatus === 'offline') return <OfflineModal onRetry={retryConnection} />;
  
  if (ollamaStatus === 'checking' || !settings || !t.loadingOllama) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t.loadingOllama || 'Connecting to API...'}</p>
      </div>
    );
  }

  const renderView = () => {
      switch(activeView) {
          case 'home': return <HomeView onOpenTutorial={() => setIsTutorialOpen(true)} />;
          case 'actions': return <ActionsView />;
          case 'history': return <HistoryView />;
          case 'settings': return <SettingsView />;
          case 'about': return <AboutView />;
          default: return <HomeView onOpenTutorial={() => setIsTutorialOpen(true)} />;
      }
  };

  return (
    <div className={styles.appContainer}>
      {isTutorialOpen && <TutorialModal onClose={() => setIsTutorialOpen(false)} />}
      
      <Header 
        ollamaStatus={ollamaStatus} 
        onHelpClick={() => setIsTutorialOpen(true)} 
      />
      
      <div className={styles.contentWrapper}>
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className={styles.mainContent}>
            {renderView()}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;