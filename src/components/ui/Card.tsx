import { cn } from '@/utils/format'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, onClick, selected, padding = 'md' }: CardProps) {
  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'rounded-2xl border bg-surface transition-all duration-200',
        selected
          ? 'border-brand-500 ring-2 ring-brand-100 shadow-sm'
          : 'border-border hover:border-brand-200',
        onClick && 'cursor-pointer active:scale-[0.98]',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
