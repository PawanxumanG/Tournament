
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  // Use a temporary observer to hide the loader only after content is actually rendered
  const observer = new MutationObserver(() => {
    if (rootElement.children.length > 0) {
      const loader = document.getElementById('fallback-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
      }
      observer.disconnect();
    }
  });
  observer.observe(rootElement, { childList: true });

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (document.readyState === 'complete') {
  mount();
} else {
  window.addEventListener('load', mount);
}
