import React from 'react'

interface SudabeltLogoProps {
  variant?: 'primary' | 'white'
  size?: 'header' | 'footer'
  className?: string
}

const SudabeltLogo: React.FC<SudabeltLogoProps> = ({
  variant = 'primary',
  size = 'header',
  className = '',
}) => {
  const src =
    variant === 'white'
      ? '/images/brand/sudabelt-logo-white.webp'
      : '/images/brand/sudabelt-logo-primary.webp'

  // Uses canonical Tailwind v4 spacing scale (e.g. h-18.5 = 74px, h-23 = 92px, -ml-7 = -28px)
  const sizeClasses =
    size === 'footer'
      ? 'h-22 sm:h-24 lg:h-27 -ml-8 sm:-ml-9 lg:-ml-10 -my-3'
      : 'h-18.5 sm:h-20.5 lg:h-23 -ml-6.75 sm:-ml-7.5 lg:-ml-8.5'

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      aria-label="Sudabelt Medical"
    >
      <img
        src={src}
        alt="Sudabelt Medical"
        width={260}
        height={108}
        className={`${sizeClasses} w-auto max-w-none object-contain object-left`}
      />
    </div>
  )
}

export default SudabeltLogo
