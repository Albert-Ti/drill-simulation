import {Scene} from './scene'
import {DepthDisplay} from './components/depth-display'
import {useState} from 'react'

function App() {
  const [depth, setDepth] = useState(0)

  return (
    <div style={{height: '100vh'}}>
      <DepthDisplay depth={depth} />
      <Scene onDepthUpdate={setDepth} />
    </div>
  )
}

export default App
