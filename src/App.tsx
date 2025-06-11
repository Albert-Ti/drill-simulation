import {Line, OrbitControls, Preload, useGLTF} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {useRef, useState, type FC} from 'react'
import * as THREE from 'three'

const EarthCutSection = () => {
  const texture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/terrain/grasslight-big.jpg'
  )

  return (
    <mesh position={[0, -20, 0]} receiveShadow>
      <boxGeometry args={[20, 60, 20]} />
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

const GroundSurface = () => {
  const texture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/grasslight-big.jpg'
  )

  return (
    <mesh position={[0, 10.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const drillPoints = [
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(2, -15, -2),
  new THREE.Vector3(4, -30, -4),
  new THREE.Vector3(5, -45, -5),
]

const DrillPath = () => {
  const curve = new THREE.CatmullRomCurve3(drillPoints)
  return <Line points={curve.getPoints(50)} color='white' lineWidth={4} />
}

const DrillHead = () => {
  const groupRef = useRef<THREE.Group>(null)
  const curve = new THREE.CatmullRomCurve3(drillPoints)
  const [t, setT] = useState(0)

  // Загружаем модель без анимаций
  const {scene} = useGLTF('/Bur.glb')

  useFrame((_, delta) => {
    const speed = 0.01
    setT(prev => {
      const next = Math.min(prev + delta * speed, 1)
      const point = curve.getPoint(next)
      const tangent = curve.getTangentAt(next)

      if (groupRef.current) {
        // Позиционируем модель
        groupRef.current.position.copy(point)

        // Автоматический поворот по направлению движения
        groupRef.current.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), // Ориентация модели по Y
          tangent.normalize()
        )

        // Дополнительное вращение бура (если нужно)
        groupRef.current.rotation.z += delta * 0.5
      }
      return next
    })
  })

  return (
    <group ref={groupRef} scale={0.05}>
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
  return (
    <Canvas style={{height: '100vh'}} camera={{position: [30, 20, 30], fov: 45}} shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <EarthCutSection />
      <GroundSurface />
      <DrillPath />
      <DrillHead />
      <OilDeposit position={[5, -45, -5]} />
      <OrbitControls />
      <Preload all /> {/* Предзагружает все модели */}
    </Canvas>
  )
}
