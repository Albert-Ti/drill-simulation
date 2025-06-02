import {type Vec3} from '../data'

export const DrillHead: React.FC<{position: Vec3}> = ({position}) => (
  <mesh position={position}>
    <sphereGeometry args={[0.2, 16, 16]} />
    <meshStandardMaterial color='red' />
  </mesh>
)
