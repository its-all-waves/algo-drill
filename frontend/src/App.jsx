import { useEffect, useState } from 'react'
import './App.css'

const BACKEND = 'http://localhost:8000'

export default function App() {
    return (
        <>
            <div id="wrapper">
                <TextBoxBackground />
                <TextBox />
            </div>
        </>
    )
}

function TextBox() {
    const [typedText, setTypedText] = useState('algo')

    return <textarea
        name="typing-input" 
        id="typing-input" 
        cols="40" 
        rows="20" 
        value={typedText}
        onChange={(e) => setTypedText(e.target.value)}/>
}

function TextBoxBackground() {
    return <div id="text-box-background">
        <pre>
            algorithm
        </pre>
    </div>
}