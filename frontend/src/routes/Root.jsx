import {} from 'react-router'
import { Outlet } from 'react-router-dom'

import MainMenu from '../components/MainMenu/MainMenu'

export default function Root() {
    return ( 

        <div id='main'>
            <Outlet />
        </div> 
    )
}