import {Text} from '@react-three/drei'
import React from 'react'
import {OIL_TARGET_POSITION, SCALE_FACTOR} from '../config'

export const OilTarget: React.FC = () => {
  const [x, y, z] = OIL_TARGET_POSITION
  const depthInMeters = Math.abs(z * SCALE_FACTOR)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color='black' />
      </mesh>
      <Text
        position={[1, 1, 0]}
        fontSize={0.4}
        color='green'
        anchorX='left'
        anchorY='middle'
        rotation={[0, 0, Math.PI / 6]} // 30° вверх вокруг оси X
      >
        Цель: {depthInMeters.toFixed(1)} м
      </Text>
    </group>
  )
}
