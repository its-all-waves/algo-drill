import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// DEBUG
import App from './App.jsx'
import './App.css'

import MainMenu from './components/MainMenu/MainMenu'
import GlassPane from './components/shared/GlassPane'
import LandingView from './components/LandingView/LandingView'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // <App />
  // <TextBox />
  // <GlassPane />
  // <MainMenu />
  <LandingView />
  // </StrictMode>,
)
