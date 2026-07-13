import { supabase, isSupabaseConfigured } from '@/supabase/client'
import type { Contract, ContractWizardData } from '@/types'
import { calculatePricing } from '@/utils/calculations'
import { mockContracts } from './mockData'

let localContracts = [...mockContracts]

function wizardToContract(data: ContractWizardData, id?: string): Contract {
  const pricing = calculatePricing(data.services, data.pricing)
  const now = new Date().toISOString()

  return {
    id: id ?? crypto.randomUUID(),
    client_id: data.client_id ?? '',
    package_id: data.package_id,
    event_date: data.event.event_date,
    reception_date: data.event.reception_date || undefined,
    venue: data.event.venue,
    event_time: data.event.event_time || undefined,
    subtotal: pricing.subtotal,
    discount: data.pricing.discount,
    discount_type: data.pricing.discount_type,
    gst_enabled: data.pricing.gst_enabled,
    gst_percent: data.pricing.gst_percent,
    advance: pricing.advance,
    balance: pricing.balance,
    notes: data.event.notes || undefined,
    status: 'draft',
    contract_number: data.contract_number,
    created_at: now,
    updated_at: now,
    services: data.services,
    sections: data.sections,
    album_details: data.album_details || undefined,
    terms: data.terms || undefined,
    deliverables: data.deliverables || undefined,
    payment_schedule: data.payment_schedule,
    client: {
      id: data.client_id ?? '',
      name: data.client.name,
      phone: data.client.phone,
      email: data.client.email || undefined,
      address: data.client.address || undefined,
      bride_name: data.client.bride_name || undefined,
      groom_name: data.client.groom_name || undefined,
      created_at: now,
    },
  }
}

export const contractService = {
  async getAll(): Promise<Contract[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, client:clients(*), package:packages(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    }
    return [...localContracts]
  },

  async getRecent(limit = 5): Promise<Contract[]> {
    const all = await this.getAll()
    return all.slice(0, limit)
  },

  async getDrafts(): Promise<Contract[]> {
    const all = await this.getAll()
    return all.filter((c) => c.status === 'draft')
  },

  async search(query: string): Promise<Contract[]> {
    const q = query.toLowerCase().trim()
    const all = await this.getAll()
    if (!q) return all

    return all.filter(
      (c) =>
        c.client?.name.toLowerCase().includes(q) ||
        c.client?.phone.includes(q) ||
        c.venue.toLowerCase().includes(q) ||
        c.package?.name.toLowerCase().includes(q) ||
        c.event_date.includes(q) ||
        c.contract_number?.toLowerCase().includes(q)
    )
  },

  async getById(id: string): Promise<Contract | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, client:clients(*), package:packages(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    }
    return localContracts.find((c) => c.id === id) ?? null
  },

  async saveDraft(data: ContractWizardData, id?: string): Promise<Contract> {
    const contract = wizardToContract(data, id)
    contract.status = 'draft'

    if (isSupabaseConfigured) {
      const { data: saved, error } = await supabase
        .from('contracts')
        .upsert({
          id: contract.id,
          client_id: contract.client_id,
          package_id: contract.package_id,
          event_date: contract.event_date,
          reception_date: contract.reception_date,
          venue: contract.venue,
          event_time: contract.event_time,
          subtotal: contract.subtotal,
          discount: contract.discount,
          advance: contract.advance,
          balance: contract.balance,
          notes: contract.notes,
          status: 'draft',
          contract_number: contract.contract_number,
        })
        .select()
        .single()
      if (error) throw error
      return { ...contract, ...saved }
    }

    if (id) {
      localContracts = localContracts.map((c) =>
        c.id === id ? contract : c
      )
    } else {
      localContracts = [contract, ...localContracts]
    }
    return contract
  },

  async finalize(data: ContractWizardData, id?: string): Promise<Contract> {
    const contract = wizardToContract(data, id)
    contract.status = 'sent'

    if (isSupabaseConfigured) {
      const { data: saved, error } = await supabase
        .from('contracts')
        .upsert({
          id: contract.id,
          client_id: contract.client_id,
          package_id: contract.package_id,
          event_date: contract.event_date,
          venue: contract.venue,
          subtotal: contract.subtotal,
          discount: contract.discount,
          advance: contract.advance,
          balance: contract.balance,
          status: 'sent',
          contract_number: contract.contract_number,
        })
        .select()
        .single()
      if (error) throw error
      return { ...contract, ...saved }
    }

    if (id) {
      localContracts = localContracts.map((c) =>
        c.id === id ? contract : c
      )
    } else {
      localContracts = [contract, ...localContracts]
    }
    return contract
  },

  async duplicate(id: string): Promise<Contract> {
    const original = await this.getById(id)
    if (!original) throw new Error('Contract not found')

    const duplicate: Contract = {
      ...original,
      id: crypto.randomUUID(),
      contract_number: '',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client: undefined,
      client_id: '',
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          client_id: duplicate.client_id,
          package_id: duplicate.package_id,
          event_date: duplicate.event_date,
          venue: duplicate.venue,
          subtotal: duplicate.subtotal,
          discount: duplicate.discount,
          advance: duplicate.advance,
          balance: duplicate.balance,
          status: 'draft',
        })
        .select()
        .single()
      if (error) throw error
      return { ...duplicate, ...data }
    }

    localContracts = [duplicate, ...localContracts]
    return duplicate
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('contracts').delete().eq('id', id)
      if (error) throw error
      return
    }
    localContracts = localContracts.filter((c) => c.id !== id)
  },
}

export function contractToWizardData(contract: Contract): ContractWizardData {
  return {
    client_id: contract.client_id,
    client: {
      name: contract.client?.name ?? '',
      phone: contract.client?.phone ?? '',
      bride_name: contract.client?.bride_name ?? '',
      groom_name: contract.client?.groom_name ?? '',
      email: contract.client?.email ?? '',
      address: contract.client?.address ?? '',
    },
    event: {
      event_date: contract.event_date,
      reception_date: contract.reception_date ?? '',
      venue: contract.venue,
      event_time: contract.event_time ?? '',
      notes: contract.notes ?? '',
    },
    package_id: contract.package_id,
    package_name: contract.package?.name,
    services: contract.services ?? [],
    pricing: {
      discount: contract.discount,
      discount_type: contract.discount_type,
      gst_enabled: contract.gst_enabled,
      gst_percent: contract.gst_percent,
      advance: contract.advance,
    },
    sections: contract.sections,
    album_details: contract.album_details ?? '',
    terms: contract.terms ?? '',
    deliverables: contract.deliverables ?? '',
    payment_schedule: contract.payment_schedule ?? [],
    contract_number: contract.contract_number ?? '',
  }
}
