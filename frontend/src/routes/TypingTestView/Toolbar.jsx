import './Toolbar.css'
import menuButton from '../../assets/icons/Menu-Alt.svg'
import pauseButton from '../../assets/icons/button-pause.svg'
import restartButton from '../../assets/icons/button-restart.svg'
import abortButton from '../../assets/icons/button-abort.svg'

export default function Toolbar({ setMenuOpen }) {
    return (
        <div id="toolbar">
            <span>Algorithm :: Language</span>
            <div className='controls'>
                <button type="button">
                    <img src={pauseButton} alt="Pause Test"/>
                </button>
                <button type="button">
                    <img src={restartButton} alt="Restart Test" />
                </button>
                <button type="button">
                    <img src={abortButton} alt="Abort Test" />
                </button>
                <progress max={100} value={42} />
                <button 
                    type="button"
                    onClick={setMenuOpen}
                >
                    <img src={menuButton} alt="Main Menu" />
                </button>
            </div>
        </div>
    )
}