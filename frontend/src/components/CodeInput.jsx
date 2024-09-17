import { useEffect, useState } from 'react'
import './CodeInput.css'

const BACKEND = 'http://localhost:8000'

export default function CodeInput() {
    const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/? "

    let algoText = `for:
    thingy = 42
    print(thingy)`

    const [typedText, setTypedText] = useState('')

    const [currentLineElem, setCurrentLineElem] = useState(null) // need a ref to current line to know where to add a char / miss

    const [correctKeyCount, setCorrectKeyCount] = useState(0)

    const [missedKeys, setMissedKeys] = useState([])

    const [keyIndex, setKeyIndex] = useState(0)

    // useEffect(() => {
    //     console.log('SCORE:   ', correctKeyCount / keyIndex)
    //     console.log('correctKeyCount: ', correctKeyCount)
    //     console.log('keyIndex: ', keyIndex)
    // }, [correctKeyCount, missedKeys])

    useEffect(() => {
        console.log('typed at keyIndex: ', typedText[keyIndex])
    }, [])

    useEffect(() => { console.log(keyIndex) }, [keyIndex])

    function addLine(editor) {
        const line = document.createElement('div')
        line.className = 'line'
        editor.append(line)
        setCurrentLineElem(line)
        return line
    }

    function moveCursorToEnd(editorElem) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.setStart(editorElem, editorElem.childNodes.length)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    function onTextInput(event) {
        event.preventDefault()
        const { target: editorElem, key } = event

        let line = currentLineElem

        if (!editorElem.firstChild) {
            line = addLine(editorElem)
        }

        const reachedEndOfAlgo = keyIndex === algoText.length
        if (reachedEndOfAlgo) {
            editorElem.disabled = 'true'
            editorElem.style.pointerEvents = 'none'
            return
        }

        const ZERO_WIDTH_SPACE_HTML = '&ZeroWidthSpace;'  // or '&#8203' // add to innerHTML
        const ZERO_WIDTH_SPACE_JS = '\u200B'  // use for comparison in js

        // CATCH BACKSPACE, RETURN EARLY
        if (key === 'Backspace') {
            // case: empty editor -> prevent negative keyIndex
            const { firstChild } = editorElem
            if (!firstChild || firstChild.innerHTML === '') {
                return
            }

            // case: current line is empty
            if (line.innerHTML === '' || line.innerHTML === ZERO_WIDTH_SPACE_JS) {
                const oldLine = line
                line = line.previousElementSibling
                oldLine.remove()
                setCurrentLineElem(line)
            }

            // remove a char or a missed char
            line.lastChild.className === 'missed'
                ? line.lastChild.remove()
                : line.innerHTML = line.innerHTML.substring(0, line.innerHTML.length - 1)  // ...and yes, do it twice!

            // TODO: turn caret red when in a span.missed ?

            // TODO: handle modifiers

            setKeyIndex(keyIndex - 1)
            moveCursorToEnd(editorElem)
            return
        }


        // ONLY KEYS PRINTABLE IN SOURCE CODE BEYOND THIS POINT
        let keyIsCorrect = false

        if (key === 'Enter') {
            const NEW_LINE = '\n'
            line.innerHTML += NEW_LINE
            line = addLine(editorElem)
            line.innerHTML = ZERO_WIDTH_SPACE_HTML  // hack to get cursor at start of this new line

            keyIsCorrect = algoText[keyIndex] === NEW_LINE
            if (keyIsCorrect) {
                setCorrectKeyCount(correctKeyCount + 1)
                // console.log('🟩')
            } else {
                setMissedKeys([...missedKeys, algoText[keyIndex]])
                console.log('🟥')
            }

            setTypedText(typedText + NEW_LINE)
            setKeyIndex(keyIndex + 1)
            moveCursorToEnd(editorElem)
        }

        else if (key === 'Tab') {
            const SPACE = ' '
            const TAB = SPACE + SPACE + SPACE + SPACE
            line.innerHTML += TAB

            keyIsCorrect = algoText.substring(keyIndex, keyIndex + 4) === TAB
            if (keyIsCorrect) {
                setCorrectKeyCount(correctKeyCount + TAB.length)
                // console.log('🟩')
            } else {
                setMissedKeys([...missedKeys, algoText[keyIndex]])
                console.log('🟥')
            }

            setTypedText(typedText + TAB)
            setKeyIndex(keyIndex + 4)
            moveCursorToEnd(editorElem)
        }

        else if (SRC_CODE_CHARS.includes(key)) {
            const { innerHTML } = line
            if (innerHTML === ZERO_WIDTH_SPACE_JS) line.innerHTML = '' // remove the hack referenced above

            keyIsCorrect = key === algoText[keyIndex]
            if (keyIsCorrect) {
                line.innerHTML += key
                setCorrectKeyCount(correctKeyCount + 1)
                // console.log('🟩')
            } else {
                line.innerHTML += `<span class="missed">${key}</span>`
                setMissedKeys([...missedKeys, algoText[keyIndex]])
                console.log('🟥')
            }

            setTypedText(typedText + key)
            setKeyIndex(keyIndex + 1)
            moveCursorToEnd(editorElem)
        }

        else {
            return  // don't respond to any key not yet specified
        }

        // console.log('typed: ', key, 'algo: ', algoText[keyIndex])
    }

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

function TypingInputBackground({ content }) {
    return <pre id="typing-input-background">
        {content}
    </pre>
}