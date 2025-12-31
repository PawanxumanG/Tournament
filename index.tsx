import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Dismisses the boot loader once the application logic starts
 */
const dismissLoader = () => {
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
    
    // Call dismissal immediately to get the loader out of the way
    dismissLoader();
    
    // Safety check for complex loading scenarios
    window.addEventListener('load', dismissLoader);
  } catch (err: any) {
    console.error("Critical Render Error:", err);
    const errBox = document.getElementById('error-display');
    if (errBox) {
      errBox.style.display = 'block';
      errBox.textContent = `MOUNT ERROR: ${err.message || 'Unknown'}`;
    }
  }
}