import { NavLink } from 'react-router-dom'
import { Home, FileText, Users, Gift, Settings } from 'lucide-react'
import { cn } from '@/utils/format'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/proposals', icon: Gift, label: 'Packages' },
  { to: '/contracts', icon: FileText, label: 'Contracts' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border safe-bottom no-print">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[64px] min-h-[56px] transition-colors',
                isActive ? 'text-brand-900' : 'text-text-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-6 w-6', isActive && 'stroke-[2.5]')} />
                <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
