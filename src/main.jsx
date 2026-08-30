import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import './index.css';

// Redirect www subdomains to non-www canonical city domain
if (typeof window !== 'undefined') {
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith('www.')) {
    const cleanHost = host.slice(4);
    window.location.replace(`https://${cleanHost}${window.location.pathname}${window.location.search}${window.location.hash}`);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Clear any stale webview caches on launch
if (typeof window !== 'undefined' && window.caches) {
  caches.keys().then(names => {
    for (let name of names) caches.delete(name);
  }).catch(() => {});
}

// Register Service Worker for PWA Offline support
if ('serviceWorker' in navigator) {
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}
