import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { initializeAnalytics } from './utils/analytics'

const container = document.getElementById('app')!
const root = createRoot(container)
initializeAnalytics()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
