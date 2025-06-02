interface RockLayerProps {
  depth: number
  color: string
}

export const RockLayer: React.FC<RockLayerProps> = ({depth, color}) => (
  <mesh position={[0, 0, -depth]}>
    <boxGeometry args={[10, 10, 1]} />
    <meshStandardMaterial color={color} transparent opacity={0.15} />
  </mesh>
)
