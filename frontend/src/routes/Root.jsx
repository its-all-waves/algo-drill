import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import MainMenu from '../components/MainMenu/MainMenu'

import { RootContext } from '../rootContext'

export default function Root() {
    const [menuOpen, setMenuOpen] = useState(false)

    // DEBUG
    useEffect(() => { console.log(menuOpen) }, [menuOpen])

    return <>
        <div id='main'>
            <RootContext.Provider value={{ setMenuOpen }}>
                <Outlet />
            </RootContext.Provider>
        </div>

        {menuOpen && // remove this line & menu slides in from off-screen
            <MainMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />}
    </>

}

