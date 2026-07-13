import { useContractWizard } from '@/hooks/useContractWizard'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { Chip } from '@/components/ui/Chip'
import { formatCurrency } from '@/utils/format'
import { calculatePricing } from '@/utils/calculations'
import type { WizardStepProps } from './types'

export function StepPricing(_props: WizardStepProps) {
  const { data, updatePricing } = useContractWizard()
  const breakdown = calculatePricing(data.services, data.pricing)

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <Card className="space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-text-secondary">Subtotal</span>
          <span className="font-semibold">{formatCurrency(breakdown.subtotal)}</span>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Discount</label>
          <div className="flex gap-2 mb-2">
            <Chip
              label="Amount (₹)"
              selected={data.pricing.discount_type === 'amount'}
              onClick={() => updatePricing({ discount_type: 'amount' })}
            />
            <Chip
              label="Percent (%)"
              selected={data.pricing.discount_type === 'percent'}
              onClick={() => updatePricing({ discount_type: 'percent' })}
            />
          </div>
          <input
            type="number"
            min={0}
            value={data.pricing.discount}
            onChange={(e) => updatePricing({ discount: Number(e.target.value) })}
            className="w-full h-12 rounded-xl border border-border px-4 text-base"
          />
          {breakdown.discountAmount > 0 && (
            <p className="text-sm text-success mt-1">
              −{formatCurrency(breakdown.discountAmount)} discount applied
            </p>
          )}
        </div>

        <Toggle
          label="Include GST"
          checked={data.pricing.gst_enabled}
          onChange={(gst_enabled) => updatePricing({ gst_enabled })}
        />
        {data.pricing.gst_enabled && (
          <div>
            <label className="text-sm font-medium">GST %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={data.pricing.gst_percent}
              onChange={(e) => updatePricing({ gst_percent: Number(e.target.value) })}
              className="w-full h-12 rounded-xl border border-border px-4 text-base mt-1"
            />
            {breakdown.gstAmount > 0 && (
              <p className="text-sm text-text-secondary mt-1">
                GST: {formatCurrency(breakdown.gstAmount)}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="bg-brand-900 text-white space-y-2">
        <div className="flex justify-between text-lg">
          <span>Grand Total</span>
          <span className="font-bold">{formatCurrency(breakdown.grandTotal)}</span>
        </div>
      </Card>

      <Card className="space-y-3">
        <div>
          <label className="text-sm font-medium">Advance Payment</label>
          <input
            type="number"
            min={0}
            max={breakdown.grandTotal}
            value={data.pricing.advance}
            onChange={(e) => updatePricing({ advance: Number(e.target.value) })}
            className="w-full h-12 rounded-xl border border-border px-4 text-base mt-1"
          />
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
          <span>Balance Due</span>
          <span className="text-brand-900">{formatCurrency(breakdown.balance)}</span>
        </div>
      </Card>
    </div>
  )
}
