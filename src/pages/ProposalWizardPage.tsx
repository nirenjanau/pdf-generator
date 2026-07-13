import { useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { proposalService, proposalToWizardData } from '@/services/proposalService'
import { proposalTypeLabel } from '@/services/proposalTemplates'
import { PageHeader, StickyFooter, Button } from '@/components/ui/PageHeader'
import { StepProgress } from '@/components/ui/StepProgress'
import { PROPOSAL_WIZARD_STEPS, type ProposalType } from '@/types'
import { StepProposalClient } from '@/components/proposal/steps/StepProposalClient'
import { StepProposalEvent } from '@/components/proposal/steps/StepProposalEvent'
import { StepProposalPackages, canProceedFromPackages } from '@/components/proposal/steps/StepProposalPackages'
import { StepProposalContent } from '@/components/proposal/steps/StepProposalContent'
import { StepProposalPreview } from '@/components/proposal/steps/StepProposalPreview'
import { StepProposalGenerate } from '@/components/proposal/steps/StepProposalGenerate'

const STEP_COMPONENTS = [
  StepProposalClient,
  StepProposalEvent,
  StepProposalPackages,
  StepProposalContent,
  StepProposalPreview,
  StepProposalGenerate,
]

export function ProposalWizardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { type, id } = useParams<{ type?: string; id?: string }>()
  const isEdit = location.pathname.includes('/edit')
  const { currentStep, setStep, loadProposal, reset, data } = useProposalWizard()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEdit && id) {
      proposalService.getById(id).then((proposal) => {
        if (proposal) loadProposal(proposalToWizardData(proposal), proposal.id)
      })
    } else if (type === 'wedding' || type === 'dance') {
      reset(type as ProposalType)
    }
  }, [isEdit, id, type, loadProposal, reset])

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const isLastStep = currentStep === PROPOSAL_WIZARD_STEPS.length
  const isFormStep = currentStep === 1 || currentStep === 2

  const goNext = () => {
    if (currentStep < PROPOSAL_WIZARD_STEPS.length) {
      setStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (isEdit) {
      navigate('/proposals')
    } else {
      navigate('/proposals/new')
    }
  }

  const handleNextClick = () => {
    if (isFormStep) {
      const form = formRef.current?.querySelector('form')
      form?.requestSubmit()
    } else if (currentStep === 3 && !canProceedFromPackages(data)) {
      return
    } else {
      goNext()
    }
  }

  const canContinue = currentStep === 3 ? canProceedFromPackages(data) : true

  return (
    <>
      <PageHeader
        title={proposalTypeLabel(data.proposal_type ?? 'wedding')}
        subtitle={PROPOSAL_WIZARD_STEPS[currentStep - 1]?.label}
        backTo=""
      />
      <StepProgress
        currentStep={currentStep}
        steps={PROPOSAL_WIZARD_STEPS.map((s) => ({ id: s.id, label: s.label }))}
      />

      <div ref={formRef} className="px-4 py-6 pb-28 max-w-lg mx-auto">
        <StepComponent onNext={goNext} onBack={goBack} />
      </div>

      {!isLastStep && (
        <StickyFooter>
          <Button variant="ghost" onClick={goBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNextClick}
            className="flex-[2]"
            disabled={!canContinue}
          >
            Continue
          </Button>
        </StickyFooter>
      )}
    </>
  )
}
