import { Link } from 'react-router-dom'
import { Plus, FileText, Gift } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Chip'
import { useRecentContracts, useDraftContracts } from '@/hooks/useContracts'
import { useRecentProposals, useDraftProposals } from '@/hooks/useProposals'
import { formatCurrency, formatDate } from '@/utils/format'
import { contractService } from '@/services/contractService'
import { proposalService } from '@/services/proposalService'
import { proposalTypeLabel } from '@/services/proposalTemplates'
import type { ProposalRecord } from '@/services/proposalService'

function ContractCard({ contract }: { contract: ReturnType<typeof useRecentContracts>['contracts'][0] }) {
  return (
    <Link to={`/contracts/${contract.id}`}>
      <Card padding="sm" className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{contract.client?.name ?? 'Unknown Client'}</p>
            <p className="text-sm text-text-secondary">{formatDate(contract.event_date)}</p>
            <p className="text-xs text-text-muted mt-0.5">{contract.venue}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={contract.status} />
            <p className="text-sm font-semibold mt-1">{formatCurrency(contract.subtotal)}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function ProposalCard({ proposal }: { proposal: ProposalRecord }) {
  const label = proposal.greeting_name || proposal.client.name
  return (
    <Link to={`/proposals/${proposal.id}/edit`}>
      <Card padding="sm" className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-text-secondary">{formatDate(proposal.wedding_date)}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {proposalTypeLabel(proposal.proposal_type ?? 'wedding')}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge status={proposal.status === 'confirmed' ? 'signed' : proposal.status} />
            <p className="text-xs text-text-muted mt-1 font-mono">{proposal.proposal_number}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function HomePage() {
  const { contracts: recent, loading: recentLoading } = useRecentContracts(5)
  const { drafts, loading: draftsLoading } = useDraftContracts()
  const { proposals: recentProposals, loading: proposalsLoading } = useRecentProposals(3)
  const { drafts: proposalDrafts } = useDraftProposals()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof recent | null>(null)
  const [proposalSearchResults, setProposalSearchResults] = useState<ProposalRecord[] | null>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const [contractResults, proposalResults] = await Promise.all([
        contractService.search(query),
        proposalService.search(query),
      ])
      setSearchResults(contractResults)
      setProposalSearchResults(proposalResults)
    } else {
      setSearchResults(null)
      setProposalSearchResults(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Bhavana Studio"
        subtitle="Photography & Videography"
      />

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto animate-slide-up">
        <Link to="/proposals/new">
          <Button variant="primary" size="lg" fullWidth>
            <Gift className="h-6 w-6" />
            New Package
          </Button>
        </Link>

        <Link to="/contracts/new">
          <Button variant="secondary" size="lg" fullWidth>
            <Plus className="h-6 w-6" />
            New Contract
          </Button>
        </Link>

        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search packages & contracts..."
        />

        {searchResults && (
          <section>
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Search Results
            </h2>
            {searchResults.length === 0 && (!proposalSearchResults || proposalSearchResults.length === 0) ? (
              <p className="text-sm text-text-muted text-center py-4">No results found</p>
            ) : (
              <>
                {proposalSearchResults?.map((p) => <ProposalCard key={p.id} proposal={p} />)}
                {searchResults.map((c) => <ContractCard key={c.id} contract={c} />)}
              </>
            )}
          </section>
        )}

        {!searchResults && (
          <>
            {(drafts.length > 0 || proposalDrafts.length > 0) && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Drafts
                  </h2>
                  <span className="text-xs bg-amber-100 text-warning px-2 py-0.5 rounded-full font-medium">
                    {drafts.length + proposalDrafts.length}
                  </span>
                </div>
                {!draftsLoading && proposalDrafts.slice(0, 2).map((p) => (
                  <ProposalCard key={p.id} proposal={p} />
                ))}
                {!draftsLoading && drafts.slice(0, 2).map((c) => (
                  <ContractCard key={c.id} contract={c} />
                ))}
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Recent Packages
                </h2>
                <Link to="/proposals" className="text-xs text-brand-900 font-medium">
                  View all
                </Link>
              </div>
              {proposalsLoading ? (
                <div className="flex justify-center py-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
                </div>
              ) : recentProposals.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No packages yet</p>
              ) : (
                recentProposals.map((p) => <ProposalCard key={p.id} proposal={p} />)
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Recent Contracts
                </h2>
                <Link to="/contracts" className="text-xs text-brand-900 font-medium">
                  View all
                </Link>
              </div>
              {recentLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
                </div>
              ) : recent.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No contracts yet</p>
                </div>
              ) : (
                recent.map((c) => <ContractCard key={c.id} contract={c} />)
              )}
            </section>
          </>
        )}
      </div>
    </>
  )
}
