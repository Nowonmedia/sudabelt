import React from 'react'

interface SudabeltLogoProps {
  variant?: 'primary' | 'white'
  className?: string
}

const SudabeltLogo: React.FC<SudabeltLogoProps> = ({
  variant = 'primary',
  className = '',
}) => {
  const isWhite = variant === 'white'

  return (
    <div
      className={`inline-flex items-center gap-3 select-none min-w-[170px] ${className}`}
      aria-label="Sudabelt Medical"
    >
      {/* Africa Continent + Interwoven Caduceus Ribbon Emblem */}
      <svg
        width="46"
        height="46"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Upper/Central Africa Continent Shape (#006837 Clinical Green) */}
        <path
          d="M18 10L29 7L41 12L46 21L52 25L45 36L24 38L12 29L9 20L18 10Z"
          fill="#006837"
        />
        {/* Southern Africa Tip (#E30000 Brand Red) */}
        <path
          d="M24 37L43 35L39 51C37.5 55.5 31.5 56 29.5 51.5L24 37Z"
          fill="#E30000"
        />
        {/* Interwoven Caduceus Figure-8 Ribbon (#3FA9F5 Sky Blue & White) */}
        <path
          d="M26 22C26 17.5 31 15 36.5 15C42 15 46 18 46 22.5C46 26.8 41 29 36 31C31 33 26 35.2 26 39.5C26 44 30.5 47 36.5 47C42.5 47 46.5 44 46.5 39.5"
          stroke="#FFFFFF"
          strokeWidth="5.2"
          strokeLinecap="round"
        />
        <path
          d="M26 22C26 17.5 31 15 36.5 15C42 15 46 18 46 22.5C46 26.8 41 29 36 31C31 33 26 35.2 26 39.5C26 44 30.5 47 36.5 47C42.5 47 46.5 44 46.5 39.5"
          stroke="#3FA9F5"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M46 22.5C46 26.8 41 29 36 31C31 33 26 35.2 26 39.5"
          stroke="#0A6FC0"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-[23px] font-extrabold tracking-[-0.03em] ${
            isWhite ? 'text-white' : 'text-[#001142]'
          }`}
        >
          Sudabelt
        </span>
        <span
          className={`text-[11.5px] font-semibold tracking-[0.04em] self-end -mt-0.5 ${
            isWhite ? 'text-white/85' : 'text-[#001142]'
          }`}
        >
          Medical
        </span>
      </div>
    </div>
  )
}

export default SudabeltLogo
