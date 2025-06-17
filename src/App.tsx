import React, { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { SuspenseLoader } from './components';
import router from './routes';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './App.css';
import './layout/styles/Theme.css';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import '@ant-design/v5-patch-for-react-19';
import OfflineStatus from './components/offline-status';
import { Download } from 'lucide-react';

const { defaultAlgorithm, darkAlgorithm } = theme;

// Wrapper component to use the theme hook
const ThemedApp: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const isDarkMode = currentTheme === 'dark';

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    if ('onbeforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    return () => {
      if ('onbeforeinstallprompt' in window) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
      }
    };
  }, []);

  return (
    <>
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            padding: '5px 10px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 99999,
          }}
        >
          <Download size={16} />
        </button>
      )}

      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 4,
          },
        }}
      >
        <AntdApp>
          <Suspense fallback={<SuspenseLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </AntdApp>
      </ConfigProvider>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<SuspenseLoader />} persistor={persistor}>
        <ThemeProvider>
          <NotificationProvider>
            <SocketProvider url={process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'}>
              <ThemedApp />
              <OfflineStatus />
            </SocketProvider>
          </NotificationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
