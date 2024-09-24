import { useState, useEffect } from 'react'

import './MainMenu.css'

import closeIcon from '../../assets/icons/Close-icon-(1).svg'
import { NavLink } from 'react-router-dom'

export default function MainMenu({ isOpen, setIsOpen, isLoggedIn = false, }) {
    const STATIC_MENU_OPTIONS = [
        { text: 'Start', route: '/' },
    ]
    const MENU_OPTIONS_LOGGED_IN = [
        ...STATIC_MENU_OPTIONS,
        { text: 'My Stuff', route: '#' },
        { text: 'Submit an Algo', route: '#' },
        { text: 'Log Out', route: '#' }
    ]
    const MENU_OPTIONS_LOGGED_OUT = [
        ...STATIC_MENU_OPTIONS,
        { text: 'Log In', route: '#' }
    ]

    const [menuOptions, setMenuOptions] = useState([])

    useEffect(() => {
        setMenuOptions(isLoggedIn
            ? MENU_OPTIONS_LOGGED_IN
            : MENU_OPTIONS_LOGGED_OUT
        )
    }, [isLoggedIn])

    return (
        <div id='main-menu' className={isOpen ? 'open' : ''}>
            <button
                type='button'
                className='main-menu-button'
                onClick={() => setIsOpen(false)}
            >
                <img src={closeIcon} alt='Close Menu' />
            </button>
            {menuOptions.map(btn => {
                return (
                    <NavLink key={btn.text}
                        to={btn.route}
                        onClick={() => setIsOpen(false)}
                        className='button'
                        // TODO: show active status on menu option
                        // className={( ({ isActive }) => (
                        //     isActive ? 'active' : ''
                        // ))}
                    >
                        {btn.text}
                    </NavLink>
                )
            })}
        </div>
    )
}