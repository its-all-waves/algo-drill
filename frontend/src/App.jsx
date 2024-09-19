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

    // const { textSource, linesOfText, charLinesArray } = dataStructuresFromTextSource(
    //     `for:
    // hello`
    // )
    const { textSource, linesOfText, charLinesArray } = dataStructuresFromTextSource(
        `for:
    thingy = 42
    print(thingy)`
    )
    const lineCount = charLinesArray.length

    // STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const [$activeCharId, setActiveCharId] = useState(0)
    
    const [$correctChars, setCorrectChars] = useState([])
    const [$missedChars, setMissedChars] = useState([])
    
    const [$testComplete, setTestComplete] = useState(false)
    
    // DERIVED STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

    let $activeChar = charWith($activeCharId)
    useEffect(() => {
        if (!$activeChar) setTestComplete(true)
    }, [$activeCharId])

    // END STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    useEffect(() => {
        if ($testComplete) console.log('* * * TEST COMPLETE * * *')
    }, [$testComplete])

    // useEffect(() => {
    //     console.log('$activeCharId: ', $activeCharId)
    // }, [$activeCharId])

    // useEffect(() => {
    //     console.log('correct keys: ', $correctKeys)
    // }, [$correctKeys])

    useEffect(() => {
        console.log('missed keys: ', $missedChars)
    }, [$missedChars])

    // END DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return <>
        <div style={{ margin: '1rem' }}>
            <TextBox onKeyDown={onKeyDown}>
                {charLinesArray.map((line, lineIndex) => {
                    const lineComponent = (
                        <Line key={lineIndex} lineId={lineIndex}>
                            {line.map((char) => {
                                const { character, id } = char
                                const charComponent = (
                                    <Char
                                        key={id}
                                        charId={id}
                                        status={charArrayIncludes($missedChars, id)
                                            ? 'wrong'
                                            : charArrayIncludes($correctChars, id)
                                                ? 'correct'
                                                : null}
                                        active={id === $activeCharId}
                                        controlChar={character === '\n'}
                                    >
                                        {character === ' '
                                            ? NON_BREAKING_SPACE_UNICODE
                                            : character === '\n'
                                                ? '⏎'
                                                : character}
                                    </Char>
                                )
                                return charComponent
                            })}
                        </Line>
                    )
                    return lineComponent
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
            const prevCharacters = 
                prevTabWidthChars()?.map(char => char.character).join('')
            decrementCharIndex(prevCharacters === TAB ? TAB_WIDTH : 1)
            return
        }

        // DEBUG
        // console.log(':::::: char: ', $activeChar.character)

        const keyIsSourceCodeChar = SRC_CODE_CHARS.includes(key)
        if (keyIsSourceCodeChar) {
            const keyIsCorrect = $activeChar.character === key
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectChars([...$correctChars, $activeChar])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, $activeChar])
            }
            if (!incrementActiveCharId(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === SPACE_CHAR_ASCII) {
            const keyIsCorrect = $activeChar.character === SPACE_CHAR_ASCII
                || $activeChar.character === NON_BREAKING_SPACE_HTML  // may change which space char = space in `textSource`, hence the OR
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectChars([...$correctChars, $activeChar])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, $activeChar])
            }
            if (!incrementActiveCharId(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Enter') {
            const keyIsCorrect = $activeChar.character === '\n'
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectChars([...$correctChars, $activeChar])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, $activeChar])
            }
            if (!incrementActiveCharId(1)) {
                setTestComplete(true)
                return
            }
        } else if (key === 'Tab') {
            const nextChars = nextTabWidthChars()
            const nextCharacters = nextChars.map(char => char.character).join('')
            const keyIsCorrect = nextCharacters === TAB
            if (keyIsCorrect) {
                console.log('🟩')
                setCorrectChars([...$correctChars, ...nextChars])
            } else {
                console.log('🟥')
                setMissedChars([...$missedChars, ...nextChars])
            }
            if (!incrementActiveCharId(TAB_WIDTH)) {
                setTestComplete(true)
                return
            }
        }
    }

    function incrementActiveCharId(amount) {
        const nextIdOutOfRange = $activeCharId + amount > textSource.length
        if (nextIdOutOfRange) return false
        setActiveCharId($activeCharId + amount)
        return true
    }

    function decrementCharIndex(amount) {
        const prevIdOutOfRange = $activeCharId - amount < 0
        if (prevIdOutOfRange) return false
        setActiveCharId($activeCharId - amount)
        return true
    }

    function nextTabWidthChars() {
        const { charIndex, lineIndex } = $activeChar
        const lineIsShorterThanTabWidth =
            charLinesArray[lineIndex].length < TAB_WIDTH
        if (lineIsShorterThanTabWidth) return null
        return charLinesArray[lineIndex].slice(charIndex, charIndex + TAB_WIDTH)
    }

    function prevTabWidthChars() {
        const { charIndex, lineIndex } = $activeChar
        if (charIndex < 3) return null
        return charLinesArray[lineIndex].slice(charIndex - 4, charIndex)
    }

    function charWith(id) {
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const char = charLinesArray[lineIndex].find(char => char.id === id)
            if (char) return char
        }
        return null
    }

    function charArrayIncludes(charArray, charId) {
        for (let i = 0; i < charArray.length; i++) {
            const missedChar = charArray[i]
            if (missedChar.id === charId) return missedChar
        }
        return null
    }
}

/** TODO: move text treatment to backend? 
 * @param {string} textSource
*/
function dataStructuresFromTextSource(textSource) {
    // treat text source
    if (!textSource.endsWith('\n')) textSource += '\n'
    textSource = textSource.replace(/\t/g, TAB)

    // map text to a 2d array of chars -> [line[char]]
    const linesOfText = textSource.split(/(?<=\n)/)  // keep the \n at end of line
    let charId = 0
    const charLinesArray = linesOfText.map((line, lineIndex) => {
        return [...line].map((character, charIndex) => {
            return newChar(character, charId++, lineIndex, charIndex)
        })
    })

    return { textSource, charLinesArray }
}

function newChar(character, id, lineIndex, charIndex) {
    return { character, id, lineIndex, charIndex }
}


/* 
THOUGHTS

LEAVING OFF HERE:
    need to find a way to deal with user correcting missed keys
    idea: keep another state array of fixedChars
        - to set status of char
            - if in fixedChars, status = fixed (apply correct class)
            - else
                - if in missedChars, status = missed
                - else if in correctChars, status = correct
                - else, status = null
        - to calculate score
            - correctChars.length / textSource.length


TODO FIXES:
    - when backspace from beginning of a line, 
    skip the prev line's last char (\n)
            
*/