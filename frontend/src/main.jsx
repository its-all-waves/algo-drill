import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


// DEBUG
// import App from './App.jsx'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import './index.css'
import Root from './routes/Root'
import LandingView from './routes/LandingView/LandingView'
import TypingTestView from './routes/TypingTestView/TypingTestView'


export const router = createBrowserRouter([
	{
		path: '/',
		element:  <Root />,
        errorElement: null,
        children: [
			{
				index: true,
				element: <LandingView />
			},
			{
				path: '/test',
				element: <TypingTestView />
			}
        ],
	},
])

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <RouterProvider router={router} />
    // </StrictMode>,
)
