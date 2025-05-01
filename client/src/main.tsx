// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById("root")!).render(<App />);


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🆕 Import the PreferencesProvider
import { PreferencesProvider } from './context/PreferencesContext';

createRoot(document.getElementById("root")!).render(
  
  <PreferencesProvider>
    
    <App />
  </PreferencesProvider>
);
