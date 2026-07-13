import type {
  Client,
  Service,
  Package,
  Contract,
  ContractService,
  TermsTemplate,
  PaymentTermsTemplate,
  NotesTemplate,
  AppSettings,
  PaymentScheduleItem,
} from '@/types'

export const COMPANY_LOGO_URL = '/Bhavana Name Adress copy00.png'

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Priya & Arjun',
    phone: '9876543210',
    email: 'priya.arjun@gmail.com',
    bride_name: 'Priya Sharma',
    groom_name: 'Arjun Mehta',
    address: '12 MG Road, Bangalore',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Ananya & Rohan',
    phone: '9123456789',
    email: 'ananya.r@gmail.com',
    bride_name: 'Ananya Reddy',
    groom_name: 'Rohan Kumar',
    address: '45 Jubilee Hills, Hyderabad',
    created_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'c3',
    name: 'Meera & Vikram',
    phone: '9988776655',
    bride_name: 'Meera Nair',
    groom_name: 'Vikram Pillai',
    created_at: '2026-01-10T10:00:00Z',
  },
]

export const mockServices: Service[] = [
  { id: 's1', name: 'Photography', default_price: 35000, description: 'Full day wedding photography with 2 photographers', category: 'Core' },
  { id: 's2', name: 'Videography', default_price: 45000, description: 'Wedding video coverage with 2 videographers', category: 'Core' },
  { id: 's3', name: 'Drone', default_price: 15000, description: 'Aerial coverage of ceremony and reception', category: 'Add-on' },
  { id: 's4', name: 'Album', default_price: 12000, description: 'Premium 40-page wedding album', category: 'Deliverable' },
  { id: 's5', name: 'LED Wall', default_price: 25000, description: 'LED wall setup for live display', category: 'Add-on' },
  { id: 's6', name: 'Live Streaming', default_price: 18000, description: 'HD live stream for remote guests', category: 'Add-on' },
  { id: 's7', name: 'Highlight Reel', default_price: 8000, description: '3-5 minute highlight video', category: 'Deliverable' },
  { id: 's8', name: 'Pre Wedding', default_price: 20000, description: 'Pre-wedding shoot (half day)', category: 'Core' },
  { id: 's9', name: 'Post Wedding', default_price: 10000, description: 'Post-wedding portrait session', category: 'Core' },
]

export const mockPackages: Package[] = [
  {
    id: 'p1',
    name: 'Silver',
    price: 45000,
    description: 'Essential wedding coverage',
    service_ids: ['s1', 's7'],
    terms: '50% advance required. Balance due on delivery.',
    deliverables: '500+ edited photos, 1 highlight reel (3 min)',
  },
  {
    id: 'p2',
    name: 'Gold',
    price: 75000,
    description: 'Complete photo & video package',
    service_ids: ['s1', 's2', 's3', 's4', 's7'],
    terms: '50% advance required. Balance due on delivery.',
    deliverables: '800+ edited photos, full video coverage, highlight reel, premium album',
  },
  {
    id: 'p3',
    name: 'Premium',
    price: 125000,
    description: 'All-inclusive luxury package',
    service_ids: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
    terms: '40% advance required. 30% before event. Balance on delivery.',
    deliverables: 'Full coverage, live stream, LED wall, pre-wedding shoot, premium album, full video coverage',
  },
  {
    id: 'p4',
    name: 'Custom',
    price: 0,
    description: 'Build your own package',
    service_ids: [],
    terms: '',
    deliverables: '',
  },
]

export function serviceToContractService(service: Service): ContractService {
  return {
    id: crypto.randomUUID(),
    service_id: service.id,
    name: service.name,
    price: service.default_price,
    quantity: 1,
    description: service.description,
    enabled: true,
  }
}

export const mockContracts: Contract[] = [
  {
    id: 'ct1',
    client_id: 'c1',
    package_id: 'p2',
    event_date: '2026-12-15',
    reception_date: '2026-12-16',
    venue: 'Taj West End, Bangalore',
    event_time: '10:00 AM',
    subtotal: 75000,
    discount: 5000,
    discount_type: 'amount',
    gst_enabled: true,
    gst_percent: 18,
    advance: 40000,
    balance: 44500,
    status: 'sent',
    contract_number: 'BS-2512-3847',
    created_at: '2026-03-15T10:00:00Z',
    updated_at: '2026-03-15T10:00:00Z',
    client: mockClients[0],
    package: mockPackages[1],
    services: mockPackages[1].service_ids.map((sid) => {
      const svc = mockServices.find((s) => s.id === sid)!
      return serviceToContractService(svc)
    }),
    sections: {
      albumDetails: true,
      terms: true,
      deliverables: true,
      paymentSchedule: true,
      notes: false,
    },
    terms: mockPackages[1].terms,
    deliverables: mockPackages[1].deliverables,
    payment_schedule: [
      { id: 'ps1', label: 'Advance (50%)', amount: 40000, due_date: '2026-03-20' },
      { id: 'ps2', label: 'Before Event', amount: 20000, due_date: '2026-12-01' },
      { id: 'ps3', label: 'On Delivery', amount: 24500, due_date: '2027-01-15' },
    ],
  },
  {
    id: 'ct2',
    client_id: 'c2',
    package_id: 'p1',
    event_date: '2026-11-20',
    venue: 'Novotel, Hyderabad',
    event_time: '6:00 PM',
    subtotal: 45000,
    discount: 0,
    discount_type: 'amount',
    gst_enabled: false,
    gst_percent: 18,
    advance: 22500,
    balance: 22500,
    status: 'draft',
    contract_number: 'BS-2511-1203',
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
    client: mockClients[1],
    package: mockPackages[0],
    services: mockPackages[0].service_ids.map((sid) => {
      const svc = mockServices.find((s) => s.id === sid)!
      return serviceToContractService(svc)
    }),
    sections: {
      albumDetails: false,
      terms: true,
      deliverables: true,
      paymentSchedule: false,
      notes: true,
    },
    notes: 'Client prefers candid shots over posed portraits.',
    terms: mockPackages[0].terms,
    deliverables: mockPackages[0].deliverables,
    payment_schedule: [],
  },
]

export const mockTermsTemplates: TermsTemplate[] = [
  {
    id: 't1',
    title: 'Standard Terms',
    content: '1. 50% advance is non-refundable.\n2. Remaining balance due on delivery.\n3. Raw files not included unless specified.\n4. Delivery within 30-45 days of event.',
  },
  {
    id: 't2',
    title: 'Premium Terms',
    content: '1. 40% advance, 30% before event, balance on delivery.\n2. Rescheduling allowed once with 30 days notice.\n3. Priority editing within 21 days.\n4. One round of revisions included.',
  },
]

export const mockPaymentTermsTemplates: PaymentTermsTemplate[] = [
  {
    id: 'pt1',
    title: '50/50 Split',
    content: '50% advance on booking confirmation.\n50% balance due on final delivery.',
  },
  {
    id: 'pt2',
    title: 'Three-Part Payment',
    content: '40% advance on booking.\n30% one week before event.\n30% on delivery.',
  },
]

export const mockNotesTemplates: NotesTemplate[] = [
  {
    id: 'n1',
    title: 'Standard Note',
    content: 'Thank you for choosing Bhavana Studio. We look forward to capturing your special day.',
  },
]

export const defaultAppSettings: AppSettings = {
  documentConfig: {
    tableColumns: [
      { key: 'service', label: 'Service', visible: true },
      { key: 'description', label: 'Description', visible: true },
      { key: 'quantity', label: 'Qty', visible: true },
      { key: 'price', label: 'Price', visible: true },
      { key: 'amount', label: 'Amount', visible: true },
    ],
    companyName: 'Bhavana Studio',
    companyTagline: 'Sreedevi Arcade, Kairali Junction, Mammyoor, Guruvayoor',
    companyPhone: '(+91) 9387103562',
    companyEmail: '',
    companyAddress: 'Sreedevi Arcade, Kairali Junction, Mammyoor, Guruvayoor',
    companyLogoUrl: COMPANY_LOGO_URL,
  },
  defaultTerms: mockTermsTemplates[0].content,
  defaultDeliverables: 'Edited photos and highlight reel as per package.',
  defaultGstPercent: 18,
}

export const defaultWizardData = {
  client: {
    name: '',
    phone: '',
    bride_name: '',
    groom_name: '',
    email: '',
    address: '',
  },
  event: {
    event_date: '',
    reception_date: '',
    venue: '',
    event_time: '',
    notes: '',
  },
  services: [] as ContractService[],
  pricing: {
    discount: 0,
    discount_type: 'amount' as const,
    gst_enabled: false,
    gst_percent: 18,
    advance: 0,
  },
  sections: {
    albumDetails: false,
    terms: true,
    deliverables: true,
    paymentSchedule: false,
    notes: false,
  },
  album_details: '',
  terms: defaultAppSettings.defaultTerms,
  deliverables: defaultAppSettings.defaultDeliverables,
  payment_schedule: [] as PaymentScheduleItem[],
  contract_number: '',
}
