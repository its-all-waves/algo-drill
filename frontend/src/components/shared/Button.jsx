import './Button.css'

/** General purpose button for the site */
export default function Button({
    text,
    onClick,
    color = 'primary',
    type = 'button'
}) {
    const BUTTON_COLORS = ['primary', 'secondary']
    if (!BUTTON_COLORS.includes(color)) throw new Error('Button color must be on of: ${BUTTON_COLORS}')

    return (
        <button
            type={type} className={'button ' + `bg-${color}`}
            onClick={onClick}
        >
            {text}
        </button>
    )
}