import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'highlight'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-slate-200',
    elevated: 'bg-white shadow-md',
    interactive: 'bg-white border border-slate-200 cursor-pointer transition-all hover:border-cobalt-600 hover:shadow-md hover:-translate-y-0.5',
    highlight: 'bg-white border border-slate-200 border-l-4 border-l-cobalt-600',
  }

  return (
    <div
      className={cn('rounded-2xl p-6', variants[variant], className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold text-slate-900', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}
