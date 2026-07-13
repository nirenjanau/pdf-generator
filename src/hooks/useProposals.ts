import { useState, useEffect, useCallback } from 'react'
import type { ProposalRecord } from '@/services/proposalService'
import { proposalService } from '@/services/proposalService'

export function useProposals() {
  const [proposals, setProposals] = useState<ProposalRecord[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await proposalService.getAll()
      setProposals(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { proposals, loading, refresh }
}

export function useRecentProposals(limit = 5) {
  const [proposals, setProposals] = useState<ProposalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    proposalService.getRecent(limit).then((data) => {
      setProposals(data)
      setLoading(false)
    })
  }, [limit])

  return { proposals, loading }
}

export function useDraftProposals() {
  const [drafts, setDrafts] = useState<ProposalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    proposalService.getDrafts().then((data) => {
      setDrafts(data)
      setLoading(false)
    })
  }, [])

  return { drafts, loading }
}
