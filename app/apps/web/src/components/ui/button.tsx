import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-cobalt-600 text-white hover:bg-cobalt-700 active:bg-cobalt-700 shadow-sm hover:-translate-y-px hover:shadow-md',
      secondary: 'bg-cobalt-50 text-cobalt-600 hover:bg-cobalt-100',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100',
      gradient: 'bg-gradient-to-r from-cobalt-600 to-violet-600 text-white hover:opacity-90 hover:-translate-y-px shadow-sm hover:shadow-md',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
