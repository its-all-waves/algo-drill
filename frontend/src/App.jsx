import { useState, useEffect } from 'react'
import './App.css'

import Char from './components/CodeInput/Char'

import CodeInput from './components/CodeInput/CodeInput'
import Line from './components/CodeInput/Line'
import TextBox from './components/CodeInput/TextBox'


const NON_BREAKING_SPACE_UNICODE = '\u00A0'  // &nbsp; in html
const NON_BREAKING_SPACE_HTML = '&nbsp;'
const SPACE_CHAR_ASCII = ' '
const TAB_WIDTH = 4
const TAB = SPACE_CHAR_ASCII.repeat(TAB_WIDTH)

const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/?"

const LINE_WIDTH_CHARS_COUNT = 20
const root = document.querySelector(':root')
root.style.setProperty('--line-width-chars', LINE_WIDTH_CHARS_COUNT)


export default function App() {

    const [textSource, linesOfText] = prepared(
        `for:
    thingy = 42
    print(thingy)`
    )
    const lineCount = linesOfText.length

    // STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const [$testComplete, setTestComplete] = useState(false)
    const [$currLineIndex, setCurrLineIndex] = useState(0)
    const [$currCharIndex, setCurrCharIndex] = useState(0)

    const [$correctKeys, setCorrectKeys] = useState([])
    const [$missedChars, setMissedChars] = useState([])

    // DERIVED STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

    let $activeLineId = lineId($currLineIndex)

    useEffect(() => {
        $activeLineId = lineId($currLineIndex)
    }, [$currLineIndex])

    let $currentChar = textSource[0]

    useEffect(() => {
        $currentChar = linesOfText[$currLineIndex][$currCharIndex]
    }, [$currCharIndex])

    // let stats = {
    //     percentCorrect: 0 * 100,
    // }

    // useEffect(() => {  
    //     stats.percentCorrect = correctKeys.length / highestCharNumberReached === NaN ? 0 : correctKeys.length / highestCharNumberReached * 100
    //     console.log('- - - - percent correct : missed = ', `${stats.percentCorrect}%  :  ${missedChars.length}`)
    // }, [testComplete, charIndex])

    // END STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    useEffect(() => {
        console.log('updated active coords: ', $currLineIndex, $currCharIndex)
    }, [$currCharIndex, $currLineIndex])

    // useEffect(() => {
    //     console.log(': : : : : : char: ', linesOfText[lineIndex][charIndex - 1])
    // }, [charIndex])

    useEffect(() => {
        console.log('correct keys: ', $correctKeys)
    }, [$correctKeys])

    useEffect(() => {
        console.log('missed keys: ', $missedChars)
    }, [$missedChars])

    // END DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    let charNumber = 0

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
                                        active={id === charId($currLineIndex,
                                            $currCharIndex)}
                                        isControlChar={char === '\n'}
                                        charNumber={charNumber++}
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

        const keyCanPrint = (
            SRC_CODE_CHARS + SPACE_CHAR_ASCII + NON_BREAKING_SPACE_HTML
            + 'Enter' + 'Tab' + 'Backspace'
        ).includes(key)
        if (!keyCanPrint) return

        if (key === 'Backspace') {
            decrementCharIndex(prevTabWidthChars() === TAB ? TAB_WIDTH : 1)
            return
        }

        // DEBUG
        console.log(':::::: char: ', $currentChar)

        const keyIsSourceCodeChar = SRC_CODE_CHARS.includes(key)
        if (keyIsSourceCodeChar) {
            const keyIsCorrect = $currentChar === key
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectKeys([...$correctKeys, $currentChar])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, $currentChar])
            }
            if (!incrementCharIndex(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === SPACE_CHAR_ASCII) {
            const keyIsCorrect = $currentChar === SPACE_CHAR_ASCII
                || $currentChar === NON_BREAKING_SPACE_HTML  // may change which space char = space in `textSource`, hence the OR
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectKeys([...$correctKeys, 'Space'])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, 'Space'])
            }
            if (!incrementCharIndex(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Enter') {
            const keyIsCorrect = $currentChar === '\n'
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectKeys([...$correctKeys, key])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, key])
            }
            if (!incrementCharIndex(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Tab') {
            const nextChars = nextTabWidthChars()
            const keyIsCorrect = nextChars === TAB
            const tabAsSpaces = TAB.split('')
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectKeys([...$correctKeys, ...tabAsSpaces])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, ...tabAsSpaces])
            }
            if (!incrementCharIndex(TAB_WIDTH)) {
                setTestComplete(true)
                return
            }
        }
    }

    /** Returns `null` if on the last character, or [nextLineIndex, nextCharIndex] if did increment */
    function incrementCharIndex(amount) {
        const nextLineIndex = $currLineIndex + 1
        if (nextLineIndex > lineCount) throw new Error(`Incrementing the line index by "${amount}" results in an out of range index`)

        const activeLineLength = linesOfText[$currLineIndex].length
        const nextCharIndex = $currCharIndex + amount
        const incrementIsTooLarge = nextCharIndex > activeLineLength
        if (incrementIsTooLarge) throw new Error(`Incrementing the line index by "${amount}" results in an out of range index`)

        const onLastLine = $currLineIndex === lineCount - 1
        const atEndOfLine = $currCharIndex === activeLineLength - 1
        const onLastChar = onLastLine && atEndOfLine
        if (onLastChar) return null

        setCurrCharIndex(atEndOfLine ? 0 : nextCharIndex)
        if (atEndOfLine && !onLastLine) setCurrLineIndex(nextLineIndex)

        return [nextLineIndex, nextCharIndex]
    }

    function decrementCharIndex(amount) {
        amount = Math.abs(amount)

        const atStartOfLine = $currCharIndex === 0
        const onFirstLine = $currLineIndex === 0
        const onFirstChar = onFirstLine && atStartOfLine
        if (onFirstChar) return null


        let prevCharIndex = -1
        if (!atStartOfLine) {
            prevCharIndex = $currCharIndex - amount
            setCurrCharIndex(prevCharIndex)
        } else {
            // get index of end of prev line
            const lastCharOnPrevLineIndex = linesOfText[$currLineIndex - 1].length - 1
            setCurrCharIndex(lastCharOnPrevLineIndex)
        }

        let outputLineIndex = $currLineIndex
        if (atStartOfLine && !onFirstLine) {
            outputLineIndex = $currLineIndex - 1
            setCurrLineIndex(outputLineIndex)
        }

        return [outputLineIndex, prevCharIndex]
    }

    /** Returns the next `TAB_WIDTH` chars from `linesOfText` */
    function nextTabWidthChars() {
        const lineIsShorterThanTabWidth =
            linesOfText[$currLineIndex].length < TAB_WIDTH
        if (lineIsShorterThanTabWidth) return null

        return linesOfText[$currLineIndex]
            .substring($currCharIndex, $currCharIndex + TAB_WIDTH)
    }

    function prevTabWidthChars() {
        // if less than 4 ahead of start of line
        if ($currCharIndex < 3) return null

        return linesOfText[$currLineIndex]
            .substring($currCharIndex - 4, $currCharIndex)
    }

    function activeCharNumber() {
        const activeChar = document.querySelectorAll('.char.active')[0]
        const activeCharNumber = activeChar.dataset.charNumber
        return +activeCharNumber
    }
}

function charId(lineIndex, charIndex) {
    return `char-${lineIndex}-${charIndex}`
}

function lineId(lineIndex) {
    return `line-${lineIndex}`
}

/** TODO: move to backend? 
 * @returns {Array<string>} 
 * @param {string} textSource
*/
function prepared(textSource) {
    if (!textSource.endsWith('\n')) textSource += '\n'
    textSource = textSource.replace(/\t/g, TAB)
    const asLines = textSource.split(/(?<=\n)/)  // keep the \n at end of line
    return [textSource, asLines]
}
