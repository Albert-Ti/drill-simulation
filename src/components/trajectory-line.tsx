import * as THREE from 'three'
import {Line} from '@react-three/drei'
import {type Vec3} from '../data'

interface Props {
  points: Vec3[]
  fullTrajectory: Vec3[]
}

export const TrajectoryLine: React.FC<Props> = ({points, fullTrajectory}) => {
  if (points.length < 2) {
    return <Line points={fullTrajectory} color='gray' transparent opacity={0.3} lineWidth={1} />
  }

  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 100, 0.02, 8, false)

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color='orange' />
    </mesh>
  )
}
