import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, createRoutesFromElements } from 'react-router-dom'
// Enable Orange ID integration
import { PassportProvider } from './components/auth/index.jsx'
import { AuthCallback } from './components/auth/index.jsx'
import '@bedrock_org/passport/dist/style.css'
// Import Firebase to ensure it's initialized
import firebaseApp from './firebase/config.js'

// Suppress React Router future flag warnings
const originalConsoleWarn = console.warn;
console.warn = function(msg, ...args) {
  if (typeof msg === 'string' && (
    msg.includes('React Router Future Flag Warning') || 
    msg.includes('v7_startTransition') || 
    msg.includes('v7_relativeSplatPath') ||
    msg.includes('FirebaseError') ||
    msg.includes('CONFIGURATION_NOT_FOUND') ||
    msg.includes('getProjectConfig')
  )) {
    // Suppress these specific warnings
    return;
  }
  originalConsoleWarn(msg, ...args);
};

// Also suppress certain errors
const originalConsoleError = console.error;
console.error = function(msg, ...args) {
  if (typeof msg === 'string' && (
    msg.includes('FirebaseError') ||
    msg.includes('CONFIGURATION_NOT_FOUND') ||
    msg.includes('getProjectConfig')
  )) {
    // Suppress these specific errors
    return;
  }
  originalConsoleError(msg, ...args);
};

try {
  // Dynamically import memory icon
  import('./assets/memory-icon.svg')
    .then(module => {
      const memoryIcon = module.default;
      
      // Set favicon
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      link.href = memoryIcon
      document.head.appendChild(link)
    })
    .catch(err => {
      console.warn('Could not load favicon:', err);
    });
} catch (e) {
  console.warn('Error setting favicon:', e);
}

const root = document.getElementById('root');

// Add mobile viewport height fix
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Update after a small delay to ensure accurate calculation
setTimeout(setViewportHeight, 100);

// Update on resize, orientation change, and scroll
window.addEventListener('resize', () => {
  // Add small timeout to ensure the browser has completed any UI changes
  setTimeout(setViewportHeight, 50);
});
window.addEventListener('orientationchange', () => {
  // Orientation changes need a slightly longer delay
  setTimeout(setViewportHeight, 200);
});
window.addEventListener('scroll', setViewportHeight, { passive: true });

// Also update when document is fully loaded
document.addEventListener('DOMContentLoaded', setViewportHeight);

// Create an error handler for Firebase issues
window.addEventListener('error', (event) => {
  if (event.message.includes('Firebase') || 
      event.message.includes('CONFIGURATION_NOT_FOUND') ||
      event.message.includes('getProjectConfig')) {
    console.log('Suppressed Firebase error:', event.message);
    // Prevent the error from appearing in the console
    event.preventDefault();
  }
}, true);

createRoot(root).render(
  <React.StrictMode>
    {/* Enable Orange ID PassportProvider */}
    <PassportProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </PassportProvider>
  </React.StrictMode>,
)
