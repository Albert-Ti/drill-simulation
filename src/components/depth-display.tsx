import React from 'react'
import {DRILL_SPEED_M_PER_HOUR, OIL_TARGET_DEPTH_M} from '../config'

interface DepthDisplayProps {
  depth: number // текущая глубина в метрах
}

export const DepthDisplay: React.FC<DepthDisplayProps> = ({depth}) => {
  const targetDepth = OIL_TARGET_DEPTH_M
  const remaining = Math.max(0, targetDepth - depth)
  const percentDone = (depth / targetDepth) * 100
  const speed = DRILL_SPEED_M_PER_HOUR
  const etaSeconds = speed > 0 ? (remaining / speed) * 3600 : 0

  // Теоретическая температура: +15 °C на поверхности + 2.5 °C на каждые 100 м
  const temperature = 15 + (depth / 100) * 2.5

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        padding: '10px 20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        fontSize: 16,
        borderRadius: 8,
        fontFamily: 'monospace',
        lineHeight: 1.6,
        zIndex: 1,
      }}
    >
      <div>Глубина: {depth.toFixed(2)} м</div>
      <div>Цель: {targetDepth} м</div>
      <div>Пройдено: {percentDone.toFixed(1)}%</div>
      <div>Осталось: {remaining.toFixed(2)} м</div>
      <div>Скорость: {speed} м/ч</div>
      <div>ETA: {etaSeconds > 0 ? formatTime(etaSeconds) : '—'}</div>
      <div>Температура бура: {temperature.toFixed(1)}°C</div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}ч ${m}м ${s}с`
}
