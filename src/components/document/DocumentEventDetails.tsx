import type { EventFormData } from '@/types'
import { formatDate } from '@/utils/format'

export function DocumentEventDetails({ event }: { event: EventFormData }) {
  return (
    <section className="mb-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Event Details
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div><span className="text-gray-500">Wedding Date:</span> {formatDate(event.event_date)}</div>
        {event.reception_date && (
          <div><span className="text-gray-500">Reception:</span> {formatDate(event.reception_date)}</div>
        )}
        <div className="col-span-2"><span className="text-gray-500">Venue:</span> {event.venue}</div>
        {event.event_time && (
          <div><span className="text-gray-500">Time:</span> {event.event_time}</div>
        )}
      </div>
    </section>
  )
}
