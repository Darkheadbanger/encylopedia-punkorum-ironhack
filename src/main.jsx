import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/Global.css'
import App from './App.jsx'
// Import Google Fonts in CSS instead, e.g. in src/styles/Global.css add:


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
