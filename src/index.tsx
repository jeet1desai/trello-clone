import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// Register service worker for PWA
serviceWorker.register({
  onSuccess: () => console.log('Service Worker: Registration successful'),
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log('New content is available and will be used when all tabs are closed');
    if (window.confirm('New version available! Update now?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});

reportWebVitals();
