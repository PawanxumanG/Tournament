
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (rootElement && rootElement.children.length === 0) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
