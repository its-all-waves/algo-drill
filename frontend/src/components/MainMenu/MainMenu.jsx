import { useState, useEffect } from 'react'

import './MainMenu.css'

import closeIcon from '../../assets/icons/Close-icon-(1).svg'

export default function MainMenu({ isOpen, setIsOpen, isLoggedIn = true, }) {
    const MENU_OPTIONS_LOGGED_IN = [
        {
            text: 'Start',
            onClick() { console.log('pressed Start') }
        },
        {
            text: 'My Stuff',
            onClick() { console.log('pressed My Stuff') }
        },
        {
            text: 'Submit an Algo',
            onClick() { console.log('pressed Submit an Algo') }
        },
        {
            text: 'Log Out',
            onClick() { console.log('pressed Log Out') }
        }
    ]
    const MENU_OPTIONS_LOGGED_OUT = [
        {
            text: 'Start',
            onClick() { console.log('pressed Start') }
        },
        {
            text: 'Log In',
            onClick() { console.log('pressed Log In') }
        }
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
                    <MenuOption
                        key={btn.text}
                        text={btn.text}
                        onClick={btn.onClick} />
                )
            })}
        </div>
    )
}

function MenuOption({ text, onClick }) {
    return (
        <button
            type="button"
            className='button'
            onClick={onClick}
        >
            {text}
        </button>
    )
}

