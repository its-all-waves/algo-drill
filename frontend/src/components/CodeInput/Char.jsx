import './Char.css'

export default function Char({
    charId,
    status,
    active = false, 
    controlChar = false,
    children
}) {
    let classes = 'char'
    if (active) classes += ' active'
    if (status) classes += ` ${status}` 
    if (controlChar) classes += ' faded'
    return (
        <span className={classes} data-char-id={charId}>
            {children}
        </span>
    )
s}