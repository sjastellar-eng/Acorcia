// Shared ACORCIA logo mark — gradient "A" icon + wordmark

export function AcorciaIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="acg"
          x1="8"
          y1="2"
          x2="28"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#38BDF8" />
          <stop offset="30%"  stopColor="#6366F1" />
          <stop offset="65%"  stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Outer left leg */}
      <path d="M2 34 L13 4 L16.5 4 L5.5 34Z" fill="url(#acg)" />
      {/* Outer right leg */}
      <path d="M19.5 4 L23 4 L31 34 L27.5 34Z" fill="url(#acg)" />
      {/* Inner left leg */}
      <path d="M10.5 34 L16 13 L18.5 13 L13 34Z" fill="url(#acg)" opacity="0.85" />
      {/* Inner right leg */}
      <path d="M19 13 L21.5 13 L24 34 L21.5 34Z" fill="url(#acg)" opacity="0.85" />
      {/* Crossbar */}
      <path d="M7.5 23.5 L28 23.5 L27 20 L8.5 20Z" fill="url(#acg)" />
    </svg>
  )
}

interface AcorciaLogoProps {
  size?: number
  /** If true, shows only the icon without text */
  iconOnly?: boolean
  /** Text color class for dark bg (default) or light bg */
  dark?: boolean
}

export function AcorciaLogo({ size = 30, iconOnly = false, dark = true }: AcorciaLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <AcorciaIcon size={size} />
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-widest ${dark ? 'text-white' : 'text-slate-900'}`} style={{ fontSize: size * 0.53 }}>
            ACORCIA
          </span>
          <span className={`tracking-wide ${dark ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontSize: size * 0.32 }}>
            Source Constructor
          </span>
        </div>
      )}
    </div>
  )
}
