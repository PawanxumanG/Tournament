import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Dismisses the initialization overlay with a smooth fade
 */
const hideInitializationOverlay = () => {
  const loader = document.getElementById('fallback-loader');
  if (loader && loader.style.display !== 'none') {
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
    
    // Attempt to hide loader as soon as React starts rendering
    hideInitializationOverlay();
    
    // Failsafe triggers for hiding the loader
    if (document.readyState === 'complete') {
      hideInitializationOverlay();
    } else {
      window.addEventListener('load', hideInitializationOverlay);
      // Absolute maximum wait time
      setTimeout(hideInitializationOverlay, 3000);
    }
  } catch (err: any) {
    console.error("Critical Render Failure:", err);
    const errorBox = document.getElementById('error-display');
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.textContent = `RENDER ERROR: ${err.message || 'Unknown'}`;
    }
  }
}