import { createBrowserRouter } from 'react-router-dom'

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