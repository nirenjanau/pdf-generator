import { useProposalWizard } from '@/hooks/useProposalWizard'
import { ContractDocument } from '@/components/document/ContractDocument'
import type { ProposalStepProps } from '@/components/proposal/steps/types'

export function StepContractPreview(_props: ProposalStepProps) {
  const { data } = useProposalWizard()
  const label = data.proposal_type === 'dance' ? 'dance programme' : 'wedding'

  return (
    <div className="animate-slide-up">
      <p className="text-sm text-text-secondary mb-4">
        Preview of the {label} contract. Scroll to review all sections.
      </p>
      <div className="bg-gray-100 rounded-2xl p-4 overflow-auto max-h-[65vh]">
        <div className="bg-white rounded-lg shadow-sm p-6 min-w-[280px]">
          <ContractDocument data={data} id="contract-preview" />
        </div>
      </div>
    </div>
  )
}
