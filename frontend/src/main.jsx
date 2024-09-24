import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'

import './index.css'

import Root from './routes/Root'

import LandingView, { 
	loader as landingViewLoader
} from './routes/LandingView/LandingView'

import TypingTestView, { loader as typingTestViewLoader } from './routes/TypingTestView/TypingTestView'


export const router = createBrowserRouter([
	{
		path: '/',
		element:  <Root />,
        errorElement: null,
        children: [
			{
				index: true,
				element: <LandingView />,
				loader: landingViewLoader,
			},
			{
				path: '/test',
				element: <TypingTestView />,
				loader: typingTestViewLoader,
			}
        ],
	},
])

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <RouterProvider router={router} />
    // </StrictMode>,
)
