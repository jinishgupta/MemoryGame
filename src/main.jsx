import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import memoryIcon from './assets/memory-icon.svg'

// Set favicon
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/svg+xml'
link.href = memoryIcon
document.head.appendChild(link)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
