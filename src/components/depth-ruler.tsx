import {Text} from '@react-three/drei'
import React from 'react'
import {SCALE_FACTOR} from '../constants'

export const DepthRuler: React.FC = () => {
  const markerCount = 31
  const depthStepInMeters = 1 // 1 метр между делениями

  const markers = Array.from({length: markerCount}, (_, i) => {
    const depthMeters = i * depthStepInMeters
    const z = -depthMeters / SCALE_FACTOR // позиция в юнитах

    return (
      <group key={i} position={[5, 0, z]}>
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshStandardMaterial color='white' />
        </mesh>
        <Text position={[0.3, 0, 0]} fontSize={0.3} color='green' anchorX='left' anchorY='middle'>
          {depthMeters} м
        </Text>
      </group>
    )
  })

  return <>{markers}</>
}
