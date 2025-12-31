import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Ensures the initialization screen is removed smoothly
 */
const dismissLoader = () => {
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
    
    // Dismiss as soon as JS execution reaches this point
    dismissLoader();
    
    // Fallback dismissals for slow network conditions
    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      window.addEventListener('load', dismissLoader);
      setTimeout(dismissLoader, 2000); // Absolute safety timeout
    }
  } catch (err: any) {
    console.error("Critical boot error:", err);
    const errDisplay = document.getElementById('error-display');
    if (errDisplay) {
      errDisplay.style.display = 'block';
      errDisplay.textContent = "MOUNTING ERROR: " + err.message;
    }
  }
}