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
    const [$fixedChars, setFixedChars] = useState([])  // keep track of chars that were missed, but have been corrected -- allows recording all missed keys, even if corrected, but also color a corrected key differently than a missed one 

    const [$testComplete, setTestComplete] = useState(false)

    // DERIVED STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++

    let $activeChar = charWith($activeCharId) // TODO: try as const
    useEffect(() => {
        !$activeChar && setTestComplete(true)
    }, [$activeCharId])

    // END STATE VARS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    useEffect(() => {
        console.clear()
        /* $correctChars.length && */ console.log('correct chars: ', $correctChars)
        /* $missedChars.length && */ console.log('missed chars: ', $missedChars)
        /* $fixedChars.length && */ console.log('fixed chars: ', $fixedChars)
    }, [$correctChars, $missedChars, $fixedChars])

    // useEffect(() => {
    //     $missedChars.length && console.log('missed chars: ', $missedChars)
    // }, [$missedChars])

    // useEffect(() => {
    //     $fixedChars.length && console.log('fixed chars: ', $fixedChars)
    // }, [$fixedChars]);

    useEffect(() => {
        // $correctChars.length && console.log('🟩') // will not work now that we can remove from the status arrays
    }, [$correctChars])

    useEffect(() => {
        // $missedChars.length && console.log('🟥')
    }, [$missedChars])

    useEffect(() => {
        $testComplete && console.log('* * * TEST COMPLETE * * *')
    }, [$testComplete])

    // useEffect(() => {
    //     console.log('$activeCharId: ', $activeCharId)
    // }, [$activeCharId])

    // useEffect(() => {
    //     console.log('correct keys: ', $correctKeys)
    // }, [$correctKeys])

    // END DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // MARKUP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
                                            ? 'missed'
                                            : charArrayIncludes($correctChars, id)
                                                ? 'correct'
                                                : charArrayIncludes($fixedChars, id)
                                                    ? 'fixed'
                                                    : 'unreached'}
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

    // END MARKUP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // METHODS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    function onKeyDown(event) {
        event.preventDefault()

        if ($testComplete) return
        
        const { key } = event

        if (key === 'Backspace') {
            const prevCharacters =
                prevTabWidthChars()?.map(char => char.character).join('')
            decrementActiveCharId(prevCharacters === TAB ? TAB_WIDTH : 1)
            return
        }

        // DEBUG
        // console.log(':::::: char: ', $activeChar.character)

        // HANDLE CHAR INPUT +++++++++++++++++++++++++++++++++++++++++++++++++++

        const keyIsSourceCodeChar = SRC_CODE_CHARS.includes(key)
        if (keyIsSourceCodeChar) {
            const keyIsCorrect = $activeChar.character === key
            setSingleCharStatus(keyIsCorrect)

        } else if (key === SPACE_CHAR_ASCII) {
            const keyIsCorrect = $activeChar.character === SPACE_CHAR_ASCII
                || $activeChar.character === NON_BREAKING_SPACE_HTML  // may change which space char = space in `textSource`, hence the OR
            setSingleCharStatus(keyIsCorrect)

        } else if (key === 'Enter') {
            const keyIsCorrect = $activeChar.character === '\n'
            setSingleCharStatus(keyIsCorrect)

        } else if (key === 'Tab') {
            const nextChars = nextTabWidthChars()
            const nextCharacters = nextChars.map(char => char.character).join('')
            const keyIsCorrect = nextCharacters === TAB
            setTabWidthCharsStatus(keyIsCorrect, nextChars)
        } else {
            return  // don't respond to keys not denoted above
        }
        
        incrementActiveCharId(key === 'Tab' ? TAB_WIDTH : 1)
    }

    function incrementActiveCharId(amount) {
        const nextIdOutOfRange = $activeCharId + amount > textSource.length
        if (nextIdOutOfRange) return false
        setActiveCharId($activeCharId + amount)
        return true
    }

    function decrementActiveCharId(amount) {
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
        return charLinesArray[lineIndex]
            .slice(charIndex, charIndex + TAB_WIDTH)
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

    function charArrayIncludes(charArray, charIdOrSequentialIds) {
        debugger

        if (charIdOrSequentialIds instanceof Array) {
            // passed an array of ids
            const charIds = charIdOrSequentialIds
            const charsWithGivenIds = 
                charArray.filter(c => charIds.includes(c.id))
            const allIdsAreInArray = charsWithGivenIds.length === charIds.length
            if (allIdsAreInArray) return true
            return false
            // for (const char of charsWithGivenIds) {
            //     if (!charArrayIncludes(charsWithGivenIds, char)) return false
            // }
            // return true
        }

        // passed an integer id
        const charId = charIdOrSequentialIds
        for (let i = 0; i < charArray.length; i++) {
            const missedChar = charArray[i]
            if (missedChar.id === charId) return true
        }
        return false
    }

    function setSingleCharStatus(keyIsCorrect) {
        if (keyIsCorrect) {
            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, $activeCharId)
            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, $activeCharId)
            if (charPreviouslyCorrect || charPreviouslyFixed) {
                return  // do nothing
            }

            const charPreviouslyMissed =
                charArrayIncludes($missedChars, $activeCharId)
            if (charPreviouslyMissed) {
                // move to fixed chars
                setMissedChars(
                    $missedChars.filter(c => c.id !== $activeCharId)
                )
                setFixedChars([...$fixedChars, $activeChar])
                return
            }

            // first time hitting char
            setCorrectChars([...$correctChars, $activeChar])
            return
        }

        if (!keyIsCorrect) {
            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, $activeCharId)
            if (charPreviouslyCorrect) {
                // move to missed chars
                setCorrectChars(
                    $correctChars.filter(c => c.id !== $activeCharId)
                )
                setMissedChars([...$missedChars, $activeChar])
                return
            }

            const charPreviouslyMissed =
                charArrayIncludes($missedChars, $activeCharId)
            if (charPreviouslyMissed) {
                return  // do nothing
            }

            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, $activeCharId)
            if (charPreviouslyFixed) {
                // move to missed chars
                setFixedChars(
                    $fixedChars.filter(c => c.id !== $activeCharId)
                )
                setMissedChars([...$missedChars, $activeChar])
                return
            }

            // first time hitting char
            setMissedChars([...$missedChars, $activeChar])
            return
        }
    }

    function setTabWidthCharsStatus(keyIsCorrect, nextTabWidthChars) {
        const nextCharsIds = nextTabWidthChars.map(c => c.id)

        if (keyIsCorrect) {
            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, nextCharsIds)
            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, nextCharsIds)
            if (charPreviouslyCorrect || charPreviouslyFixed) {
                return  // do nothing
            }

            const charPreviouslyMissed =
                charArrayIncludes($missedChars, nextCharsIds)
            if (charPreviouslyMissed) {
                // move to fixed chars
                setMissedChars(
                    $missedChars.filter(c => !nextCharsIds.includes(c.id))
                )
                setFixedChars([...$fixedChars, ...nextTabWidthChars])
                return
            }

            // first time hitting char
            setCorrectChars([...$correctChars, ...nextTabWidthChars])
            return
        }

        if (!keyIsCorrect) {
            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, nextCharsIds)
            if (charPreviouslyCorrect) {
                // move to missed chars
                setCorrectChars(
                    $correctChars.filter(c => !nextCharsIds.includes(c.id))
                )
                setMissedChars([...$missedChars, ...nextTabWidthChars])
                return
            }

            const charPreviouslyMissed =
                charArrayIncludes($missedChars, nextCharsIds)
            if (charPreviouslyMissed) {
                return  // do nothing
            }

            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, nextCharsIds)
            if (charPreviouslyFixed) {
                // move to missed chars
                setFixedChars(
                    $fixedChars.filter(c => !nextCharsIds.includes(c.id))
                )
                setMissedChars([...$missedChars, ...nextTabWidthChars])
                return
            }

            // first time hitting char
            setMissedChars([...$missedChars, ...nextTabWidthChars])
            return
        }     
    }

    // END METHODS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
}

/** TODO: move text treatment to backend? \
 * Returns the an object containing the text source after treatment, 
 * along with a 2d array of lines>chars with char id's mapping to 
 * text source indices
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


HOW TO HANDLE FIXED CHARS
    - if typed CORRECT key
        - if char was already correct -> do nothing
        - if char was already wrong -> move to fixed
        - if char was already fixed -> do nothing
        - if char is not in any status array yet -> add to correct
    - if typed WRONG key
        - if char was already correct -> move to missed
        - if char was already wrong -> do nothing
        - if char was already fixed -> move to missed
        - if char is not in any status array yet -> add to wrong


    - ONCE WE KNOW THIS WORKS, CONVERT THE CHAR STATUS ARRAYS INTO ARRAYS OF IDS ONLY

TODO:
    - [ ] find a way to add keyPressed to missed keys
    - [ ] 


TODO FIXES:
    - when backspace from beginning of a line, 
    skip the prev line's last char (\n)
            
*/