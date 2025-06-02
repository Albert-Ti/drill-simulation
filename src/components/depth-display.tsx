import React from 'react'

interface DepthDisplayProps {
  depth: number
}

export const DepthDisplay: React.FC<DepthDisplayProps> = ({depth}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        padding: '10px 20px',
        background: 'rgba(0,0,0,0.6)',
        color: '#0f0',
        fontSize: 18,
        borderRadius: 8,
        fontFamily: 'monospace',
      }}
    >
      Глубина: {depth.toFixed(2)} м
    </div>
  )
}
