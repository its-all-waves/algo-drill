import { } from 'react-router'
import { Outlet } from 'react-router-dom'

import MainMenuButton from '../components/MainMenu/MainMenuButton'
import MainMenu from '../components/MainMenu/MainMenu'
import { useEffect, useState } from 'react'

export default function Root() {
    const [menuOpen, setMenuOpen] = useState(false)

    // DEBUG
    useEffect(() => { console.log(menuOpen) }, [menuOpen])

    return <>
        <div id='main'>
            <Outlet context={{ setMenuOpen }}/>
        </div>
        
        {menuOpen && // remove this line & menu slides in from off-screen
        <MainMenu isOpen={menuOpen} setIsOpen={setMenuOpen}/>}
    </>
    
}