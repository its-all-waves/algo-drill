import { useState, useEffect } from 'react'
import './App.css'

import Char from './components/CodeInput/Char'

import CodeInput from './components/CodeInput/CodeInput'
import Line from './components/CodeInput/Line'
import TextBox from './components/CodeInput/TextBox'


const NON_BREAKING_SPACE_UNICODE = '\u00A0'  // &nbsp; in html
const SPACE = ' '
const TAB_WIDTH = 4
const TAB = SPACE.repeat(TAB_WIDTH)

const LINE_WIDTH_CHARS = 20

const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/? "

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
    }, [charIndex, /* lineIndex */])

    // DEBUG
    useEffect(() => {
        console.log('updated active coords: ', lineIndex, charIndex)
    }, [charIndex, lineIndex]);

    const linesOfText = text.split('\n')
    for (let i = 0; i < linesOfText.length; i++) { linesOfText[i] += '\n' }  // use .length - 1 to exclude the last line
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
                                        isControlChar={char === '\n'}
                                    >
                                        {char === ' '
                                            ? NON_BREAKING_SPACE_UNICODE
                                            : char === '\n'
                                                ? '⏎'
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

        const keyCanPrint =
            (SRC_CODE_CHARS + 'Enter' + 'Tab' + 'Backspace').includes(key)
        if (!keyCanPrint) return

        if (key === 'Backspace') {
            // TODO: account for tabs -- ? equiv to 4 spaces ? so if we detect 4 spaces, behind us, then delete TAB_WIDTH and decrement TAB_WIDTH
            const prevChars = prevTabWidthChars()
            
            let decrement
            if (prevChars === TAB) {
                decrement = TAB_WIDTH
                const prevIndices = decrementCharIndex(decrement)
            } else {
                decrement = 1
                const prevIndices = decrementCharIndex(decrement)
                if (!prevIndices) return  // can't go back further than the 1st char
            }
            return  // do nothing else, leave the func
        }

        const keyIsSourceCodeChar = SRC_CODE_CHARS.includes(key)
        if (keyIsSourceCodeChar) {
            const keyIsCorrect = key === charFromText
            if (keyIsCorrect) {
                console.log('🟩')
            } else {
                console.log('🟥')
            }
            if (!incrementCharIndex(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Enter') {
            const keyIsCorrect = '\n' === charFromText
            if (keyIsCorrect) {
                console.log('🟩')
            } else {
                console.log('🟥')
            }
            if (!incrementCharIndex(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Tab') {
            const nextChars = nextTabWidthChars()
            const keyIsCorrect = nextChars === TAB
            if (keyIsCorrect) {
                console.log('🟩')
            } else {
                console.log('🟥')
            }
            if (!incrementCharIndex(TAB_WIDTH)) {
                setTestComplete(true)
                return
            }
        }


    }

    /** Returns `null` if on the last character, or [nextLineIndex, nextCharIndex] if did increment */
    function incrementCharIndex(amount) {
        const nextLineIndex = lineIndex + 1
        if (nextLineIndex > lineCount) throw new Error(`Incrementing the line index by "${amount}" results in an out of range index`)

        const activeLineLength = linesOfText[lineIndex].length
        const nextCharIndex = charIndex + amount
        const incrementIsTooLarge = nextCharIndex > activeLineLength
        if (incrementIsTooLarge) throw new Error(`Incrementing the line index by "${amount}" results in an out of range index`)

        const onLastLine = lineIndex === lineCount - 1
        const atEndOfLine = charIndex === activeLineLength - 1
        const onLastChar = onLastLine && atEndOfLine
        if (onLastChar) return null

        setCharIndex(atEndOfLine ? 0 : nextCharIndex)
        if (atEndOfLine && !onLastLine) setLineIndex(nextLineIndex)

        return [nextLineIndex, nextCharIndex]
    }

    function decrementCharIndex(amount) {
        amount = Math.abs(amount)
        
        const atStartOfLine = charIndex === 0
        const onFirstLine = lineIndex === 0
        const onFirstChar = onFirstLine && atStartOfLine
        if (onFirstChar) return null

        
        let prevCharIndex = -1
        if (!atStartOfLine) {
            prevCharIndex = charIndex - amount
            setCharIndex(prevCharIndex)
        } else {
            // get index of end of prev line
            const lastCharOnPrevLineIndex = linesOfText[lineIndex - 1].length - 1
            setCharIndex(lastCharOnPrevLineIndex)
        }

        let outputLineIndex = lineIndex
        if (atStartOfLine && !onFirstLine) {
            outputLineIndex = lineIndex - 1
            setLineIndex(outputLineIndex)
        }     

        return [outputLineIndex, prevCharIndex]
    }

    /** Returns the next `TAB_WIDTH` chars from `linesOfText` */
    function nextTabWidthChars() {
        const lineIsShorterThanTabWidth = 
            linesOfText[lineIndex].length < TAB_WIDTH
        if (lineIsShorterThanTabWidth) return null

        return linesOfText[lineIndex /* + 1 */]
            .substring(charIndex, charIndex + TAB_WIDTH)
    }

    function prevTabWidthChars() {
        // if 4 or more chars are left in this line (tab won't span more than 1 line)

        // if less than 4 ahead of start of line
        if (charIndex < 3) return null

        return linesOfText[lineIndex].substring(charIndex - 4, charIndex)
    }
}

function charId(lineIndex, charIndex) {
    return `char-${lineIndex}-${charIndex}`
}

function lineId(lineIndex) {
    return `line-${lineIndex}`
}