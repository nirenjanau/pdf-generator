import { useState } from 'react'
import { Download, Share2, Printer, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { ProposalDocument } from '@/components/document/ProposalDocument'
import { Button } from '@/components/ui/Button'
import { proposalService } from '@/services/proposalService'
import { generatePDF, generatePDFBlob, sharePDF, printDocument } from '@/utils/pdf'
import type { ProposalStepProps } from './types'

export function StepProposalGenerate(_props: ProposalStepProps) {
  const { data, proposalId } = useProposalWizard()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<string | null>(null)

  const filename = `${data.proposal_number || 'wedding-package'}.pdf`
  const clientLabel = data.greeting_name || data.client.name

  const handleSaveDraft = async () => {
    setLoading('save')
    try {
      await proposalService.saveDraft(data, proposalId)
      navigate('/proposals')
    } finally {
      setLoading(null)
    }
  }

  const handleDownload = async () => {
    setLoading('download')
    try {
      await generatePDF('proposal-export', filename)
      await proposalService.finalize(data, proposalId)
    } finally {
      setLoading(null)
    }
  }

  const handleShare = async () => {
    setLoading('share')
    try {
      const blob = await generatePDFBlob('proposal-export')
      await sharePDF(blob, filename, `Wedding Package - ${clientLabel}`)
    } finally {
      setLoading(null)
    }
  }

  const handlePrint = () => {
    printDocument('proposal-export')
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Off-screen (not display:none) so html2canvas can measure and capture it */}
      <div
        aria-hidden
        className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none"
        style={{ width: '800px' }}
      >
        <ProposalDocument data={data} id="proposal-export" />
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
          <ProposalDocument data={data} />
        </div>
      </div>
    </div>
  )
}
