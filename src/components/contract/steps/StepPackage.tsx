import { Package } from 'lucide-react'
import { useContractWizard } from '@/hooks/useContractWizard'
import { usePackages, useServices } from '@/hooks/usePackages'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import { serviceToContractService } from '@/services/mockData'
import type { WizardStepProps } from './types'

export function StepPackage({ onNext }: WizardStepProps) {
  const { data, updateData } = useContractWizard()
  const { packages, loading } = usePackages()
  const { services } = useServices()

  const selectPackage = (pkg: typeof packages[0]) => {
    const contractServices = pkg.service_ids
      .map((sid) => services.find((s) => s.id === sid))
      .filter(Boolean)
      .map((s) => serviceToContractService(s!))

    updateData({
      package_id: pkg.id,
      package_name: pkg.name,
      services: contractServices,
      terms: pkg.terms || data.terms,
      deliverables: pkg.deliverables || data.deliverables,
      pricing: {
        ...data.pricing,
        advance: pkg.price > 0 ? Math.round(pkg.price * 0.5) : data.pricing.advance,
      },
    })
    onNext()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Package className="h-4 w-4" />
        Select a Package
      </div>

      {packages.map((pkg) => (
        <Card
          key={pkg.id}
          onClick={() => selectPackage(pkg)}
          selected={data.package_id === pkg.id}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <p className="text-sm text-text-secondary mt-0.5">{pkg.description}</p>
              {pkg.service_ids.length > 0 && (
                <p className="text-xs text-text-muted mt-2">
                  {pkg.service_ids.length} services included
                </p>
              )}
            </div>
            {pkg.price > 0 && (
              <span className="text-lg font-bold text-brand-900">
                {formatCurrency(pkg.price)}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
