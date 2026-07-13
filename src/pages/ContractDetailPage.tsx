import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Edit, Copy, Download } from 'lucide-react'
import { PageHeader, Button } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Chip'
import { Card } from '@/components/ui/Card'
import { QuotationDocument } from '@/components/document/QuotationDocument'
import { contractService, contractToWizardData } from '@/services/contractService'
import { formatCurrency, formatDate } from '@/utils/format'
import { generatePDF } from '@/utils/pdf'
import type { Contract } from '@/types'

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!id) return
    contractService.getById(id).then((c) => {
      setContract(c)
      setLoading(false)
    })
  }, [id])

  const handleEdit = () => {
    if (!contract) return
    navigate(`/contracts/${contract.id}/edit`)
  }

  const handleDuplicate = async () => {
    if (!contract) return
    const dup = await contractService.duplicate(contract.id)
    navigate(`/contracts/${dup.id}/edit`)
  }

  const handleDownload = async () => {
    if (!contract) return
    const wizardData = contractToWizardData(contract)
    // Render temporarily for PDF
    const container = document.createElement('div')
    container.id = 'temp-export'
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    const { createRoot } = await import('react-dom/client')
    const root = createRoot(container)
    root.render(<QuotationDocument data={wizardData} id="quotation-export" />)

    await new Promise((r) => setTimeout(r, 500))
    await generatePDF('quotation-export', `${contract.contract_number}.pdf`)
    root.unmount()
    document.body.removeChild(container)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Contract not found</p>
        <Link to="/contracts" className="text-brand-900 font-medium mt-2 inline-block">Back to contracts</Link>
      </div>
    )
  }

  const wizardData = contractToWizardData(contract)

  return (
    <>
      <PageHeader
        title={contract.client?.name ?? 'Contract'}
        subtitle={contract.contract_number}
        backTo="/contracts"
        action={<StatusBadge status={contract.status} />}
      />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto pb-8">
        <Card padding="sm" className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-text-muted">Date</span><p className="font-medium">{formatDate(contract.event_date)}</p></div>
          <div><span className="text-text-muted">Total</span><p className="font-medium">{formatCurrency(contract.subtotal)}</p></div>
          <div className="col-span-2"><span className="text-text-muted">Venue</span><p className="font-medium">{contract.venue}</p></div>
        </Card>

        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDuplicate} className="flex-1">
            <Copy className="h-4 w-4" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <QuotationDocument data={wizardData} />
          </div>
        </div>
      </div>
    </>
  )
}
