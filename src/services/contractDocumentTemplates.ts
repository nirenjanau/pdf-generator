/** Contract-only delivery options — shown in Delivery & File Access section */

export const CONTRACT_DELIVERY_OPTIONS = [
  'Premium Pearl Wedding Album',
  'Classic Wedding Album',
  'Family Book / Mini Book',
  'Table Calendar',
  'Laminated Photo',
  'Professionally Edited High-Resolution Photographs',
  'Full-Length Wedding Film',
  'Wedding Highlight Video',
  'Highlight Video',
  'Full Coverage Video',
  'Professionally Edited Reception Photographs',
  'Full Reception Coverage Video',
  'Google Drive Access for Digital Viewing and Download',
  'Pendrive with final files',
] as const

export const PHOTO_GALLERY_TEXT = `Complimentary Service

Smart Guest Photo Gallery

As a special gesture from Bhavana Studio, the Smart Guest Photo Gallery will be provided complimentary for this celebration.

This feature allows wedding guests to effortlessly access their photographs throughout the event.

Each guest can simply scan a QR code and upload a selfie. Using advanced face-recognition technology, the system automatically identifies and displays all photographs in which they appear during the wedding celebrations.

Features
• QR Code-based access
• Instant photo retrieval using face recognition
• Personalized gallery for each guest
• Easy viewing and downloading on mobile devices
• No need to manually search through thousands of photos
• Enhanced guest experience

This complimentary service offers a modern and convenient way for family members and guests to quickly receive and enjoy their wedding memories.`

export const defaultServiceCoverageTerms = `To ensure complete clarity regarding the services included in this agreement, please note the following:

• The photography and videography team will report approximately 30 minutes prior to the scheduled function time.
• The package cost covers only the services specifically mentioned in this agreement.
• Any additional coverage, hours, albums, edits, or services beyond the agreed package may incur extra costs.
• Travel, accommodation, equipment transportation, and professional editing charges are included as specified in the package.
• Bhavana Studio shall make every effort to capture all important moments.
• This section is included for transparency regarding scope and to avoid misunderstandings about event dates.`

export const defaultBalancePaymentNote =
  `Once the wedding coverage is completed, we request 80% of the balance amount to be paid. The remaining 20% is due before the final delivery of albums and videos.

Any additional services requested beyond the scope of this agreement shall be charged separately upon mutual approval.`

export function buildContractDeliveryText(items: string[]): string {
  if (items.length === 0) return ''

  const bullets = items.map((item) => `• ${item}`).join('\n')

  return `All selected photographs and videos will undergo professional editing, colour correction, and enhancement prior to final delivery. The final delivery package will include:

${bullets}

This ensures that your memories remain easily accessible and securely preserved for years to come.`
}

export function defaultContractOverview(clientName: string, dates: string): string {
  const name = clientName.trim() || '[Client Name]'
  const dateLine = dates.trim() || '[Event Dates]'

  return `This agreement confirms that Bhavana Studio has been engaged to provide photography and videography services for the wedding and reception celebrations of ${name} scheduled on ${dateLine}.

The purpose of this document is to clearly outline the scope of services, event coverage, deliverables, payment details, and terms agreed upon by both parties. It serves as a formal confirmation of the services to be provided and ensures complete clarity regarding the responsibilities and expectations associated with the wedding and reception coverage.`
}

export function defaultContractDetailsLetter(
  greetingName: string,
  events: string[],
  dates: string
): string {
  const name = greetingName.trim() || '[Name]'
  const eventList =
    events.length > 0 ? events.join(', ') : 'your wedding celebrations'
  const dateLine = dates.trim() || '[Coverage Dates]'

  return `Dear ${name},

Thank you for choosing Bhavana Studio for your wedding photography and videography requirements.

We are pleased to confirm that Bhavana Studio will provide photography and videography services for your ${eventList}, scheduled on ${dateLine}.

The package details, deliverables, payment information, and service terms outlined in this document form part of the agreement between both parties.

We look forward to being part of your special day and preserving memories that you and your family will cherish for a lifetime.`
}

export function collectDeliverablesFromPackages(
  weddingTier: { deliverables: string[]; album: string[] } | undefined,
  reception: { enabled: boolean; deliverables: string[]; album: string[] } | undefined
): string[] {
  const items: string[] = []
  const seen = new Set<string>()

  const add = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || seen.has(trimmed)) return
    seen.add(trimmed)
    items.push(trimmed)
  }

  weddingTier?.album.forEach(add)
  weddingTier?.deliverables.forEach(add)

  if (reception?.enabled) {
    reception.album.forEach(add)
    reception.deliverables.forEach(add)
  }

  return items
}

/** Map package deliverables to contract delivery checkbox labels where possible */
export function suggestContractDeliveryItems(packageItems: string[]): string[] {
  const suggestions: string[] = []
  const lower = packageItems.map((i) => i.toLowerCase())

  for (const option of CONTRACT_DELIVERY_OPTIONS) {
    const optLower = option.toLowerCase()
    if (
      lower.some(
        (item) =>
          item.includes(optLower) ||
          optLower.includes(item) ||
          (item.includes('pendrive') && optLower.includes('pendrive')) ||
          (item.includes('google drive') && optLower.includes('google drive')) ||
          (item.includes('highlight') && optLower.includes('highlight')) ||
          (item.includes('family book') && optLower.includes('family book')) ||
          (item.includes('calendar') && optLower.includes('calendar')) ||
          (item.includes('laminated') && optLower.includes('laminated'))
      )
    ) {
      suggestions.push(option)
    }
  }

  return suggestions
}
