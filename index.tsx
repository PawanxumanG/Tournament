import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Faster loader dismissal
const dismissLoader = () => {
  const loader = document.getElementById('fallback-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    // We render first, then dismiss. If render fails, dismissal won't happen 
    // but our global error handler in index.html will catch it.
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Immediate dismissal on script execution
    dismissLoader();

    // Secondary cleanup
    if (document.readyState === 'complete') {
        dismissLoader();
    } else {
        window.addEventListener('load', dismissLoader);
    }
  } catch (err: any) {
    console.error("Mounting error:", err);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.textContent = `REACT MOUNT ERROR: ${err.message || 'Check Console'}`;
    }
  }
}