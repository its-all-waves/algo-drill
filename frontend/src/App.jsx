import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const BACKEND = 'http://localhost:8000'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <TestComponent /> 
    </>
  )
}


function TestComponent() {
    const [message, setMessage] = useState({})

    useEffect(() => {
        fetch(`${BACKEND}/test`)
            .then(resp => {
                const data = resp.json()
                return data
            })
            .then(data => {
                console.log(data)
                setMessage(data)
            })
    }, [])

    return <div>Message: {message.message}</div>
}