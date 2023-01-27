import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ArcGameViewer from './components/GameViewer'

function App() {
    const [accessKey, setAccessKey] = useState<null | string>(null)

    const handleClick = async () => {
        const response = await fetch("http://localhost:8765/getKey");
        const data = await response.json();
        setAccessKey(data.accessKey);
    }

    return (
        <div className="App">
            <h1>Example Game Host Client</h1>
            <button onClick={handleClick}>Request Access</button>
            <ArcGameViewer accessKey={accessKey}/>
        </div>
    )
}

export default App
