import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CS 5500!</h1>
        <p>This is my first React Vite TypeScript project.</p>
        
        <div style={{ margin: '20px 0' }}>
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
          <button 
            onClick={() => setCount(0)} 
            style={{ marginLeft: '10px' }}
          >
            Reset Count
          </button>
        </div>

        <div style={{ margin: '20px 0' }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          />
          {name && <p>Hello, {name}!</p>}
        </div>
      </header>
    </div>
  )
}

export default App