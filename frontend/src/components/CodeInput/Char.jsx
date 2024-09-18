import './Char.css'

export default function Char({
    children, 
    id = -1,
    charNumber,
    active = false, 
    wrong = false,
    correct = false,
    isControlChar = false
}) {
    if (wrong && correct) throw new Error("Can't be wrong and right!")
    let classes = 'char'
    if (active) classes += ' active'
    if (correct) classes += ' correct'
    if (wrong) classes += ' wrong'
    if (isControlChar) classes += ' faded'
    return (
        <span id={'char-'+id} className={classes} data-char-number={charNumber}>{children}</span>
    )
s}