import { useEffect, useState } from 'react'
import './CodeInput.css'

const BACKEND = 'http://localhost:8000'

export default function CodeInput() {
    const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/? "

    let algoText = `for:
    thingy = 42
    print(thingy)`
   
    return (
        <>
            <div id="CodeInput">
                <TypingInputBackground
                    content={algoText} />
                <TypingInput
                    onKeyDown={onTextInput} />
            </div>
        </>
    )
}

function TypingInput({ onKeyDown, }) {
    return <div
        id="typing-input"
        name="typing-input"
        contentEditable
        onKeyDown={onKeyDown}
        tabIndex={0}
    ></div>
}