import { useEffect } from 'react'
import './GlassPane.css'

export default function GlassPane({ inFocus = false, children }) {
    let classes = []
    if (inFocus) classes.push('focus')
    classes = classes.join(' ')
    return (
        <div className={'glass-pane ' + classes}>
            {children}
        </div>
    )
}