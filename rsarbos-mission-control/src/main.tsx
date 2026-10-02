import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import './styles/tailwind.css'
import './styles/animated.css'
import { initializeAnalytics } from './utils/analytics'

const container = document.getElementById('app')!
const root = createRoot(container)
initializeAnalytics()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
