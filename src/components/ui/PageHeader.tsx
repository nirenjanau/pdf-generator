import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, backTo, action }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-4">
      <div className="flex items-center gap-3">
        {backTo !== undefined && (
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-surface-secondary transition-colors -ml-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-text-primary truncate">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary truncate">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}

interface StickyFooterProps {
  children: ReactNode
}

export function StickyFooter({ children }: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm border-t border-border p-4 safe-bottom no-print">
      <div className="max-w-lg mx-auto flex gap-3">{children}</div>
    </div>
  )
}

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-50 text-brand-900 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

export { Button }
