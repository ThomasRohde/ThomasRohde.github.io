import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

function addVersionToAssets() {
  const version = new Date().getTime(); // Use timestamp as version
  document.querySelectorAll('script, link[rel="stylesheet"]').forEach(el => {
    if (el.src) {
      el.src = `${el.src}?v=${version}`;
    } else if (el.href) {
      el.href = `${el.href}?v=${version}`;
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        registration.update();

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (confirm('New content is available. Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      }).catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }
}

// For non-PWA scenarios, add this to force reloads
window.addEventListener('load', function() {
  if (!navigator.serviceWorker.controller) {
    addVersionToAssets();
  }
});

// Register service worker
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)