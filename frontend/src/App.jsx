import { useEffect, useRef, useState } from 'react'
import './App.css'

const BACKEND = 'http://localhost:8000'

export default function App() {
    const [algoText, setAlgoText] = useState(
`for thingy in thingies:
    thingy = 42
    print(thingy)`
    )

    const [typedText, setTypedText] = useState('')

    return (
        <>
            <div id="wrapper">
                <TypingInputBackground
                    content={algoText} 
                    setContent={setAlgoText}/>
                <TypingInput 
                    value={typedText} 
                    setValue={setTypedText}/>
            </div>
        </>
    )
}

function TypingInput({ value, setValue }) {
    // const self = useRef(null)

    useEffect(() => { 
        
    }, [])

    function handleKeyDown(e) {
        if (e.key != 'Tab') return
        e.preventDefault()
        const t = e.target
        const start = t.selectionStart
        const end = t.selectionEnd

        const TAB = '    ' // tab appears as 8 spaces for some reason
        
        t.value = t.value.substring(0, start) + TAB + t.value.substring(end)
        
        t.selectionStart = t.selectionEnd = start + TAB.length
    }
    
    return <textarea
        id="typing-input"
        name="typing-input"
        cols="40"
        rows="20"
        value={value}
        onChange={(e) => setValue(e.target.value)} 
        onKeyDown={handleKeyDown} />
}

function TypingInputBackground({ content, setContent }) {
    return <div id="typing-input-background">
        <pre>
            {content}
        </pre>
    </div>
}