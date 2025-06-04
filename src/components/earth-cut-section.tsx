// src/components/EarthCutSection.tsx

import React from 'react'
import * as THREE from 'three'
import {EARTH_HEIGHT, EARTH_WIDTH, GEO_LAYERS, SCALE_FACTOR} from '../config'

interface EarthCutSectionProps {
  /** Позиция бура в юнитах Three.js: [x0, y0, z0] */
  targetPosition: [number, number, number]
}

export const EarthCutSection: React.FC<EarthCutSectionProps> = ({targetPosition}) => {
  const [x0, y0] = targetPosition

  let accumulatedDepth = 0

  const cutSectionMeshes = GEO_LAYERS.flatMap((layer, index) => {
    const layerDepth = layer.height / SCALE_FACTOR
    const posZ = -accumulatedDepth - layerDepth / 2
    accumulatedDepth += layerDepth

    const material = new THREE.MeshStandardMaterial({
      color: layer.color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    })

    const parts = []

    // Левая часть (X < x0)
    parts.push(
      <mesh key={`${index}-left`} position={[(x0 - EARTH_WIDTH) / 4, 0, posZ]}>
        <boxGeometry args={[x0 + EARTH_WIDTH / 2, EARTH_HEIGHT, layerDepth]} />
        <primitive object={material} attach='material' />
      </mesh>
    )

    // Нижняя часть справа и по центру (X >= x0, Y < y0)
    parts.push(
      <mesh
        key={`${index}-bottom-right`}
        position={[(EARTH_WIDTH + x0) / 4, (y0 - EARTH_HEIGHT) / 4, posZ]}
      >
        <boxGeometry args={[(EARTH_WIDTH + x0) / 2 - x0, y0 + EARTH_HEIGHT / 2, layerDepth]} />
        <primitive object={material} attach='material' />
      </mesh>
    )

    return parts
  })

  return <group>{cutSectionMeshes}</group>
}
