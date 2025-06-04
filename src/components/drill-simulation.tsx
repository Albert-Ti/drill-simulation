import {useFrame, useThree} from '@react-three/fiber'
import {useRef, useState} from 'react'
import * as THREE from 'three'
import {DRILL_SPEED_M_PER_HOUR, GEO_LAYERS, SCALE_FACTOR} from '../config'
import {mockTrajectory, type Vec3} from '../data'
import {DepthRuler} from './depth-ruler'
import {DrillHead} from './drill-head'
import {EarthCutSection} from './earth-cut-section'
import {OilTarget} from './oil-target'
import {TrajectoryLine} from './trajectory-line'

interface DrillSimulationProps {
  onDepthUpdate: (depth: number) => void
}

export const DrillSimulation: React.FC<DrillSimulationProps> = ({onDepthUpdate}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drillPos, setDrillPos] = useState<Vec3>(mockTrajectory[0])
  const {camera} = useThree()
  const lastPos = useRef(new THREE.Vector3(...mockTrajectory[0]))
  // Переводим скорость из м/ч → м/с → в координаты
  const speedMetersPerSecond = DRILL_SPEED_M_PER_HOUR / 3600
  const speedPerFrame = speedMetersPerSecond / SCALE_FACTOR / 60 // 60 FPS

  useFrame(() => {
    const nextIndex = Math.min(currentIndex + 1, mockTrajectory.length - 1)
    const target = new THREE.Vector3(...mockTrajectory[nextIndex])
    const current = lastPos.current.clone()
    const distance = current.distanceTo(target)

    if (distance < speedPerFrame) {
      lastPos.current = target
      setCurrentIndex(nextIndex)
      setDrillPos([target.x, target.y, target.z])
    } else {
      const dir = target.clone().sub(current).normalize()
      lastPos.current.addScaledVector(dir, speedPerFrame)
      setDrillPos([lastPos.current.x, lastPos.current.y, lastPos.current.z])
    }

    camera.position.lerp(new THREE.Vector3(10, 10, lastPos.current.z + 15), 0.002)
    camera.lookAt(lastPos.current)

    onDepthUpdate(Math.abs(lastPos.current.z * SCALE_FACTOR)) // глубина в метрах
  })

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <EarthCutSection targetPosition={lastPos.current.toArray() as [number, number, number]} />
      <OilTarget />
      {GEO_LAYERS.map((geo, i) => (
        <DepthRuler key={i} depth={geo.height} index={i} geo={geo} />
      ))}
      <TrajectoryLine
        points={mockTrajectory.slice(0, currentIndex + 1)}
        fullTrajectory={mockTrajectory}
      />
      <DrillHead position={drillPos} />
    </>
  )
}
