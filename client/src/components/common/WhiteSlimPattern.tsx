import React from 'react'

interface WhiteSlimPatternProps {
  className?: string
  opacity?: number
}

const WhiteSlimPattern: React.FC<WhiteSlimPatternProps> = ({
  className = '',
  opacity = 0.18,
}) => {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        opacity,
        backgroundImage: "url('/images/brand/PATTERNS-WHITE%20SLIM%201.webp')",
        backgroundRepeat: 'repeat',
        backgroundSize: '360px auto',
        backgroundPosition: 'center right',
      }}
      aria-hidden="true"
    />
  )
}

export default WhiteSlimPattern
