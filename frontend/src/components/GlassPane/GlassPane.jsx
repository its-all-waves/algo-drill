import { useEffect } from 'react'
import './GlassPane.css'

export default function GlassPane({ inFocus = false, children }) {
    
    useEffect(() => { console.log('glass pane sees focus')}, [inFocus])
        let classes = 'glass-pane'
        if (inFocus) classes += ' focus'
    return (
        <div className={'glass-pane ' + (inFocus ? 'focus ' : '')}>
            {children}
        </div>
    )
}