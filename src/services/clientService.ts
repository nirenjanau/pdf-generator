import { supabase, isSupabaseConfigured } from '@/supabase/client'
import type { Client } from '@/types'
import { mockClients } from './mockData'

let localClients = [...mockClients]

export const clientService = {
  async getAll(): Promise<Client[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    }
    return [...localClients]
  },

  async search(query: string): Promise<Client[]> {
    const q = query.toLowerCase().trim()
    if (!q) return this.getAll()

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${q}%,phone.ilike.%${q}%,bride_name.ilike.%${q}%,groom_name.ilike.%${q}%`)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    }

    return localClients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.bride_name?.toLowerCase().includes(q) ||
        c.groom_name?.toLowerCase().includes(q)
    )
  },

  async getById(id: string): Promise<Client | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    }
    return localClients.find((c) => c.id === id) ?? null
  },

  async create(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()
      if (error) throw error
      return data
    }
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    localClients = [newClient, ...localClients]
    return newClient
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    }
    localClients = localClients.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
    const updated = localClients.find((c) => c.id === id)
    if (!updated) throw new Error('Client not found')
    return updated
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      return
    }
    localClients = localClients.filter((c) => c.id !== id)
  },
}
