import { useState, useEffect, useCallback } from 'react'
import type { Contract } from '@/types'
import { contractService } from '@/services/contractService'

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await contractService.getAll()
      setContracts(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load contracts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const search = useCallback(async (query: string) => {
    const results = await contractService.search(query)
    setContracts(results)
  }, [])

  return { contracts, loading, error, refetch: fetchContracts, search }
}

export function useRecentContracts(limit = 5) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contractService.getRecent(limit).then(setContracts).finally(() => setLoading(false))
  }, [limit])

  return { contracts, loading }
}

export function useDraftContracts() {
  const [drafts, setDrafts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contractService.getDrafts().then(setDrafts).finally(() => setLoading(false))
  }, [])

  return { drafts, loading }
}
