import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/format'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700 shadow-sm',
      secondary: 'bg-brand-50 text-brand-900 hover:bg-brand-100 active:bg-brand-200',
      ghost: 'bg-transparent text-text-secondary hover:bg-surface-secondary active:bg-border',
      danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700',
      outline: 'border-2 border-brand-900 text-brand-900 hover:bg-brand-50 active:bg-brand-100',
    }

    const sizes = {
      sm: 'h-10 px-4 text-sm rounded-xl',
      md: 'h-12 px-6 text-base rounded-xl',
      lg: 'h-14 px-8 text-lg rounded-2xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'touch-manipulation select-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
