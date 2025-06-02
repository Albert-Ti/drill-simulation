import {Line} from '@react-three/drei'
import type {Vec3} from '../data'

export const AlternativePath: React.FC<{path: Vec3[]}> = ({path}) => (
  <Line points={path} color='blue' lineWidth={1} transparent opacity={0.2} dashed />
)
