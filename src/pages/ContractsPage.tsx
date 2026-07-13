import { Link, useNavigate } from 'react-router-dom'
import { Plus, Copy, Trash2, FileText } from 'lucide-react'
import { useState } from 'react'
import { PageHeader, EmptyState, Button } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Chip'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatDate } from '@/utils/format'
import { contractService } from '@/services/contractService'

export function ContractsPage() {
  const { contracts, loading, refetch, search } = useContracts()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (q: string) => {
    setQuery(q)
    search(q)
  }

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dup = await contractService.duplicate(id)
    navigate(`/contracts/${dup.id}/edit`)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this contract?')) {
      await contractService.delete(id)
      refetch()
    }
  }

  return (
    <>
      <PageHeader
        title="Contracts"
        action={
          <Link to="/contracts/new">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" /> New
            </Button>
          </Link>
        }
      />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <SearchInput
          value={query}
          onChange={handleSearch}
          placeholder="Search by client, phone, date..."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
          </div>
        ) : contracts.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No contracts"
            description="Create your first wedding quotation"
            action={
              <Link to="/contracts/new">
                <Button variant="primary">Create Contract</Button>
              </Link>
            }
          />
        ) : (
          contracts.map((contract) => (
            <Link key={contract.id} to={`/contracts/${contract.id}`}>
              <Card padding="sm" className="mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{contract.client?.name}</p>
                      <StatusBadge status={contract.status} />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {formatDate(contract.event_date)} · {contract.venue}
                    </p>
                    {contract.package?.name && (
                      <p className="text-xs text-text-muted">{contract.package.name} Package</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-semibold">{formatCurrency(contract.subtotal)}</p>
                    <div className="flex gap-1 mt-2 justify-end">
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(contract.id, e)}
                        className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-muted"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(contract.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-danger"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
