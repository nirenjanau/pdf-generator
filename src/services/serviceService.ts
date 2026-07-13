import { supabase, isSupabaseConfigured } from '@/supabase/client'
import type { Service } from '@/types'
import { mockServices } from './mockData'

let localServices = [...mockServices]

export const serviceLibrary = {
  async getAll(): Promise<Service[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name')
      if (error) throw error
      return data ?? []
    }
    return [...localServices]
  },

  async getById(id: string): Promise<Service | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    }
    return localServices.find((s) => s.id === id) ?? null
  },

  async create(service: Omit<Service, 'id'>): Promise<Service> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single()
      if (error) throw error
      return data
    }
    const newService: Service = { ...service, id: crypto.randomUUID() }
    localServices = [...localServices, newService]
    return newService
  },

  async update(id: string, updates: Partial<Service>): Promise<Service> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    }
    localServices = localServices.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    )
    const updated = localServices.find((s) => s.id === id)
    if (!updated) throw new Error('Service not found')
    return updated
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      return
    }
    localServices = localServices.filter((s) => s.id !== id)
  },
}
