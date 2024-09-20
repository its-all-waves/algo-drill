import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// DEBUG
import MainMenu from './components/MainMenu/MainMenu'
import './App.css'



createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // <App />
    <MainMenu />
  // </StrictMode>,
)
