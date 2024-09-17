import { useState, useEffect } from 'react'
import './App.css'

import Char from './components/CodeInput/Char'

import CodeInput from './components/CodeInput/CodeInput'
import Line from './components/CodeInput/Line'
import TextBox from './components/CodeInput/TextBox'


const NON_BREAKING_SPACE_UNICODE = '\u00A0'  // &nbsp; in html
const TAB_WIDTH = 4

const LINE_WIDTH_CHARS = 20

const root = document.querySelector(':root')
root.style.setProperty('--line-width-chars', LINE_WIDTH_CHARS)


export default function App() {

    const text = `for:
    thingy = 42
    print(thingy)`

    const [textComplete, setTestComplete] = useState(false)
    const [lineIndex, setLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)

    let activeLineId = lineId(lineIndex)
    useEffect(() => {
        activeLineId = lineId(lineIndex)
    }, [lineIndex])

    let activeCharId = charId(lineIndex, charIndex)
    let charFromText = text[0]
    useEffect(() => {
        activeCharId = charId(lineIndex, charIndex)
        charFromText = linesOfText[lineIndex][charIndex]
    }, [charIndex, /* activeLineIndex */])

    const linesOfText = text.split('\n')
    const lineCount = linesOfText.length

    return <>
        <div style={{ margin: '1rem' }}>
            <TextBox onKeyDown={onKeyDown}>
                {linesOfText.map((line, lineIndex) => {
                    return (
                        <Line key={lineIndex} id={lineId(lineIndex)}>
                            {[...line].map((char, charIndex) => {
                                const id = charId(lineIndex, charIndex)
                                return (
                                    <Char
                                        key={id}
                                        id={id}
                                        active={id === activeCharId}
                                    >
                                        {char === ' '
                                            ? NON_BREAKING_SPACE_UNICODE
                                            : char}
                                    </Char>
                                )
                            })}
                        </Line>
                    )
                })}
            </TextBox>
        </div>
    </>

    function onKeyDown(event) {
        event.preventDefault()
        const { key } = event

        if (!incrementCharIndex()) {
            setTestComplete(true)
            return
        }

        const keyIsCorrect = key === charFromText
        if (keyIsCorrect) {
            console.log('🟩')
        } else {
            console.log('🟥')
        }
    }

    /** Returns `false` if on the last character, or `true` if did increment */
    function incrementCharIndex() {
        const activeLineLength = linesOfText[lineIndex].length
        const onLastChar = lineIndex === lineCount - 1
            && charIndex === activeLineLength - 1
        if (onLastChar) return false

        const atEndOfLine = charIndex === activeLineLength - 1
        const onLastLine = lineIndex === lineCount - 1

        setCharIndex(atEndOfLine ? 0 : charIndex + 1)
        if (atEndOfLine && !onLastLine) {
            setLineIndex(lineIndex + 1)
        }

        return true
    }
}

function charId(lineIndex, charIndex) {
    return `char-${lineIndex}-${charIndex}`
}

function lineId(lineIndex) {
    return `line-${lineIndex}`
}