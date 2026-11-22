import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SavingsPage from './pages/SavingsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SavingsPage />
  </StrictMode>,
)
