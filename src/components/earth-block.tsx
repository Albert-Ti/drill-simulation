export const EarthBlock: React.FC = () => (
  <mesh position={[0, 0, -15]}>
    <boxGeometry args={[10, 10, 30]} />
    <meshStandardMaterial color='#5c3d2e' transparent opacity={0.2} />
  </mesh>
)
