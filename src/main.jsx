import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
