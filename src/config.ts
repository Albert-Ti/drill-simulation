// Геологические слои (от поверхности к глубине)
export const GEO_LAYERS = [
  {name: 'Суглинок', color: '#d9c2a3', height: 200},
  {name: 'Глина', color: '#a9746e', height: 800},
  {name: 'Песчаник', color: '#c2b280', height: 500},
  {name: 'Известняк', color: '#f0e4d7', height: 500},
  {name: 'Сланец', color: '#6e6e6e', height: 800},
  {name: 'Базальт', color: '#2e2e2e', height: 100},
]

export const SCALE_FACTOR = 100 // 1 юнит = 100 м

export const DRILL_SPEED_M_PER_HOUR = 30000 // м/ч (можно поменять динамически)

export const EARTH_DEPTH_M = GEO_LAYERS.reduce((acc, geo) => acc + geo.height, 0) // глубина земли в метрах
export const EARTH_WIDTH = 15
export const EARTH_HEIGHT = 15

export const OIL_TARGET_DEPTH_M = 2689 // цель в метрах
export const OIL_TARGET_POSITION: [number, number, number] = [
  0,
  0,
  -OIL_TARGET_DEPTH_M / SCALE_FACTOR,
]

export const ALTERNATIVE_PATH_CONFIG = {
  color: 'blue',
  lineWidth: 3,
  opacity: 0.2,
  dashed: true,
}
