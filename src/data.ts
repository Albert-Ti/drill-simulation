export type Vec3 = [number, number, number]

// 30 ед. вниз по Z (глубина 3000м)
export const mockTrajectory: Vec3[] = Array.from({length: 300}, (_, i) => [
  0,
  0,
  -i * 0.1, // шаг 0.1 ед. ≈ 10 м
])

export const alternativeTrajectory: Vec3[] = Array.from({length: 300}, (_, i) => [
  Math.sin(i * 0.02) * 0.5,
  0,
  -i * 0.1,
])
