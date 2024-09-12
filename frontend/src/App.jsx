import { useEffect, useState } from 'react'
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
    return <textarea
        id="typing-input"
        name="typing-input"
        cols="40"
        rows="20"
        value={value}
        onChange={(e) => setValue(e.target.value)} />
}

function TypingInputBackground({ content, setContent }) {
    return <div id="typing-input-background">
        <pre>
            {content}
        </pre>
    </div>
}