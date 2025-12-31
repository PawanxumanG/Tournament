import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Loader dismissal logic
const hideLoader = () => {
  const loader = document.getElementById('fallback-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Attempt to hide loader immediately after render call
    hideLoader();
    
    // Backup triggers
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
      setTimeout(hideLoader, 2000);
    }
  } catch (err) {
    console.error("Mount error:", err);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.textContent = `MOUNT ERROR: ${err.message}`;
    }
  }
}