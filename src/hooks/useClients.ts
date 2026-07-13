import { useState, useEffect, useCallback } from 'react'
import type { Client } from '@/types'
import { clientService } from '@/services/clientService'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    const data = await clientService.getAll()
    setClients(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const search = useCallback(async (query: string) => {
    const results = await clientService.search(query)
    setClients(results)
  }, [])

  return { clients, loading, refetch: fetchClients, search }
}
