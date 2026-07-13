import type { PaymentScheduleItem } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'

export function DocumentPaymentSchedule({ items }: { items: PaymentScheduleItem[] }) {
  return (
    <section className="mb-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Payment Schedule
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-1.5 text-left font-semibold text-gray-700">Milestone</th>
            <th className="py-1.5 text-right font-semibold text-gray-700">Amount</th>
            <th className="py-1.5 text-right font-semibold text-gray-700">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2">{item.label}</td>
              <td className="py-2 text-right tabular-nums">{formatCurrency(item.amount)}</td>
              <td className="py-2 text-right">{item.due_date ? formatDate(item.due_date) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
