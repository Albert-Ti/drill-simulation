import * as THREE from 'three'

export function limitTrajectoryByMaxAngle(points: THREE.Vector3[], maxAngleDeg: number) {
  if (points.length < 3) return points

  const maxAngleRad = THREE.MathUtils.degToRad(maxAngleDeg)
  const result: THREE.Vector3[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    const v1 = new THREE.Vector3().subVectors(curr, prev).normalize()
    const v2 = new THREE.Vector3().subVectors(next, curr).normalize()
    const angle = v1.angleTo(v2)

    if (angle <= maxAngleRad) {
      result.push(curr)
    } else {
      // можно скорректировать вектор, либо игнорировать точку (мягко)
      const direction = v1.clone().lerp(v2, 0.5).normalize()
      const distance = curr.distanceTo(next)
      const adjusted = curr.clone().add(direction.multiplyScalar(distance / 2))
      result.push(adjusted)
    }
  }

  result.push(points[points.length - 1])
  return result
}
