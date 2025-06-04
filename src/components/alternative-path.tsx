import {Line} from '@react-three/drei'
import type {Vec3} from '../data'
import {ALTERNATIVE_PATH_CONFIG} from '../config'

export const AlternativePath: React.FC<{path: Vec3[]}> = ({path}) => (
  <Line
    points={path}
    color={ALTERNATIVE_PATH_CONFIG.color}
    lineWidth={ALTERNATIVE_PATH_CONFIG.lineWidth}
    transparent
    opacity={ALTERNATIVE_PATH_CONFIG.opacity}
    dashed={ALTERNATIVE_PATH_CONFIG.dashed}
  />
)
