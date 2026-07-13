import type { WeddingPackageProposalData, PackageTier, ReceptionPackageData } from '@/types'
import { formatCurrency } from '@/utils/format'
import { formatEventList } from './weddingEventOptions'
import {
  defaultBalancePaymentNote,
  defaultContractDetailsLetter,
  defaultContractOverview,
  defaultServiceCoverageTerms,
} from './contractDocumentTemplates'

export const defaultWeddingTiers: PackageTier[] = [
  {
    id: 'standard',
    name: 'Standard Package',
    subtitle: 'Simple & Clean Coverage',
    price: 40000,
    includes: ['Wedding Function Coverage'],
    coverageTeam: [],
    album: ['60 pages', 'Standard NT Album'],
    videoPhotography: [],
    deliverables: ['Pen drive', 'Google Drive', 'Album'],
    enabled: true,
  },
  {
    id: 'classic',
    name: 'Classic Collection',
    subtitle: 'Complete Wedding Storytelling Experience',
    price: 119500,
    includes: ['Pre Wedding'],
    coverageTeam: [
      'Still Photographer',
      'Traditional Videographer',
      'Candid Photographer',
      'Candid Videographer',
    ],
    album: ['120 pages', 'Classic NT HD Album'],
    videoPhotography: [],
    deliverables: [
      'Classic Wedding Album',
      'Family Book / Mini Book',
      'Highlight Video',
      'Google Drive access',
      'Pendrive with final files',
      'Table Calendar',
      'Laminated Photo',
    ],
    enabled: true,
  },
  {
    id: 'premium',
    name: 'Premium Collection',
    subtitle: 'Luxury Wedding Experience',
    price: 131500,
    includes: ['Pre Wedding'],
    coverageTeam: [
      'Still Photographer',
      'Traditional Videographer',
      'Candid Photographer',
      'Candid Videographer',
      'Candid Videographer 2',
    ],
    album: ['120 pages', 'Premium Pearl Finish Album'],
    videoPhotography: [],
    deliverables: [
      'Premium Pearl Wedding Album',
      'Family Book / Mini Book',
      'Highlight Video',
      'Google Drive access',
      'Pendrive with final files',
      'Table Calendar',
      'Laminated Photo',
    ],
    enabled: true,
  },
]

export const defaultReceptionPackage: ReceptionPackageData = {
  enabled: false,
  name: 'Premium Collection',
  subtitle: 'Complete Reception Coverage Experience',
  price: 72500,
  includes: ['Complete Reception Coverage'],
  coverageTeam: [
    'Traditional Photographer',
    'Traditional Videographer',
    'Candid Photographer',
    'Candid Videographer',
  ],
  videoPhotography: [],
  album: ['Album Not Included'],
  deliverables: [
    'Professionally Edited Photographs',
    'Highlight Video',
    'Full Coverage Video',
    'Google Drive Access',
  ],
  packageInclusions: [
    'Travel Expenses Included',
    'Accommodation Included',
    'Equipment Transportation Included',
    'Professional Editing & Color Grading Included',
    'Coverage Team Charges Included',
  ],
  additionalInfo:
    'Additional Display Option: If an LED screen or display wall is available at the reception venue, we can arrange presentation of selected highlights from the Guruvayur wedding ceremony for your guests. This service can be customized based on your requirements and venue facilities.\n\nAlbum Information: Album charges are not included in the Reception Package. As the reception is expected to host a large number of guests, the required album size and page count can be finalized after photo selection. For Classic NT album, the cost is ₹350 per page, and for Premium Pearl album, the cost is ₹450 per page. The final album cost will be calculated based on the selected album type and the total number of pages required after the design and selection process.',
}

export const defaultOverviewText = (clientName: string, _events: string[] = []) => {
  const name = clientName.trim() || '[Client Name]'
  return `This document presents customized photography and videography packages specially prepared for ${name} by Bhavana Studio.

Our packages are designed to provide complete coverage of every celebration with a perfect blend of photography, videography, candid storytelling, and timeless memories.

This document provides a clear understanding of the event coverage, deliverables, album details, and investment associated with each package.`
}

export const defaultDetailsLetter = (greetingName: string, events: string[]) => {
  const name = greetingName.trim() || '[Name]'
  const eventList = formatEventList(events)

  return `Dear ${name},

Thank you for considering Bhavana Studio for your wedding photography and videography requirements.

At Bhavana Studio, we believe every wedding tells a unique story. Our team is dedicated to capturing genuine emotions, timeless moments, and every important detail through a perfect blend of traditional photography, candid photography, and candid videography.

For your upcoming wedding celebrations, including ${eventList}, we have carefully customized the following packages based on your requirements.

We look forward to being a part of your special journey and preserving memories that you and your family will cherish for a lifetime.`
}

/** Builds a client-specific pricing note from the packages currently enabled */
export function buildPricingDifferenceText(tiers: PackageTier[]): string {
  const enabled = tiers.filter((t) => t.enabled)
  if (enabled.length < 2) return ''

  const lines = enabled.map((t) => {
    const detail =
      t.album.filter(Boolean).length > 0
        ? t.album.join(', ')
        : t.includes.filter(Boolean).join(', ') || 'as listed'
    return `• ${t.name} (${formatCurrency(t.price)}): ${detail}`
  })

  const subject = enabled.some((t) => t.album.length > 0) ? 'album type and finish' : 'coverage and deliverables'

  return `The pricing difference between the packages offered in this proposal is based on the inclusions customized for this client — primarily ${subject}.

${lines.join('\n')}

Please edit this section to explain any other client-specific differences (team size, coverage days, deliverables, travel, etc.).`
}

export const defaultBookingText =
  `If you would like to secure Bhavana Studio for your special day, we kindly request a booking process to ensure your slot is reserved.

Advance Payment: To confirm your booking, a minimum advance of 30% of the total package amount is required. This payment secures your date and initiates the booking process.

Confirmation: Once the advance payment is received, we will immediately reserve your slot for the date. We will then share a formal contract with you, confirming our availability and all agreed-upon services.`

export function collectProposalDeliverables(
  tiers: PackageTier[],
  reception?: ReceptionPackageData
): string[] {
  const items: string[] = []
  const seen = new Set<string>()

  const add = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || seen.has(trimmed)) return
    seen.add(trimmed)
    items.push(trimmed)
  }

  for (const tier of tiers.filter((t) => t.enabled)) {
    tier.deliverables.forEach(add)
  }

  if (reception?.enabled) {
    reception.deliverables.forEach(add)
  }

  return items
}

export function buildDeliveryTextFromDeliverables(
  tiers: PackageTier[],
  reception?: ReceptionPackageData
): string {
  const deliverables = collectProposalDeliverables(tiers, reception)
  if (deliverables.length === 0) return ''

  const bullets = deliverables.map((item) => `• ${item}`).join('\n')

  return `All selected photographs and videos will undergo professional editing and color correction before final delivery.

Upon completion, clients will receive:
${bullets}

This ensures that your memories remain easily accessible and securely preserved for years to come.`
}

export const defaultDeliveryText = ''

export const defaultContactPersons = [
  { name: 'Unnikrishnan', phone: '+91 9387103562' },
  { name: 'Nirenjana', phone: '+91 80890 75012' },
]

export const PRESET_WEDDING_TIER_IDS = new Set(['standard', 'classic', 'premium'])

export function createEmptyPackageTier(name = 'Custom Package'): PackageTier {
  return {
    id: crypto.randomUUID(),
    name,
    subtitle: '',
    price: 0,
    includes: [],
    coverageTeam: [],
    album: [],
    videoPhotography: [],
    deliverables: [],
    enabled: true,
  }
}

export function createDefaultContractData(): WeddingPackageProposalData {
  const base = createDefaultProposalData()
  const confirmedTier = base.tiers.find((t) => t.id === 'premium') ?? base.tiers[0]
  const greeting = ''
  const dates = base.coverage_dates || ''

  return {
    ...base,
    document_type: 'contract',
    collection_title: 'Packages Details',
    confirmed_tier_id: confirmedTier?.id,
    tiers: base.tiers.map((t) => ({ ...t, enabled: t.id === confirmedTier?.id })),
    show_pricing_difference: false,
    booking_text: '',
    delivery_text: '',
    contract_overview_text: defaultContractOverview(greeting, dates),
    contract_details_letter: defaultContractDetailsLetter(greeting, base.events_covered, dates),
    contract_delivery_items: [],
    show_delivery_section: true,
    show_photo_gallery: false,
    service_coverage_terms: defaultServiceCoverageTerms,
    advance_received: 0,
    advance_received_date: '',
    balance_payment_note: defaultBalancePaymentNote,
  }
}

export function createDefaultProposalData(): WeddingPackageProposalData {
  const tiers = defaultWeddingTiers.map((t) => ({ ...t }))
  const reception = { ...defaultReceptionPackage }
  return {
    proposal_type: 'wedding',
    document_type: 'proposal',
    proposal_number: '',
    client: {
      name: '',
      phone: '',
      bride_name: '',
      groom_name: '',
      email: '',
      address: '',
    },
    greeting_name: '',
    wedding_date: '',
    coverage_dates: '',
    events_covered: [],
    overview_text: defaultOverviewText(''),
    details_letter: defaultDetailsLetter('', []),
    collection_title: 'Wedding Photography Collections',
    tiers,
    reception,
    show_pricing_difference: false,
    pricing_difference_text: buildPricingDifferenceText(tiers),
    booking_text: defaultBookingText,
    delivery_text: '',
    contact_persons: [...defaultContactPersons],
    status: 'draft',
  }
}
