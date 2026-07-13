import { useState } from 'react'
import { Download, Share2, Printer, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { ContractDocument } from '@/components/document/ContractDocument'
import { Button } from '@/components/ui/Button'
import { weddingContractService } from '@/services/weddingContractService'
import { contractTypeLabel } from '@/services/proposalTemplates'
import { generatePDF, generatePDFBlob, sharePDF, printDocument } from '@/utils/pdf'
import type { ProposalStepProps } from '@/components/proposal/steps/types'

export function StepContractGenerate(_props: ProposalStepProps) {
  const { data, proposalId } = useProposalWizard()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<string | null>(null)

  const typeLabel = contractTypeLabel(data.proposal_type ?? 'wedding')
  const filename = `${data.proposal_number || `${data.proposal_type}-contract`}.pdf`
  const clientLabel = data.greeting_name || data.client.name || data.organization_name

  const handleSaveDraft = async () => {
    setLoading('save')
    try {
      await weddingContractService.saveDraft(data, proposalId)
      navigate('/contracts')
    } finally {
      setLoading(null)
    }
  }

  const handleDownload = async () => {
    setLoading('download')
    try {
      await generatePDF('contract-export', filename)
      await weddingContractService.finalize(data, proposalId)
    } finally {
      setLoading(null)
    }
  }

  const handleShare = async () => {
    setLoading('share')
    try {
      const blob = await generatePDFBlob('contract-export')
      await sharePDF(blob, filename, `${typeLabel} - ${clientLabel}`)
    } finally {
      setLoading(null)
    }
  }

  const handlePrint = () => {
    printDocument('contract-export')
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <div
        aria-hidden
        className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none"
        style={{ width: '800px' }}
      >
        <ContractDocument data={data} id="contract-export" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" onClick={handleDownload} loading={loading === 'download'} fullWidth>
          <Download className="h-5 w-5" /> Download
        </Button>
        <Button variant="secondary" onClick={handleShare} loading={loading === 'share'} fullWidth>
          <Share2 className="h-5 w-5" /> Share
        </Button>
        <Button variant="outline" onClick={handlePrint} fullWidth>
          <Printer className="h-5 w-5" /> Print
        </Button>
        <Button variant="ghost" onClick={handleSaveDraft} loading={loading === 'save'} fullWidth>
          <Save className="h-5 w-5" /> Save Draft
        </Button>
      </div>

      <div className="bg-gray-100 rounded-2xl p-4 overflow-auto max-h-[50vh]">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContractDocument data={data} />
        </div>
      </div>
    </div>
  )
}
