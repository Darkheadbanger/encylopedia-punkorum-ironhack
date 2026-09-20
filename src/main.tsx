import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/Global.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

// The div#root is in index.html, so it is always there — `!` tells TypeScript so.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />      
    </Router>
  </StrictMode>,
)
