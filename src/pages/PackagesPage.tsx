import { Package } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { usePackages, useServices } from '@/hooks/usePackages'
import { formatCurrency } from '@/utils/format'

export function PackagesPage() {
  const { packages, loading } = usePackages()
  const { services } = useServices()

  const getServiceNames = (ids: string[]) =>
    ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean)

  return (
    <>
      <PageHeader title="Packages" subtitle="Pre-built wedding packages" />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
          </div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.id}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Package className="h-5 w-5 text-brand-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <p className="text-sm text-text-secondary">{pkg.description}</p>
                  </div>
                </div>
                {pkg.price > 0 && (
                  <span className="text-lg font-bold text-brand-900">{formatCurrency(pkg.price)}</span>
                )}
              </div>
              {pkg.service_ids.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {getServiceNames(pkg.service_ids).map((name) => (
                    <span
                      key={name}
                      className="text-xs bg-surface-secondary text-text-secondary px-2.5 py-1 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </>
  )
}
