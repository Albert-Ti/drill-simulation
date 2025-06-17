import {Line, OrbitControls, Preload, useGLTF} from '@react-three/drei'
import {Canvas, useFrame, type Vector3} from '@react-three/fiber'
import {useRef, useState, type FC} from 'react'
import * as THREE from 'three'
import {limitTrajectoryByMaxAngle} from './helpers'

const rawPoints = [
  new THREE.Vector3(0, 10.7, 0), // старт
  new THREE.Vector3(0, 0, 0), // у поверхности
  new THREE.Vector3(-5, -15, 0), // уходит вбок
  new THREE.Vector3(-10, -30, -10), // глубже и дальше в сторону
  new THREE.Vector3(5, -45, -5), // цель — сбоку от нефти
]

const drillPoints = limitTrajectoryByMaxAngle(rawPoints, 15)
const curve = new THREE.CatmullRomCurve3(drillPoints)

const DrillingRig: FC = () => {
  return (
    <group position={[0, 10.1, 0]}>
      {/* 4 вертикальные опоры */}
      <mesh position={[-0.5, 1.5, -0.5]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color='gray' />
      </mesh>
      <mesh position={[0.5, 1.5, -0.5]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color='gray' />
      </mesh>
      <mesh position={[-0.5, 1.5, 0.5]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color='gray' />
      </mesh>
      <mesh position={[0.5, 1.5, 0.5]}>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color='gray' />
      </mesh>

      {/* Верхняя рамка */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color='darkgray' />
      </mesh>

      {/* Платформа */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color='dimgray' />
      </mesh>
    </group>
  )
}

const EarthCutSection = () => {
  return (
    <mesh position={[0, -20, 0]} receiveShadow>
      <boxGeometry args={[30, 60, 30]} />
      <meshStandardMaterial color={'#FBCEB1'} side={THREE.BackSide} />
    </mesh>
  )
}

const GroundSurface = () => {
  return (
    <mesh position={[0, 10.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={'green'} />
    </mesh>
  )
}

const DrillPath = () => {
  return <Line points={curve.getPoints(50)} color='white' lineWidth={1} />
}

const SolidDrillBody: FC<{trail: THREE.Vector3[]}> = ({trail}) => {
  if (trail.length < 2) return null

  const segments = []

  for (let i = 1; i < trail.length; i++) {
    const start = trail[i - 1]
    const end = trail[i]
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const axis = new THREE.Vector3(0, 1, 0)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction.clone().normalize()
    )

    segments.push(
      <mesh key={i} position={midPoint} quaternion={quaternion}>
        <cylinderGeometry args={[0.08, 0.08, length, 16]} />
        <meshPhysicalMaterial
          color={'#ffffff'}
          metalness={1}
          roughness={0.05} // почти гладкий, больше блеска
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive={'#464451'}
          emissiveIntensity={0.3}
        />
      </mesh>
    )
  }

  return <>{segments}</>
}

const DrillHead = ({onTrailUpdate}: {onTrailUpdate?: (trail: THREE.Vector3[]) => void}) => {
  const groupRef = useRef<THREE.Group>(null)
  const [t, setT] = useState(0)
  const [trail, setTrail] = useState<THREE.Vector3[]>([])

  const {scene} = useGLTF('/Bur.glb')

  useFrame((_, delta) => {
    const speed = 0.005
    setT(prev => {
      const next = Math.min(prev + delta * speed, 1)
      const point = curve.getPoint(next)
      const tangent = curve.getTangentAt(next)

      if (groupRef.current) {
        groupRef.current.position.copy(point)
        groupRef.current.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tangent.normalize()
        )
      }

      // Обновляем trail (добавляем точку, если далеко от последней)
      setTrail(prevTrail => {
        if (prevTrail.length === 0 || prevTrail[prevTrail.length - 1].distanceTo(point) > 0.003) {
          const newTrail = [...prevTrail, point.clone()]
          if (onTrailUpdate) onTrailUpdate(newTrail)
          return newTrail
        }
        return prevTrail
      })

      return next
    })
  })

  return (
    <group ref={groupRef} scale={0.03}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  )
}

const OilDeposit: FC<{position: [number, number, number]}> = ({position}) => {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color='black' />
    </mesh>
  )
}

export default function App() {
  const [trail, setTrail] = useState<THREE.Vector3[]>([])

  return (
    <Canvas style={{height: '100vh'}} camera={{position: [30, 20, 30], fov: 45}} shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <DrillingRig />
      <EarthCutSection />
      <GroundSurface />
      <DrillPath />
      <DrillHead onTrailUpdate={setTrail} />
      <SolidDrillBody trail={trail} />
      <OilDeposit position={[5, -45, -5]} />
      <OrbitControls />
      <Preload all />
    </Canvas>
  )
}
