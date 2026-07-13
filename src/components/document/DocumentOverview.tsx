import { formatDate } from '@/utils/format'

interface DocumentOverviewProps {
  brideName?: string
  groomName?: string
  eventDate?: string
  packageName?: string
}

export function DocumentOverview({ brideName, groomName, eventDate, packageName }: DocumentOverviewProps) {
  const couple = [brideName, groomName].filter(Boolean).join(' & ')

  return (
    <section className="mb-6 p-4 bg-gray-50 rounded-lg">
      {couple && (
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{couple}</h3>
      )}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {eventDate && <span>📅 {formatDate(eventDate)}</span>}
        {packageName && <span>📦 {packageName} Package</span>}
      </div>
    </section>
  )
}
