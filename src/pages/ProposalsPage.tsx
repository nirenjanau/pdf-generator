import { Link } from 'react-router-dom'
import { Plus, FileText } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Chip'
import { useProposals } from '@/hooks/useProposals'
import { formatDate } from '@/utils/format'
import { proposalTypeLabel } from '@/services/proposalTemplates'

function ProposalCard({ proposal }: { proposal: ReturnType<typeof useProposals>['proposals'][0] }) {
  const label =
    proposal.proposal_type === 'dance'
      ? proposal.organization_name || proposal.client.name
      : proposal.greeting_name || proposal.client.name
  const enabledTiers = proposal.tiers.filter((t) => t.enabled).map((t) => t.name)
  const type = proposal.proposal_type ?? 'wedding'

  return (
    <Link to={`/proposals/${proposal.id}/edit`}>
      <Card padding="sm" className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-text-secondary">{formatDate(proposal.wedding_date)}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {proposalTypeLabel(type)}
              {enabledTiers.length > 0 && ` · ${enabledTiers.join(' · ')}`}
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

export function ProposalsPage() {
  const { proposals, loading } = useProposals()

  return (
    <>
      <PageHeader title="Packages" subtitle="Wedding & dance proposals" />

      <div className="px-4 py-6 space-y-4 max-w-lg mx-auto">
        <Link to="/proposals/new">
          <Button variant="primary" size="lg" fullWidth>
            <Plus className="h-6 w-6" />
            New Package
          </Button>
        </Link>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
          </div>
        ) : proposals.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No proposals yet"
            description="Create a wedding or dance package proposal to send to your clients."
            action={
              <Link to="/proposals/new">
                <Button variant="primary">Create Proposal</Button>
              </Link>
            }
          />
        ) : (
          proposals.map((p) => <ProposalCard key={p.id} proposal={p} />)
        )}
      </div>
    </>
  )
}
