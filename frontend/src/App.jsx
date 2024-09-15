import { useEffect, useRef, useState, createElement } from 'react'
import './App.css'

const BACKEND = 'http://localhost:8000'

export default function App() {
    const algoText = `
for:
    thingy = 42
    print(thingy)`

    const [typedText, setTypedText] = useState('')

    return (
        <>
            <div id="wrapper">
                <TypingInputBackground
                    content={algoText} />
                <TypingInput />
            </div>
        </>
    )
}

const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/? "

function TypingInput({ }) {
    // TODO: use a separate array for keeping track of actual typed character

    const [lineElems, setLineElems] = useState([])

    const [lineIndex, setLineIndex] = useState('-1')

    const [currentLine, setCurrentLine] = useState(null) // need a ref to current line to know where to add a char / miss

    const [typedText, setTypedText] = useState('')

    function addMiss(line) {
        const miss = document.createElement('span')
        miss.className = 'miss'
        line.appendChild(miss)
    }

    function addLine(editor) {
        const line = document.createElement('div')
        line.className = 'line'
        editor.append(line)
        setCurrentLine(line)
        return line
    }

    function moveCursorToEnd(editorElem) {
        const range = document.createRange()
        const selection = window.getSelection()
        // range.setStart(editorElem, editorElem.childNodes.length)
        // range.collapse(true)
        range.setEndAfter(editorElem.lastChild)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    function onKeyDown(event) {
        event.preventDefault()
        const { target: editorElem, key } = event

        let line = currentLine

        if (!editorElem.firstChild) {
            line = addLine(editorElem)
        }

        const ZERO_WIDTH_SPACE_HTML = '&ZeroWidthSpace;'  // or '&#8203' // add to innerHTML
        const ZERO_WIDTH_SPACE_JS = '\u200B'  // use for comparison in js

        if (key === 'Enter') {
            line = addLine(editorElem)
            line.innerHTML = ZERO_WIDTH_SPACE_HTML  // hack to get cursor at start of this new line
            moveCursorToEnd(editorElem)
            return
        }

        if (SRC_CODE_CHARS.includes(key)) {
            const { innerHTML } = line
            if (innerHTML === ZERO_WIDTH_SPACE_JS) line.innerHTML = '' // remove the hack referenced above
            
            // add the key everywhere (complete me a few lines down -- add to correct or missed)
            line.innerHTML += key
            // setTypedText(TypedText + key)

            // check correct or missed

            
            moveCursorToEnd(editorElem)
            return
        }

    }


    return <div
        id="typing-input"
        name="typing-input"
        contentEditable
        // onClick={(e) => e.target.focus()}
        onKeyDown={onKeyDown}
        tabIndex={0}
    // ref={thisElem}
    >
        {lineElems}
    </div>
}

function TypingInputBackground({ content }) {
    return <pre id="typing-input-background">
        {content}
    </pre>
}


function Line({ content, index }) {
    return <div className={'line'} key={index} >
        {content ?? ''}
    </div>
}

function MissedChar({ index }) {
    return <span className={'🟥'} key={index} />
}
