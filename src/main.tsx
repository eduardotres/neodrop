import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import CookieBanner from './components/CookieBanner'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CookieBanner />
  </StrictMode>,
)
