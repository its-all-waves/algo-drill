import { useState } from 'react'

import GlassPane from '../../components/shared/GlassPane'
import TextBox from '../../components/TextBox/TextBox'

export default function TypingTestView({ }) {
    const [$hasFocus, setHasFocus] = useState(false)
    function handleFocus() { setHasFocus(true) }
    function handleBlur() { setHasFocus(false) }

    return (
        <div id="typing-test-view" className=' full-height'>
            <GlassPane inFocus={$hasFocus}>
                <TextBox onFocus={handleFocus} onBlur={handleBlur}/>
            </GlassPane>
        </div>
    )
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
    - [X] find a way to add keyPressed to missed keys
    - [ ] 💀 daaaaamnn -- must remember last line's tab depth and recall it on next line
    - [ ] 💀 deal with scrolling the text if it doesn't fit in the window


TODO FIXES:
    - when backspace from beginning of a line, 
    skip the prev line's last char (\n)
            
*/