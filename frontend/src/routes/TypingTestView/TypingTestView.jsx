import { useState } from 'react'

import GlassPane from '../../components/shared/GlassPane'
import TextBox from './TextBox'
import { useLoaderData } from 'react-router-dom'

export function loader({ request }) {
    const url = new URL(request.url)
    const language = url.searchParams.get('language')
    // const algorithm = url.searchParams.get('algo')

    // FAKE FETCH FROM THE SERVER
    const algorithm = `def merge(arr, left, mid, right):
    n1 = mid - left + 1
    n2 = right - mid

    # Create temp arrays
    L = [0] * n1
    R = [0] * n2

    # Copy data to temp arrays L[] and R[]
    for i in range(n1):
        L[i] = arr[left + i]
    for j in range(n2):
        R[j] = arr[mid + 1 + j]

    i = 0  # Initial index of first subarray
    j = 0  # Initial index of second subarray
    k = left  # Initial index of merged subarray

    # Merge the temp arrays back
    # into arr[left..right]
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1

    # Copy the remaining elements of L[],
    # if there are any
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1

    # Copy the remaining elements of R[], 
    # if there are any
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1` 

    return { algorithm }
}


export default function TypingTestView({ }) {
    const { algorithm } = useLoaderData()

    const [$hasFocus, setHasFocus] = useState(false)

    return (
        <div id="typing-test-view" className='full-height'>
            <GlassPane inFocus={$hasFocus}>
                <TextBox
                    algorithm={algorithm}
                    onFocus={() => setHasFocus(true)}
                    onBlur={() => setHasFocus(false)}
                />
            </GlassPane>
        </div>
    )
}


/* 
THOUGHTS

DATA FLOW FROM SERVER TO TYPING TEST PAGE
- user selects options, then submits form
- form makes a get request for the given algo in the given lang
- form redirects to typing test view, passing along the data
    - how to pass the data?
        - can i redirect and include json?

TODO:
    - [X] find a way to add keyPressed to missed keys
    - [ ] 💀 daaaaamnn -- must remember last line's tab depth and recall it on next line
    - [ ] 💀 deal with scrolling the text if it doesn't fit in the window


TODO FIXES:
    - [ ] when backspace from beginning of a line, 
    skip the prev line's last char (\n)
            
*/