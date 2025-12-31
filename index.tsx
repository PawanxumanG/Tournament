import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

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
    // Dismiss loader immediately after render call
    dismissLoader();
  } catch (err: any) {
    console.error("Mount error:", err);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.textContent = "MOUNT ERROR: " + err.message;
    }
  }
}