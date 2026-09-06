import React from 'react'   

const Logo = ({ size = 38, className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform-gpu transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="logoBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E06D44" />
            <stop offset="50%" stopColor="#C85A32" />
            <stop offset="100%" stopColor="#A8431E" />
          </linearGradient>
          <linearGradient id="logoTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
          </linearGradient>
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#C85A32" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Rounded Badge with drop shadow */}
        <rect
          width="48"
          height="48"
          rx="14"
          fill="url(#logoBgGradient)"
          filter="url(#logoShadow)"
        />

        {/* Inner subtle border */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />

        {/* Compass / Flight Arc */}
        <path
          d="M12 36 C 14 26, 22 18, 33 15"
          fill="none"
          stroke="url(#logoTrail)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />

        {/* Golden Start Dot */}
        <circle cx="12" cy="36" r="2" fill="#FDE68A" />

        {/* Modern Vector Flight Jet */}
        <g transform="translate(14, 13) scale(0.95)">
          <path
            d="M21.5 2.5 L3.5 11.2 C2.1 11.9 2.1 13.9 3.6 14.5 L9.5 16.8 L12.8 22.8 C13.4 24.1 15.2 24.3 16 23 L18.2 19.5 L21.5 2.5 Z"
            fill="#FFFFFF"
          />
          <path
            d="M21.5 2.5 L9.5 16.8 L15.2 17.5 L21.5 2.5 Z"
            fill="#F5EFE6"
          />
          <path
            d="M21.5 2.5 L9.5 16.8"
            stroke="#C85A32"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

export default Logo