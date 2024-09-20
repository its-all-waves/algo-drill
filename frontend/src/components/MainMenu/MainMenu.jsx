import { useState, useEffect } from 'react'
import './MainMenu.css'
import MainMenuButton from './MainMenuButton'

export default function MainMenu({ isLoggedIn = true, }) {
    const MENU_OPTIONS_LOGGED_IN = [
        {
            text: 'Start',
            onClick() {
                console.log('pressed Start')
            }
        },
        {
            text: 'My Stuff',
            onClick() {
                console.log('pressed My Stuff')
            }
        },
        {
            text: 'Submit an Algo',
            onClick() {
                console.log('pressed Submit an Algo')
            }
        },
        {
            text: 'Log Out',
            onClick() {
                console.log('pressed Log Out')
            }
        }
    ]

    const MENU_OPTIONS_LOGGED_OUT = [
        {
            text: 'Start',
            onClick() {
                console.log('pressed Start')
            }
        },
        {
            text: 'Log In',
            onClick() {
                console.log('pressed Log In')
            }
        }
    ]

    const [menuOptions, setMenuOptions] = useState([])

    useEffect(() => {
        setMenuOptions(
            isLoggedIn
                ? MENU_OPTIONS_LOGGED_IN
                : MENU_OPTIONS_LOGGED_OUT
        )
    }, [isLoggedIn])

    return (
        <div id='main-menu'>
            <MainMenuButton inMenu={true} />
            {menuOptions.map(btn => {
                return (
                    <MenuOptionButton
                        key={btn.text}
                        text={btn.text}
                        onClick={btn.onClick} />
                )
            })}
        </div>
    )
}

function MenuOptionButton({ text, onClick }) {
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

