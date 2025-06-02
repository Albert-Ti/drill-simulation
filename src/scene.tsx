import {OrbitControls} from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import {AlternativePath} from './components/alternative-path'
import {DrillSimulation} from './components/drill-simulation'
import {alternativeTrajectory} from './data'

interface SceneProps {
  onDepthUpdate: (depth: number) => void
}

export const Scene: React.FC<SceneProps> = ({onDepthUpdate}) => {
  return (
    <Canvas camera={{position: [10, 10, 10], fov: 50}}>
      <OrbitControls />
      <DrillSimulation onDepthUpdate={onDepthUpdate} />
      <AlternativePath path={alternativeTrajectory} />
    </Canvas>
  )
}
