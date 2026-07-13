/** Dance contract delivery — confirmation of what client receives */
export const DANCE_CONTRACT_DELIVERY_OPTIONS = [
  'Photos will be selected and edited by Bhavana Studio',
  'Final images will be shared via a Google Drive link for easy access and download',
  'Final files delivered on Pendrive with final files',
  'Professionally Edited Photos',
  'Full Performance Video',
  'Performance Video',
  'Highlight Video',
  'Promo Video',
  'Album',
  'Lamination',
  'Stage Reel 1',
  'Stage Reel 2',
  'Stage Reel 3',
  'Stage Reel 4',
] as const

export const defaultDanceBalancePaymentNote =
  'The remaining balance can be settled anytime before the final delivery of the photos and videos.'

export function buildDanceContractDeliveryText(items: string[]): string {
  if (items.length === 0) return ''
  return items.map((item) => `• ${item}`).join('\n')
}

export function defaultDanceContractOverview(
  clientName: string,
  programmeDate: string,
  includes: string[] = []
): string {
  const name = clientName.trim() || '[Client / Organization Name]'
  const dateLine = programmeDate.trim() || '[Programme Date]'

  const intro = `This agreement confirms that Bhavana Studio has been engaged to provide photography and videography services for the dance programme of ${name}, scheduled on ${dateLine}.

The purpose of this document is to clearly outline the scope of services, coverage, deliverables, payment details, and terms agreed upon by both parties.`

  if (includes.length === 0) return intro

  return `${intro}

The services include:
${includes.map((item) => `• ${item}`).join('\n')}`
}

export function defaultDanceContractDetailsLetter(
  greetingName: string,
  organizationName: string,
  programmeDate: string
): string {
  const name = greetingName.trim() || '[Name]'
  const org = organizationName.trim()
  const dateLine = programmeDate.trim() ? ` on ${programmeDate.trim()}` : ''

  return `Dear ${name},

Thank you for choosing Bhavana Studio for your dance programme photography and videography requirements.

We are pleased to confirm our services for your upcoming dance programme${org ? ` (${org})` : ''}${dateLine}. Our team will capture portraits and special moments before the performance begins, along with the full performance on stage.

The package details, deliverables, payment information, and delivery terms outlined in this document form part of the agreement between both parties.

If you have any specific preferences or creative ideas, please feel free to share them with us — we would be happy to accommodate them wherever possible.

We look forward to capturing your performance beautifully.`
}

export function collectDeliverablesFromDancePackage(
  tier: { includes: string[]; deliverables: string[]; album: string[] } | undefined
): string[] {
  if (!tier) return []
  return [...tier.includes, ...tier.deliverables, ...tier.album]
}

export function suggestDanceContractDeliveryItems(packageItems: string[]): string[] {
  const suggestions: string[] = []
  const lower = packageItems.map((i) => i.toLowerCase())

  for (const option of DANCE_CONTRACT_DELIVERY_OPTIONS) {
    const optLower = option.toLowerCase()
    if (
      lower.some(
        (item) =>
          item.includes(optLower) ||
          optLower.includes(item) ||
          (item.includes('google drive') && optLower.includes('google drive')) ||
          (item.includes('pendrive') && optLower.includes('pendrive')) ||
          (item.includes('edited') && optLower.includes('edited')) ||
          (item.includes('performance video') && optLower.includes('performance video')) ||
          (item.includes('highlight') && optLower.includes('highlight')) ||
          (item.includes('promo') && optLower.includes('promo')) ||
          (item.includes('album') && optLower.includes('album')) ||
          (item.includes('lamination') && optLower.includes('laminated')) ||
          (item.includes('reel') && optLower.includes('reel'))
      )
    ) {
      suggestions.push(option)
    }
  }

  if (suggestions.length === 0) {
    return [
      'Photos will be selected and edited by Bhavana Studio',
      'Final images will be shared via a Google Drive link for easy access and download',
    ]
  }

  return suggestions
}

/** Build numbered payment text like the dance contract example */
export function buildDancePaymentDetailsText(
  totalCost: number,
  advanceReceived: number,
  advanceDate: string,
  balanceNote: string,
  formatCurrency: (n: number) => string,
  formatDate: (d: string) => string
): string {
  const balance = Math.max(0, totalCost - advanceReceived)
  const datePart = advanceDate ? ` Date of payment: ${formatDate(advanceDate)}.` : ''

  const lines = [
    `1. The total package cost is ${formatCurrency(totalCost)}. Advance Amount Received: ${formatCurrency(advanceReceived)}.${datePart}`,
    `2. The remaining balance of ${formatCurrency(balance)} ${balanceNote.trim() || defaultDanceBalancePaymentNote}`,
  ]

  return lines.join('\n\n')
}
