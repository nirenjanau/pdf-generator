import { supabase, isSupabaseConfigured } from '@/supabase/client'
import type { Package } from '@/types'
import { mockPackages } from './mockData'

let localPackages = [...mockPackages]

export const packageService = {
  async getAll(): Promise<Package[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('price')
      if (error) throw error
      return (data ?? []).map((p) => ({
        ...p,
        service_ids: p.service_ids ?? [],
      }))
    }
    return [...localPackages]
  },

  async getById(id: string): Promise<Package | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data ? { ...data, service_ids: data.service_ids ?? [] } : null
    }
    return localPackages.find((p) => p.id === id) ?? null
  },

  async create(pkg: Omit<Package, 'id'>): Promise<Package> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('packages')
        .insert(pkg)
        .select()
        .single()
      if (error) throw error
      return data
    }
    const newPackage: Package = { ...pkg, id: crypto.randomUUID() }
    localPackages = [...localPackages, newPackage]
    return newPackage
  },

  async update(id: string, updates: Partial<Package>): Promise<Package> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    }
    localPackages = localPackages.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    )
    const updated = localPackages.find((p) => p.id === id)
    if (!updated) throw new Error('Package not found')
    return updated
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('packages').delete().eq('id', id)
      if (error) throw error
      return
    }
    localPackages = localPackages.filter((p) => p.id !== id)
  },
}
