import {Text} from '@react-three/drei'
import React from 'react'
import {EARTH_WIDTH, SCALE_FACTOR, GEO_LAYERS} from '../config'

type Props = {
  depth: number
  index: number
  geo: {
    name: string
    color: string
    height: number
  }
}

export const DepthRuler: React.FC<Props> = ({index, geo}) => {
  // Суммируем глубины всех предыдущих слоёв
  const depthMeters =
    index === 0 ? 0 : GEO_LAYERS.slice(0, index).reduce((sum, layer) => sum + layer.height, 0)

  const z = -depthMeters / SCALE_FACTOR

  return (
    <group position={[EARTH_WIDTH / 2 + 0.5, 0, z]}>
      <mesh>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <meshStandardMaterial color='white' />
      </mesh>
      <Text position={[0.3, 0, 0]} fontSize={0.5} color='green' anchorX='left' anchorY='middle'>
        {depthMeters} м — {geo.name}
      </Text>
    </group>
  )
}
