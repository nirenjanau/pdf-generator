import { useState } from 'react'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { useContractWizard } from '@/hooks/useContractWizard'
import { useServices } from '@/hooks/usePackages'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { formatCurrency } from '@/utils/format'
import { generateId } from '@/utils/format'
import { serviceToContractService } from '@/services/mockData'
import type { ContractService } from '@/types'
import type { WizardStepProps } from './types'

export function StepServices(_props: WizardStepProps) {
  const { data, updateData } = useContractWizard()
  const { services: libraryServices } = useServices()
  const [showAdd, setShowAdd] = useState(false)

  const updateService = (id: string, updates: Partial<ContractService>) => {
    updateData({
      services: data.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  const removeService = (id: string) => {
    updateData({ services: data.services.filter((s) => s.id !== id) })
  }

  const addFromLibrary = (serviceId: string) => {
    const svc = libraryServices.find((s) => s.id === serviceId)
    if (!svc) return
    updateData({ services: [...data.services, serviceToContractService(svc)] })
    setShowAdd(false)
  }

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newServices = [...data.services]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newServices.length) return
    ;[newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]]
    updateData({ services: newServices })
  }

  const addCustomService = () => {
    updateData({
      services: [
        ...data.services,
        {
          id: generateId(),
          service_id: '',
          name: 'Custom Service',
          price: 0,
          quantity: 1,
          description: '',
          enabled: true,
        },
      ],
    })
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col gap-3 animate-slide-up">
      {data.services.map((service, index) => (
        <Card key={service.id} padding="sm" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => moveService(index, 'up')} className="text-text-muted hover:text-text-primary p-0.5" disabled={index === 0}>
                <GripVertical className="h-4 w-4 rotate-90" />
              </button>
            </div>
            <Toggle
              checked={service.enabled}
              onChange={(enabled) => updateService(service.id, { enabled })}
            />
            <input
              type="text"
              value={service.name}
              onChange={(e) => updateService(service.id, { name: e.target.value })}
              className="flex-1 font-medium bg-transparent border-none outline-none text-base"
            />
            <button type="button" onClick={() => removeService(service.id)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {service.enabled && (
            <>
              <textarea
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                placeholder="Description"
                className="w-full text-sm text-text-secondary bg-surface-secondary rounded-lg px-3 py-2 border-none outline-none resize-none"
                rows={2}
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-text-muted">Price</label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => updateService(service.id, { price: Number(e.target.value) })}
                    className="w-full h-10 rounded-lg border border-border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={service.quantity}
                    onChange={(e) => updateService(service.id, { quantity: Number(e.target.value) })}
                    className="w-full h-10 rounded-lg border border-border px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Amount</label>
                  <div className="h-10 flex items-center text-sm font-semibold">
                    {formatCurrency(service.price * service.quantity)}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}

      {showAdd ? (
        <Card className="space-y-2">
          <p className="text-sm font-medium">Add from library</p>
          <div className="flex flex-wrap gap-2">
            {libraryServices
              .filter((s) => !data.services.some((cs) => cs.service_id === s.id))
              .map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addFromLibrary(s.id)}
                  className="h-9 px-3 rounded-full bg-brand-50 text-brand-900 text-sm font-medium hover:bg-brand-100"
                >
                  {s.name}
                </button>
              ))}
          </div>
          <Button variant="ghost" size="sm" onClick={addCustomService}>
            + Custom Service
          </Button>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setShowAdd(true)} fullWidth>
          <Plus className="h-5 w-5" /> Add Service
        </Button>
      )}
    </div>
  )
}
