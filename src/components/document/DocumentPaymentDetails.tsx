import type { ContractService, PricingFormData } from '@/types'
import type { PricingBreakdown } from '@/utils/calculations'
import { formatCurrency } from '@/utils/format'

interface DocumentPaymentDetailsProps {
  pricing: PricingFormData
  services: ContractService[]
  breakdown: PricingBreakdown
}

export function DocumentPaymentDetails({ pricing, breakdown }: DocumentPaymentDetailsProps) {
  return (
    <section className="mb-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Payment Summary
      </h4>
      <div className="max-w-xs ml-auto space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="tabular-nums">{formatCurrency(breakdown.subtotal)}</span>
        </div>
        {breakdown.discountAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>
              Discount
              {pricing.discount_type === 'percent' ? ` (${pricing.discount}%)` : ''}
            </span>
            <span className="tabular-nums">−{formatCurrency(breakdown.discountAmount)}</span>
          </div>
        )}
        {pricing.gst_enabled && breakdown.gstAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">GST ({pricing.gst_percent}%)</span>
            <span className="tabular-nums">{formatCurrency(breakdown.gstAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-2">
          <span>Grand Total</span>
          <span className="tabular-nums">{formatCurrency(breakdown.grandTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600 pt-1">
          <span>Advance Paid</span>
          <span className="tabular-nums">{formatCurrency(breakdown.advance)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Balance Due</span>
          <span className="tabular-nums">{formatCurrency(breakdown.balance)}</span>
        </div>
      </div>
    </section>
  )
}
