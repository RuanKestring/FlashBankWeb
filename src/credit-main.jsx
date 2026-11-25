import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreditPage from './pages/CreditPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CreditPage />
  </StrictMode>,
)
