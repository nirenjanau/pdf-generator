import type { WeddingPackageProposalData } from '@/types'

export interface WeddingContractRecord extends WeddingPackageProposalData {
  id: string
  created_at: string
  updated_at: string
}

let localContracts: WeddingContractRecord[] = []

export const weddingContractService = {
  async getAll(): Promise<WeddingContractRecord[]> {
    return [...localContracts].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  },

  async getRecent(limit = 5): Promise<WeddingContractRecord[]> {
    const all = await this.getAll()
    return all.slice(0, limit)
  },

  async getDrafts(): Promise<WeddingContractRecord[]> {
    const all = await this.getAll()
    return all.filter((c) => c.status === 'draft')
  },

  async getById(id: string): Promise<WeddingContractRecord | null> {
    return localContracts.find((c) => c.id === id) ?? null
  },

  async search(query: string): Promise<WeddingContractRecord[]> {
    const q = query.toLowerCase().trim()
    const all = await this.getAll()
    if (!q) return all
    return all.filter(
      (c) =>
        c.client.name.toLowerCase().includes(q) ||
        c.client.phone.includes(q) ||
        c.greeting_name.toLowerCase().includes(q) ||
        c.proposal_number.toLowerCase().includes(q)
    )
  },

  async saveDraft(data: WeddingPackageProposalData, id?: string): Promise<WeddingContractRecord> {
    const now = new Date().toISOString()
    const record: WeddingContractRecord = {
      ...data,
      document_type: 'contract',
      id: id ?? crypto.randomUUID(),
      status: 'draft',
      created_at: id ? (localContracts.find((c) => c.id === id)?.created_at ?? now) : now,
      updated_at: now,
    }

    if (id) {
      localContracts = localContracts.map((c) => (c.id === id ? record : c))
    } else {
      localContracts = [record, ...localContracts]
    }
    return record
  },

  async finalize(data: WeddingPackageProposalData, id?: string): Promise<WeddingContractRecord> {
    const record = await this.saveDraft({ ...data, status: 'sent' }, id)
    localContracts = localContracts.map((c) =>
      c.id === record.id ? { ...record, status: 'sent' } : c
    )
    return { ...record, status: 'sent' }
  },

  async delete(id: string): Promise<void> {
    localContracts = localContracts.filter((c) => c.id !== id)
  },
}

export function contractToWizardData(
  contract: WeddingContractRecord
): WeddingPackageProposalData {
  const { id: _id, created_at: _c, updated_at: _u, ...data } = contract
  return {
    ...data,
    document_type: 'contract',
    show_delivery_section: data.show_delivery_section ?? true,
    show_photo_gallery: data.show_photo_gallery ?? false,
    contract_delivery_items: data.contract_delivery_items ?? [],
    advance_received: data.advance_received ?? 0,
    advance_received_date: data.advance_received_date ?? '',
  }
}
