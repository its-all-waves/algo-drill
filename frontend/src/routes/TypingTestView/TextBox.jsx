import { useEffect, useState } from 'react'

import './TextBox.css'
import Line from './Line'
import Char from './Char'


const NON_BREAKING_SPACE_UNICODE = '\u00A0'  // &nbsp; in html
const NON_BREAKING_SPACE_HTML = '&nbsp;'
const SPACE_CHAR_ASCII = ' '
const TAB_WIDTH = 4
const TAB = SPACE_CHAR_ASCII.repeat(TAB_WIDTH)

const SRC_CODE_CHARS = "`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}\\|aAsSdDfFgGhHjJkKlL;:'\"zZxXcCvVbBnNmM,<.>/?"

const LINE_WIDTH_CHARS_COUNT = 40
const root = document.querySelector(':root')
root.style.setProperty('--line-width-chars', LINE_WIDTH_CHARS_COUNT)


export default function TextBox({ algorithm, onFocus, onBlur }) {

    // const { textSource, charLinesArray } = dataStructuresFromTextSource(
    //     `def merge(arr, left, mid, right):
    // n1 = mid - left + 1
    // n2 = right - mid

    // # Create temp arrays
    // L = [0] * n1
    // R = [0] * n2

    // # Copy data to temp arrays L[] and R[]
    // for i in range(n1):
    //     L[i] = arr[left + i]
    // for j in range(n2):
    //     R[j] = arr[mid + 1 + j]

    // i = 0  # Initial index of first subarray
    // j = 0  # Initial index of second subarray
    // k = left  # Initial index of merged subarray

    // # Merge the temp arrays back
    // # into arr[left..right]
    // while i < n1 and j < n2:
    //     if L[i] <= R[j]:
    //         arr[k] = L[i]
    //         i += 1
    //     else:
    //         arr[k] = R[j]
    //         j += 1
    //     k += 1

    // # Copy the remaining elements of L[],
    // # if there are any
    // while i < n1:
    //     arr[k] = L[i]
    //     i += 1
    //     k += 1

    // # Copy the remaining elements of R[], 
    // # if there are any
    // while j < n2:
    //     arr[k] = R[j]
    //     j += 1
    //     k += 1`
    // )
    // const { textSource, linesOfText, charLinesArray } = dataStructuresFromTextSource(
    //     `for:
    // thingy = 42
    // print(thingy)`
    // )

    const { textSource, charLinesArray } = 
        dataStructuresFromTextSource(algorithm)
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
        <div 
            className='text-box'
            tabIndex={0}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        > 
            {charLinesArray.map((line, lineIndex) => {
                return (
                    <Line key={lineIndex} lineId={lineIndex}>
                        {line.map((char) => {
                            const { character, id } = char
                            return (
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
                        })}
                    </Line>
                )
            })}
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
            setSingleCharStatus(keyIsCorrect, key)

        } else if (key === SPACE_CHAR_ASCII) {
            const keyIsCorrect = $activeChar.character === SPACE_CHAR_ASCII
                || $activeChar.character === NON_BREAKING_SPACE_HTML  // may change which space char = space in `textSource`, hence the OR
            setSingleCharStatus(keyIsCorrect, key)

        } else if (key === 'Enter') {
            const keyIsCorrect = $activeChar.character === '\n'
            setSingleCharStatus(keyIsCorrect, key)

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

    function setSingleCharStatus(keyIsCorrect, keyPressed) {
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

            // first time hitting char -> add to correct chars
            setCorrectChars([...$correctChars, $activeChar])
            return
        }

        if (!keyIsCorrect) {
            const charPreviouslyMissed =
                charArrayIncludes($missedChars, $activeCharId)
            if (charPreviouslyMissed) {
                return  // do nothing
            }

            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, $activeCharId)
            if (charPreviouslyCorrect) {
                // remove from correct chars...
                setCorrectChars(
                    $correctChars.filter(c => c.id !== $activeCharId)
                )
            }

            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, $activeCharId)
            if (charPreviouslyFixed) {
                // remove from fixed chars...
                setFixedChars(
                    $fixedChars.filter(c => c.id !== $activeCharId)
                )
            }

            // ...add to missed chars, adding the key pressed into the char
            setMissedChars([...$missedChars, { ...$activeChar, keyPressed }])
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
            const charPreviouslyMissed =
                charArrayIncludes($missedChars, nextCharsIds)
            if (charPreviouslyMissed) {
                return  // do nothing
            }

            const charPreviouslyCorrect =
                charArrayIncludes($correctChars, nextCharsIds)
            if (charPreviouslyCorrect) {
                // remove from correct chars...
                setCorrectChars(
                    $correctChars.filter(c => !nextCharsIds.includes(c.id))
                )
            }

            const charPreviouslyFixed =
                charArrayIncludes($fixedChars, nextCharsIds)
            if (charPreviouslyFixed) {
                // remove from fixed chars...
                setFixedChars(
                    $fixedChars.filter(c => !nextCharsIds.includes(c.id))
                )
            }

            // apply key pressed to each char (is always space char )
            if (TAB === SPACE_CHAR_ASCII.repeat(4)) {
                nextTabWidthChars = nextTabWidthChars.map((char, i) => {
                    return { ...char, keyPressed: `TabAsSpace-${i}` }
                })
            } else {
                throw new Error(`The value of TAB has been changed.`)
            }

            // ...add to missed chars
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



// export default function TextBox({
//     children,
//     onFocus,
//     onBlur,
//     onKeyDown
// }) {

//     return <>
//         <div 
//             className='text-box'
//             tabIndex={0}
//             onFocus={onFocus}
//             onBlur={onBlur}
//             onKeyDown={onKeyDown}
//         >
            
//         </div>
//     </>
// }