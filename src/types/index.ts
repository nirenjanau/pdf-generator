export type ContractStatus = 'draft' | 'sent' | 'signed' | 'cancelled'

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  bride_name?: string
  groom_name?: string
  created_at: string
}

export interface Service {
  id: string
  name: string
  default_price: number
  description: string
  category: string
}

export interface Package {
  id: string
  name: string
  price: number
  description: string
  service_ids: string[]
  terms?: string
  deliverables?: string
}

export interface ContractService {
  id: string
  service_id: string
  name: string
  price: number
  quantity: number
  description: string
  enabled: boolean
}

export interface Contract {
  id: string
  client_id: string
  package_id?: string
  event_date: string
  reception_date?: string
  venue: string
  event_time?: string
  subtotal: number
  discount: number
  discount_type: 'amount' | 'percent'
  gst_enabled: boolean
  gst_percent: number
  advance: number
  balance: number
  notes?: string
  status: ContractStatus
  created_at: string
  updated_at: string
  // Joined / embedded data
  client?: Client
  package?: Package
  services?: ContractService[]
  // Optional sections
  sections: DocumentSections
  album_details?: string
  terms?: string
  deliverables?: string
  payment_schedule?: PaymentScheduleItem[]
  contract_number?: string
}

export interface PaymentScheduleItem {
  id: string
  label: string
  amount: number
  due_date?: string
}

export interface DocumentSections {
  albumDetails: boolean
  terms: boolean
  deliverables: boolean
  paymentSchedule: boolean
  notes: boolean
}

export type TableColumnKey = 'service' | 'description' | 'quantity' | 'price' | 'amount'

export interface TableColumn {
  key: TableColumnKey
  label: string
  visible: boolean
}

export interface DocumentConfig {
  tableColumns: TableColumn[]
  companyName: string
  companyTagline: string
  companyPhone: string
  companyEmail: string
  companyAddress: string
  companyLogoUrl: string
}

export interface ClientFormData {
  name: string
  phone: string
  bride_name: string
  groom_name: string
  email: string
  address: string
}

export interface EventFormData {
  event_date: string
  reception_date: string
  venue: string
  event_time: string
  notes: string
}

export interface PricingFormData {
  discount: number
  discount_type: 'amount' | 'percent'
  gst_enabled: boolean
  gst_percent: number
  advance: number
}

export interface ContractWizardData {
  client: ClientFormData
  client_id?: string
  event: EventFormData
  package_id?: string
  package_name?: string
  services: ContractService[]
  pricing: PricingFormData
  sections: DocumentSections
  album_details: string
  terms: string
  deliverables: string
  payment_schedule: PaymentScheduleItem[]
  contract_number: string
}

export interface TermsTemplate {
  id: string
  title: string
  content: string
}

export interface PaymentTermsTemplate {
  id: string
  title: string
  content: string
}

export interface NotesTemplate {
  id: string
  title: string
  content: string
}

export interface AppSettings {
  documentConfig: DocumentConfig
  defaultTerms: string
  defaultDeliverables: string
  defaultGstPercent: number
}

export const WIZARD_STEPS = [
  { id: 1, label: 'Client', path: 'client' },
  { id: 2, label: 'Event', path: 'event' },
  { id: 3, label: 'Package', path: 'package' },
  { id: 4, label: 'Services', path: 'services' },
  { id: 5, label: 'Pricing', path: 'pricing' },
  { id: 6, label: 'Sections', path: 'sections' },
  { id: 7, label: 'Preview', path: 'preview' },
  { id: 8, label: 'Generate', path: 'generate' },
] as const

export type WizardStepPath = (typeof WIZARD_STEPS)[number]['path']

// --- Package Proposal (Wedding & Dance) ---

export type ProposalType = 'wedding' | 'dance'
export type ProposalStatus = 'draft' | 'sent' | 'confirmed'

export interface PackageTier {
  id: string
  name: string
  subtitle: string
  price: number
  includes: string[]
  coverageTeam: string[]
  album: string[]
  videoPhotography: string[]
  deliverables: string[]
  enabled: boolean
}

export interface ReceptionPackageData {
  enabled: boolean
  name: string
  subtitle: string
  price: number
  includes: string[]
  coverageTeam: string[]
  videoPhotography: string[]
  album: string[]
  deliverables: string[]
  packageInclusions: string[]
  additionalInfo: string
}

export interface ContactPerson {
  name: string
  phone: string
}

export interface WeddingPackageProposalData {
  proposal_type: ProposalType
  document_type: 'proposal' | 'contract'
  proposal_number: string
  client: ClientFormData
  client_id?: string
  greeting_name: string
  organization_name?: string
  wedding_date: string
  reception_date?: string
  coverage_dates: string
  events_covered: string[]
  overview_text: string
  details_letter: string
  collection_title: string
  tiers: PackageTier[]
  reception: ReceptionPackageData
  show_pricing_difference: boolean
  pricing_difference_text: string
  booking_text: string
  delivery_text: string
  contact_persons: ContactPerson[]
  status: ProposalStatus
  confirmed_tier_id?: string
  /** Contract-only fields */
  contract_overview_text?: string
  contract_details_letter?: string
  contract_delivery_items?: string[]
  show_delivery_section?: boolean
  show_photo_gallery?: boolean
  service_coverage_terms?: string
  advance_received?: number
  advance_received_date?: string
  balance_payment_note?: string
}

/** @alias WeddingPackageProposalData */
export type PackageProposalData = WeddingPackageProposalData

export const PROPOSAL_WIZARD_STEPS = [
  { id: 1, label: 'Client', path: 'client' },
  { id: 2, label: 'Event', path: 'event' },
  { id: 3, label: 'Packages', path: 'packages' },
  { id: 4, label: 'Content', path: 'content' },
  { id: 5, label: 'Preview', path: 'preview' },
  { id: 6, label: 'Generate', path: 'generate' },
] as const

export type ProposalWizardStepPath = (typeof PROPOSAL_WIZARD_STEPS)[number]['path']
