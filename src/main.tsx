import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/Global.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

// The div#root is in index.html, so it is always there — `!` tells TypeScript so.
//
// The root is exported so a test that mounts this file for real can unmount it
// again. Nothing in the browser ever uses it: a page that closes takes the root
// with it.
export const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
