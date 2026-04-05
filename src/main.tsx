import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BlackjackRoyalApp } from './BlackjackRoyalApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlackjackRoyalApp />
  </StrictMode>,
)
