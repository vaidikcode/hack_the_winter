import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Initialize theme
const initializeTheme = () => {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

initializeTheme()

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
