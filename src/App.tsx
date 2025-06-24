import {Line, OrbitControls, Preload, useGLTF, Text, Tube} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {useMemo, useRef, useState, type FC} from 'react'
import * as THREE from 'three'
import {limitTrajectoryByMaxAngle} from './helpers'

// 1 point = 10m в представлении

const layers = [
  {depth: 20, color: '#d2b48c', name: 'Песок'},
  {depth: 25, color: '#deb887', name: 'Глина'},
  {depth: 5, color: '#a0522d', name: 'Сланец'},
  {depth: 5, color: '#8b4513', name: 'Гранит'},
  {depth: 10, color: '#3e2723', name: 'Нефтеносный слой'},
]
const earthDepth = layers.reduce((acc, l) => acc + l.depth, 0)
const oilDepth = -50

const rawPoints = [
  new THREE.Vector3(0, 10.7, 0), // старт
  new THREE.Vector3(0, 0, 0), // у поверхности
  new THREE.Vector3(-3, -15, -2), // уходит вбок
  new THREE.Vector3(-6, -30, -6), // глубже и дальше в сторону
  new THREE.Vector3(8, oilDepth, -5), // цель — сбоку от нефти
]

const casingSteps = [
  {depth: 5, radius: 0.5},
  {depth: 10, radius: 0.4},
  {depth: 15, radius: 0.3},
  {depth: 20, radius: 0.2},
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
    <mesh position={[0, -earthDepth, 0]} receiveShadow>
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

const EarthLayers = ({
  transparent = false,
  clip = [],
}: {
  transparent?: boolean
  clip?: THREE.Plane[]
}) => {
  let currentY = 10

  return (
    <group position={[0, 0, 0]}>
      {layers.map((layer, index) => {
        const height = layer.depth
        const y = currentY - height / 2
        currentY -= height

        return (
          <mesh key={index} position={[0, y, 0]}>
            <boxGeometry args={[30, height, 30]} />
            <meshStandardMaterial
              color={layer.color}
              opacity={transparent ? 0.6 : 1}
              transparent={transparent}
              depthWrite={!transparent}
              side={THREE.DoubleSide}
              clippingPlanes={clip}
              clipShadows={true}
            />
          </mesh>
        )
      })}
    </group>
  )
}

const DepthRuler = () => {
  const marks = []
  for (let i = 0; i <= earthDepth; i += 5) {
    marks.push(
      <group key={i} position={[-15, 10 - i, 15]}>
        <mesh>
          <boxGeometry args={[0.3, 0.02, 0.5]} />
          <meshBasicMaterial color='black' />
        </mesh>
        <mesh position={[-2, 0.1, 0.1]}>
          <Text fontSize={0.5} color='black' anchorX='left' anchorY='middle'>
            {`${i}0м`}
          </Text>
          <meshBasicMaterial color='black' />
        </mesh>
      </group>
    )
  }

  return <group>{marks}</group>
}

const CasingStepTube = ({
  transparent,
  drillPoints,
  maxDepth,
  radius,
}: {
  transparent: boolean
  drillPoints: THREE.Vector3[]
  maxDepth: number
  radius: number
}) => {
  const path = useMemo(() => {
    let total = 0
    const points: THREE.Vector3[] = [drillPoints[0]]

    for (let i = 1; i < drillPoints.length; i++) {
      const segmentLength = drillPoints[i - 1].distanceTo(drillPoints[i])
      if (total + segmentLength >= maxDepth) {
        const remaining = maxDepth - total
        const direction = new THREE.Vector3()
          .subVectors(drillPoints[i], drillPoints[i - 1])
          .normalize()
        const finalPoint = drillPoints[i - 1].clone().add(direction.multiplyScalar(remaining))
        points.push(finalPoint)
        break
      } else {
        points.push(drillPoints[i])
        total += segmentLength
      }
    }

    return new THREE.CatmullRomCurve3(points)
  }, [drillPoints, maxDepth])

  return (
    <Tube args={[path, 64, radius, 8, false]}>
      <meshStandardMaterial
        color='#888'
        transparent={transparent}
        opacity={transparent ? 0.4 : 1}
        depthWrite={!transparent}
        side={THREE.DoubleSide}
      />
    </Tube>
  )
}

const DrillPath = () => {
  return <Line points={curve.getPoints(100)} color='white' lineWidth={1} />
}

const DrillBody: FC<{trail: THREE.Vector3[]}> = ({trail}) => {
  if (trail.length < 2) return null

  const curve = new THREE.CatmullRomCurve3(trail)
  const geometry = new THREE.TubeGeometry(curve, 100, 0.08, 16, false)

  return (
    <mesh geometry={geometry}>
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

        groupRef.current.rotation.z += delta * 0.5
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
  const clippingPlanes = useMemo(() => {
    return [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)] // срез по Z
  }, [])

  const [trail, setTrail] = useState<THREE.Vector3[]>([])
  const [layersTransparent, setLayersTransparent] = useState(false)
  const [casingTransparent, setCasingTransparent] = useState(false)
  const [clippingEnabled, setClippingEnabled] = useState(false)

  return (
    <>
      <div
        style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 30px',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{margin: 0}}>3D Модель бурения</h1>
        <button
          onClick={() => setClippingEnabled(!clippingEnabled)}
          style={{
            padding: '8px 16px',
            background: clippingEnabled ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {clippingEnabled ? 'Выключить разрез' : 'Показать разрез'}
        </button>
        <button
          onClick={() => setLayersTransparent(!layersTransparent)}
          style={{
            padding: '8px 16px',
            background: layersTransparent ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {layersTransparent ? 'Сделать непрозрачными' : 'Сделать прозрачными'}
        </button>
        <button
          onClick={() => setCasingTransparent(!casingTransparent)}
          style={{
            padding: '8px 16px',
            background: casingTransparent ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {casingTransparent ? 'Сделать непрозрачными колонну' : 'Сделать прозрачными колонну'}
        </button>
      </div>
      <Canvas
        style={{height: 'calc(100vh - 68px)'}}
        camera={{position: [30, 20, 30], fov: 45}}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <DrillingRig />
        <GroundSurface />
        <EarthCutSection />
        <EarthLayers transparent={layersTransparent} clip={clippingEnabled ? clippingPlanes : []} />
        <DepthRuler />
        {casingSteps.map((step, i) => (
          <CasingStepTube
            transparent={casingTransparent}
            key={i}
            drillPoints={drillPoints}
            maxDepth={step.depth}
            radius={step.radius}
          />
        ))}
        <DrillPath />
        <DrillHead onTrailUpdate={setTrail} />
        <DrillBody trail={trail} />
        <OilDeposit position={[8, oilDepth, -5]} />
        <OrbitControls />
        <Preload all />
      </Canvas>
    </>
  )
}
