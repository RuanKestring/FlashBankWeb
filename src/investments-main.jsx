import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InvestmentsPage from './pages/InvestmentsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InvestmentsPage />
  </StrictMode>,
)
