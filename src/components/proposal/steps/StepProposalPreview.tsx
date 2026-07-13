import { useProposalWizard } from '@/hooks/useProposalWizard'
import { ProposalDocument } from '@/components/document/ProposalDocument'
import type { ProposalStepProps } from './types'

export function StepProposalPreview(_props: ProposalStepProps) {
  const { data } = useProposalWizard()

  return (
    <div className="animate-slide-up">
      <p className="text-sm text-text-secondary mb-4">
        Preview of your {data.proposal_type === 'dance' ? 'dance' : 'wedding'} package proposal.
        Scroll to review all sections.
      </p>
      <div className="bg-gray-100 rounded-2xl p-4 overflow-auto max-h-[65vh]">
        <div className="bg-white rounded-lg shadow-sm p-6 min-w-[280px]">
          <ProposalDocument data={data} id="proposal-preview" />
        </div>
      </div>
    </div>
  )
}
