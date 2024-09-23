import { useState, useEffect } from 'react'
import './MainMenuButton.css'
import closeIcon from '../../assets/icons/Close-icon-(1).svg'
import openIcon from '../../assets/icons/Menu-Alt.svg'

export default function MainMenuButton({ inMenu = false, onClick }) {
    return (
        <button 
            type='button' 
            id='main-menu-button'
            onClick={onClick}
        >
            {inMenu
                ? <img src={closeIcon} alt='Close Menu' />
                : <img src={openIcon} alt='Open Menu' />}
        </button>
    )
}
