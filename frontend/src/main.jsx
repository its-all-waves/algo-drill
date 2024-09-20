import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TextBox from './App.jsx'
import './index.css'

// DEBUG
import MainMenu from './components/MainMenu/MainMenu'
import './App.css'
import GlassPane from './components/GlassPane/GlassPane.jsx'



createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <TextBox />
    // <MainMenu />
    // <GlassPane />
  // </StrictMode>,
)
