import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, createRoutesFromElements } from 'react-router-dom'
// Enable Orange ID integration
import { PassportProvider } from './components/auth/index.jsx'
import { AuthCallback } from './components/auth/index.jsx'
import '@bedrock_org/passport/dist/style.css'

// Suppress React Router future flag warnings
const originalConsoleWarn = console.warn;
console.warn = function(msg, ...args) {
  if (typeof msg === 'string' && (
    msg.includes('React Router Future Flag Warning') || 
    msg.includes('v7_startTransition') || 
    msg.includes('v7_relativeSplatPath')
  )) {
    // Suppress these specific warnings
    return;
  }
  originalConsoleWarn(msg, ...args);
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

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

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
