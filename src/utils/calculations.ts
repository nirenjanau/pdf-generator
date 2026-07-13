import type { ContractService, PricingFormData } from '@/types'

export interface PricingBreakdown {
  subtotal: number
  discountAmount: number
  afterDiscount: number
  gstAmount: number
  grandTotal: number
  advance: number
  balance: number
}

export function calculateServiceAmount(service: ContractService): number {
  if (!service.enabled) return 0
  return service.price * service.quantity
}

export function calculateSubtotal(services: ContractService[]): number {
  return services
    .filter((s) => s.enabled)
    .reduce((sum, s) => sum + calculateServiceAmount(s), 0)
}

export function calculatePricing(
  services: ContractService[],
  pricing: PricingFormData
): PricingBreakdown {
  const subtotal = calculateSubtotal(services)

  const discountAmount =
    pricing.discount_type === 'percent'
      ? Math.round((subtotal * pricing.discount) / 100)
      : pricing.discount

  const afterDiscount = Math.max(0, subtotal - discountAmount)

  const gstAmount = pricing.gst_enabled
    ? Math.round((afterDiscount * pricing.gst_percent) / 100)
    : 0

  const grandTotal = afterDiscount + gstAmount
  const advance = Math.min(pricing.advance, grandTotal)
  const balance = Math.max(0, grandTotal - advance)

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    gstAmount,
    grandTotal,
    advance,
    balance,
  }
}
