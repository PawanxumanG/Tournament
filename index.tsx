import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Immediate loader dismissal logic
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
  const root = ReactDOM.createRoot(rootElement);
  
  // Mount first
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Then hide loader
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Backup trigger in case load event already passed
    setTimeout(hideLoader, 1000);
  }
}