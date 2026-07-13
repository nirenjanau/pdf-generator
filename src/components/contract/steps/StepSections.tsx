import { useContractWizard } from '@/hooks/useContractWizard'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import { generateId } from '@/utils/format'
import type { WizardStepProps } from './types'

export function StepSections(_props: WizardStepProps) {
  const { data, updateSections, updateData } = useContractWizard()

  const addPaymentMilestone = () => {
    updateData({
      payment_schedule: [
        ...data.payment_schedule,
        { id: generateId(), label: 'Payment', amount: 0, due_date: '' },
      ],
    })
  }

  const updateMilestone = (id: string, field: string, value: string | number) => {
    updateData({
      payment_schedule: data.payment_schedule.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const removeMilestone = (id: string) => {
    updateData({
      payment_schedule: data.payment_schedule.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <p className="text-sm text-text-secondary">
        Toggle sections to include in the final document.
      </p>

      <Card className="divide-y divide-border">
        <div className="py-3 first:pt-0">
          <Toggle
            label="Album Details"
            description="Include album specifications"
            checked={data.sections.albumDetails}
            onChange={(albumDetails) => updateSections({ albumDetails })}
          />
        </div>
        <div className="py-3">
          <Toggle
            label="Terms & Conditions"
            checked={data.sections.terms}
            onChange={(terms) => updateSections({ terms })}
          />
        </div>
        <div className="py-3">
          <Toggle
            label="Deliverables"
            checked={data.sections.deliverables}
            onChange={(deliverables) => updateSections({ deliverables })}
          />
        </div>
        <div className="py-3">
          <Toggle
            label="Payment Schedule"
            checked={data.sections.paymentSchedule}
            onChange={(paymentSchedule) => updateSections({ paymentSchedule })}
          />
        </div>
        <div className="py-3 last:pb-0">
          <Toggle
            label="Notes"
            checked={data.sections.notes}
            onChange={(notes) => updateSections({ notes })}
          />
        </div>
      </Card>

      {data.sections.albumDetails && (
        <Textarea
          label="Album Details"
          value={data.album_details}
          onChange={(e) => updateData({ album_details: e.target.value })}
          placeholder="Album size, pages, cover type..."
        />
      )}

      {data.sections.terms && (
        <Textarea
          label="Terms & Conditions"
          value={data.terms}
          onChange={(e) => updateData({ terms: e.target.value })}
          rows={4}
        />
      )}

      {data.sections.deliverables && (
        <Textarea
          label="Deliverables"
          value={data.deliverables}
          onChange={(e) => updateData({ deliverables: e.target.value })}
          rows={3}
        />
      )}

      {data.sections.paymentSchedule && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Payment Schedule</p>
          {data.payment_schedule.map((item) => (
            <Card key={item.id} padding="sm" className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Milestone"
                  value={item.label}
                  onChange={(e) => updateMilestone(item.id, 'label', e.target.value)}
                  className="flex-1"
                />
                <button type="button" onClick={() => removeMilestone(item.id)} className="p-2 text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount || ''}
                  onChange={(e) => updateMilestone(item.id, 'amount', Number(e.target.value))}
                />
                <Input
                  type="date"
                  value={item.due_date ?? ''}
                  onChange={(e) => updateMilestone(item.id, 'due_date', e.target.value)}
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addPaymentMilestone}>
            <Plus className="h-4 w-4" /> Add Milestone
          </Button>
        </div>
      )}
    </div>
  )
}
