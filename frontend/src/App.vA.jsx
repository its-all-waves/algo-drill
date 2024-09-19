import { useEffect, useRef, useState } from 'react'
import './App.css'

const BACKEND = 'http://localhost:8000'

export default function App() {
    const [algoText, setAlgoText] = useState(
        `for:
    thingy = 42
    print(thingy)`
    )

    const [typedText, setTypedText] = useState('')
    const [correctKeys, setCorrectKeys] = useState([])
    const [missedKeys, setMissedKeys] = useState([])

    // useEffect(() => {
    //     console.log(typedText)
    // }, [typedText])

    useEffect(() => {
        console.log('correct:', correctKeys.join(''))
    }, [correctKeys])

    useEffect(() => {
        console.log('missed:', missedKeys)
    }, [missedKeys])

    // TODO: use tabs for in algo -- then convert tabs to spaces (use spaces in dummy for now)

    return (
        <>
            <div id="wrapper">
                <TypingInputBackground
                    content={algoText}
                    setContent={setAlgoText} />
                <TypingInput
                    content={typedText}
                    setContent={setTypedText}
                    algoText={algoText}
                    correctKeys={correctKeys}
                    setCorrectKeys={setCorrectKeys}
                    missedKeys={missedKeys}
                    setMissedKeys={setMissedKeys} />
            </div>
        </>
    )
}

function TypingInput({ content, setContent, algoText, correctKeys, setCorrectKeys, missedKeys, setMissedKeys }) {
    const [textIndex, setTextIndex] = useState(0)

    useEffect(() => {
        // console.log('textIndex:', textIndex)
    }, [textIndex])

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault()

            const SPACES = '\u00a0\u00a0\u00a0\u00a0'
            const TAB_NODE =
                document.createTextNode(SPACES /* '\u0009' */) // TODO: try Tab '&#9'

            const selection = document.getSelection()
            const range = selection.getRangeAt(0)

            // insert a 'tab'
            range.insertNode(TAB_NODE)

            // set cursor position
            range.setStartAfter(TAB_NODE)
            range.setEndAfter(TAB_NODE)
            selection.removeAllRanges()
            selection.addRange(range)

            // TODO: check if this keystroke is correct
            if (algoText.substring(textIndex, textIndex + 4) === SPACES) {
                console.log('🟩')
            }

            setContent(content + '    ')
            setTextIndex(content.length + 4)

        } else if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
            e.preventDefault()  // do nothing
            return

        } else if (e.metaKey || e.ctrlKey) {
            e.preventDefault() // do nothing
            return

        } else if (e.key === 'Backspace') {
            const inputLength = content.length
            if (inputLength === 0) return
            setContent(content.substring(0, content.length - 1))
            setTextIndex(content.length - 1)

        } else if (
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
        ) {
            // ignore arrow keys -- TODO: do i want this?
            e.preventDefault()
            return

        } else {
            // add chars to textContent...
            const isAsciiChar = e.keyCode >= 32 && e.keyCode <= 126
                && !['Meta'].includes(e.key)
                || ['`', ':', ',', 'Enter', '=', '-', '_', '|'].includes(e.key)
            if (!isAsciiChar) return

            if (e.key === 'Enter') e.key = '\n'

            setContent(content + e.key)
            setTextIndex(content.length + 1)

            // console.log('key is valid')
            // console.log('key & code:', e.key, e.keyCode)
            console.log('typed key : algo key:', e.key, ':', algoText[textIndex])

            // TODO: check if this keystroke is correct
            const algoKey = algoText[textIndex]
            const keyIsCorrect = e.key === algoKey
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectKeys([...correctKeys, algoKey])
            } else {
                console.log('🟥')
                setMissedKeys([...missedKeys, algoKey])
            }

            // check if this is the last key, respond
            const algoLength = algoText.length
            const correctKeyScore = correctKeys.length / algoLength
            console.log('score:', correctKeyScore)
            const isLastKeyInAlgo = textIndex === algoLength - 1
            if (isLastKeyInAlgo) {
                alert(`
                    Complete!
                    Score (correct keys / total keys): ${correctKeyScore * 100}%
                    `)
            }
        }

        // TODO: save bad keystrokes in an array to show the user later
    }

    function handleClick(e) {
        e.preventDefault()
        const editorElem = e.target
        moveCursorToEnd(editorElem)
        editorElem.focus()
    }

    function moveCursorToEnd(editorElem) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.setStart(editorElem, editorElem.childNodes.length)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    return <div>
        <pre
            id="typing-input"
            name="typing-input"
            contentEditable
            onChange={(e) => setContent(e.target.textContent)}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
        >
            {/* {value} */}
        </pre>
    </div>
}

function TypingInputBackground({ content }) {
    return <div>
        <pre id="typing-input-background">
            {content}
        </pre>
    </div>
}