import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PassportProvider } from './components/auth'
import { AuthCallback } from './components/auth'
import '@bedrock_org/passport/dist/style.css'

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

createRoot(root).render(
  <React.StrictMode>
    <PassportProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </PassportProvider>
  </React.StrictMode>,
)
