import type { ContractService, TableColumn } from '@/types'
import { formatCurrency } from '@/utils/format'
import { calculateServiceAmount } from '@/utils/calculations'

interface DocumentServicesTableProps {
  services: ContractService[]
  columns: TableColumn[]
}

export function DocumentServicesTable({ services, columns }: DocumentServicesTableProps) {
  const visibleColumns = columns.filter((c) => c.visible)
  const enabledServices = services.filter((s) => s.enabled)

  if (enabledServices.length === 0) return null

  const renderCell = (service: ContractService, key: TableColumn['key']) => {
    switch (key) {
      case 'service':
        return <span className="font-medium">{service.name}</span>
      case 'description':
        return <span className="text-gray-600">{service.description}</span>
      case 'quantity':
        return service.quantity
      case 'price':
        return formatCurrency(service.price)
      case 'amount':
        return formatCurrency(calculateServiceAmount(service))
      default:
        return null
    }
  }

  return (
    <section className="mb-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Services
      </h4>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            {visibleColumns.map((col) => (
              <th
                key={col.key}
                className={`py-2 px-2 text-left font-semibold text-gray-700 ${
                  col.key === 'amount' || col.key === 'price' || col.key === 'quantity'
                    ? 'text-right'
                    : ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enabledServices.map((service) => (
            <tr key={service.id} className="border-b border-gray-200">
              {visibleColumns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2.5 px-2 ${
                    col.key === 'amount' || col.key === 'price' || col.key === 'quantity'
                      ? 'text-right tabular-nums'
                      : ''
                  }`}
                >
                  {renderCell(service, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
