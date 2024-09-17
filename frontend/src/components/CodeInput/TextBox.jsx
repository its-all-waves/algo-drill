import './TextBox.css'

export default function TextBox({
    children,
    onKeyDown
}) {

    return <>
        <div 
            className='text-box'
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            {children}
        </div>
    </>
}