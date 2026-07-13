import type { WeddingPackageProposalData } from '@/types'
import { createDefaultProposalData } from './weddingPackageTemplates'

export interface ProposalRecord extends WeddingPackageProposalData {
  id: string
  created_at: string
  updated_at: string
}

let localProposals: ProposalRecord[] = []

export const proposalService = {
  async getAll(): Promise<ProposalRecord[]> {
    return [...localProposals].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  },

  async getRecent(limit = 5): Promise<ProposalRecord[]> {
    const all = await this.getAll()
    return all.slice(0, limit)
  },

  async getDrafts(): Promise<ProposalRecord[]> {
    const all = await this.getAll()
    return all.filter((p) => p.status === 'draft')
  },

  async getById(id: string): Promise<ProposalRecord | null> {
    return localProposals.find((p) => p.id === id) ?? null
  },

  async search(query: string): Promise<ProposalRecord[]> {
    const q = query.toLowerCase().trim()
    const all = await this.getAll()
    if (!q) return all
    return all.filter(
      (p) =>
        p.client.name.toLowerCase().includes(q) ||
        p.client.phone.includes(q) ||
        (p.organization_name?.toLowerCase().includes(q) ?? false) ||
        p.greeting_name.toLowerCase().includes(q) ||
        p.proposal_number.toLowerCase().includes(q)
    )
  },

  async saveDraft(data: WeddingPackageProposalData, id?: string): Promise<ProposalRecord> {
    const now = new Date().toISOString()
    const record: ProposalRecord = {
      ...data,
      id: id ?? crypto.randomUUID(),
      status: 'draft',
      created_at: id ? (localProposals.find((p) => p.id === id)?.created_at ?? now) : now,
      updated_at: now,
    }

    if (id) {
      localProposals = localProposals.map((p) => (p.id === id ? record : p))
    } else {
      localProposals = [record, ...localProposals]
    }
    return record
  },

  async finalize(data: WeddingPackageProposalData, id?: string): Promise<ProposalRecord> {
    const record = await this.saveDraft({ ...data, status: 'sent' }, id)
    localProposals = localProposals.map((p) =>
      p.id === record.id ? { ...record, status: 'sent' } : p
    )
    return { ...record, status: 'sent' }
  },

  async delete(id: string): Promise<void> {
    localProposals = localProposals.filter((p) => p.id !== id)
  },
}

export function proposalToWizardData(proposal: ProposalRecord): WeddingPackageProposalData {
  const { id: _id, created_at: _c, updated_at: _u, ...data } = proposal
  return {
    ...data,
    proposal_type: data.proposal_type ?? 'wedding',
    document_type: data.document_type ?? 'proposal',
    show_pricing_difference: data.show_pricing_difference ?? false,
  }
}

export function createSampleProposal(): ProposalRecord {
  const data = createDefaultProposalData()
  return {
    ...data,
    id: 'sample',
    proposal_number: 'WP-2607-0001',
    client: {
      name: 'Ashwin',
      phone: '9876543210',
      bride_name: '',
      groom_name: 'Ashwin',
      email: '',
      address: '',
    },
    client_id: undefined,
    greeting_name: 'Ashwin',
    wedding_date: '2026-09-05',
    coverage_dates: '4th & 5th September 2026',
    events_covered: ['Save The Date Shoot', 'Reception', 'Wedding Ceremony'],
    overview_text: `This document presents customized photography and videography packages specially prepared for Ashwin by Bhavana Studio.\nThe proposal includes coverage options for the following wedding events:\n\nOur packages are designed to provide complete coverage of every celebration with a perfect blend of photography, videography, candid storytelling, and timeless memories.\n\nThis document provides a clear understanding of the event coverage, deliverables, album details, and investment associated with each package.`,
    details_letter: `Dear Ashwin,\n\nThank you for considering Bhavana Studio for your wedding photography and videography requirements.\n\nAt Bhavana Studio, we believe every wedding tells a unique story. Our team is dedicated to capturing genuine emotions, timeless moments, and every important detail through a perfect blend of traditional photography, candid photography, and candid videography.\n\nFor your upcoming wedding celebrations, including the Save The Date Shoot, Reception, and Wedding Ceremony, we have carefully customized the following packages based on your requirements.\n\nWe look forward to being a part of your special journey and preserving memories that you and your family will cherish for a lifetime.`,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
