import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/ui/BottomNav'

export function MainLayout() {
  return (
    <div className="min-h-dvh pb-20">
      <Outlet />
      <BottomNav />
    </div>
  )
}
