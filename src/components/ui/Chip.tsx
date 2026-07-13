import { cn } from '@/utils/format'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function Chip({ label, selected, onClick, variant = 'default' }: ChipProps) {
  const variants = {
    default: selected
      ? 'bg-brand-900 text-white'
      : 'bg-surface-secondary text-text-secondary border border-border',
    success: 'bg-green-50 text-success border border-green-200',
    warning: 'bg-amber-50 text-warning border border-amber-200',
    danger: 'bg-red-50 text-danger border border-red-200',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-all duration-200',
        'touch-manipulation active:scale-95',
        onClick && 'cursor-pointer',
        variants[variant]
      )}
    >
      {label}
    </button>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-amber-50 text-warning border-amber-200',
    sent: 'bg-blue-50 text-blue-700 border-blue-200',
    signed: 'bg-green-50 text-success border-green-200',
    cancelled: 'bg-red-50 text-danger border-red-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center h-6 px-2.5 rounded-full text-xs font-semibold capitalize border',
        styles[status] ?? styles.draft
      )}
    >
      {status}
    </span>
  )
}
