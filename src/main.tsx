import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import CriticalResourceLoader from './components/CriticalResourceLoader'

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <CriticalResourceLoader />
    <App />
  </HelmetProvider>
);
