import type { PackageTier, WeddingPackageProposalData } from '@/types'
import { defaultContactPersons, buildPricingDifferenceText } from './weddingPackageTemplates'
import {
  defaultDanceBalancePaymentNote,
  defaultDanceContractDetailsLetter,
  defaultDanceContractOverview,
} from './danceContractTemplates'

export const defaultDanceTiers: PackageTier[] = [
  {
    id: 'classic',
    name: 'Classic Package',
    subtitle: 'Premium Performance Coverage',
    price: 22000,
    includes: [
      'Makeup Session Coverage',
      'Pre-Performance Photo Shoot',
      'Stage Performance Coverage',
    ],
    coverageTeam: ['Photographer', 'Two Videographers (Two-Camera Setup)'],
    album: [],
    videoPhotography: [],
    deliverables: [
      'Google Drive Access to All Final Files',
      'Professionally Edited Photos',
      'Highlight Video',
      'Full Performance Video',
    ],
    enabled: true,
  },
  {
    id: 'premium',
    name: 'Premium Package',
    subtitle: 'Complete Programme Coverage',
    price: 32000,
    includes: [
      'Makeup Session Coverage',
      'Pre-Performance Photo Shoot',
      'Stage Performance Coverage',
      'Backstage & Candid Moments',
    ],
    coverageTeam: [
      'Photographer',
      'Candid Photographer',
      'Two Videographers (Two-Camera Setup)',
      'Assistant Photographer',
    ],
    album: [],
    videoPhotography: [],
    deliverables: [
      'Google Drive Access to All Final Files',
      'Professionally Edited Photos',
      'Highlight Video',
      'Full Performance Video',
      'Stage Reel 1',
      'Stage Reel 2',
    ],
    enabled: false,
  },
]

export const defaultDanceOverview = (organizationName: string) => {
  const name = organizationName.trim() || '[Organization Name]'
  return `This document presents a photography and videography package specially customized for ${name} by Bhavana Studio.

The package is designed to provide complete coverage of your dance programme, including makeup session coverage, pre-performance photography, stage performance coverage, and professionally edited video deliverables.

This document provides a clear understanding of the event coverage, deliverables, package options, and additional services available for your programme.`
}

export const defaultDanceDetailsLetter = (greetingName: string, programmeDate: string) => {
  const name = greetingName.trim() || '[Name]'
  const dateLine = programmeDate
    ? `For your programme on ${programmeDate}, we have specially customized the following package options based on your requirements.`
    : 'We have specially customized the following package options based on your requirements.'

  return `Dear ${name},

We are delighted to connect with you regarding your upcoming dance programme.

At Bhavana Studio, we focus on capturing expressions, stage presence, emotions, and every important moment in a creative and timeless style. Our team ensures that the memories of the performance are beautifully preserved through professional photography and videography.

${dateLine}

Should you wish to customize any aspect of the package, we would be happy to discuss suitable options with you.`
}

export const defaultDanceBookingText =
  `To reserve your event date, an advance payment is required.

Once the advance payment is received, we will confirm the booking and reserve the date exclusively for your programme.`

export const defaultDanceDeliveryText = ''

export function createDefaultDanceContractData(): WeddingPackageProposalData {
  const base = createDefaultDanceProposalData()
  const confirmedTier = base.tiers.find((t) => t.id === 'classic') ?? base.tiers[0]
  const clientName = base.organization_name || base.greeting_name || base.client.name
  const programmeDate = base.wedding_date ? '' : ''

  return {
    ...base,
    document_type: 'contract',
    collection_title: 'Package Details',
    confirmed_tier_id: confirmedTier?.id,
    tiers: base.tiers.map((t) => ({ ...t, enabled: t.id === confirmedTier?.id })),
    show_pricing_difference: false,
    booking_text: '',
    delivery_text: '',
    contract_overview_text: defaultDanceContractOverview(
      clientName,
      programmeDate,
      confirmedTier?.includes ?? []
    ),
    contract_details_letter: defaultDanceContractDetailsLetter(
      base.greeting_name,
      base.organization_name ?? '',
      programmeDate
    ),
    contract_delivery_items: [
      'Photos will be selected and edited by Bhavana Studio',
      'Final images will be shared via a Google Drive link for easy access and download',
    ],
    show_delivery_section: true,
    show_photo_gallery: false,
    service_coverage_terms: '',
    advance_received: 0,
    advance_received_date: '',
    balance_payment_note: defaultDanceBalancePaymentNote,
  }
}

export function createDefaultDanceProposalData(): WeddingPackageProposalData {
  const tiers = defaultDanceTiers.map((t) => ({ ...t }))
  return {
    proposal_type: 'dance',
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
    organization_name: '',
    wedding_date: '',
    coverage_dates: '',
    events_covered: [],
    overview_text: defaultDanceOverview(''),
    details_letter: defaultDanceDetailsLetter('', ''),
    collection_title: 'Our Packages',
    tiers,
    reception: {
      enabled: false,
      name: '',
      subtitle: '',
      price: 0,
      includes: [],
      coverageTeam: [],
      videoPhotography: [],
      album: [],
      deliverables: [],
      packageInclusions: [],
      additionalInfo: '',
    },
    pricing_difference_text: buildPricingDifferenceText(tiers),
    show_pricing_difference: false,
    booking_text: defaultDanceBookingText,
    delivery_text: '',
    contact_persons: [...defaultContactPersons],
    status: 'draft',
  }
}

export function buildDanceProposalContent(
  organizationName: string,
  greetingName: string,
  programmeDateFormatted: string
): Pick<WeddingPackageProposalData, 'overview_text' | 'details_letter'> {
  return {
    overview_text: defaultDanceOverview(organizationName),
    details_letter: defaultDanceDetailsLetter(greetingName, programmeDateFormatted),
  }
}
