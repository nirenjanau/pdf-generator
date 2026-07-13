import { useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import {
  weddingContractService,
  contractToWizardData,
} from '@/services/weddingContractService'
import { PageHeader, StickyFooter, Button } from '@/components/ui/PageHeader'
import { StepProgress } from '@/components/ui/StepProgress'
import { StepProposalClient } from '@/components/proposal/steps/StepProposalClient'
import { StepProposalEvent } from '@/components/proposal/steps/StepProposalEvent'
import {
  StepProposalPackages,
  canProceedFromContractPackages,
} from '@/components/proposal/steps/StepProposalPackages'
import {
  StepContractContent,
  canProceedFromContractContent,
} from '@/components/contract/steps/StepContractContent'
import { StepContractPreview } from '@/components/contract/steps/StepContractPreview'
import { StepContractGenerate } from '@/components/contract/steps/StepContractGenerate'

const CONTRACT_STEPS = [
  { id: 1, label: 'Client' },
  { id: 2, label: 'Event' },
  { id: 3, label: 'Package' },
  { id: 4, label: 'Contract' },
  { id: 5, label: 'Preview' },
  { id: 6, label: 'Generate' },
] as const

const STEP_COMPONENTS = [
  StepProposalClient,
  StepProposalEvent,
  StepProposalPackages,
  StepContractContent,
  StepContractPreview,
  StepContractGenerate,
]

export function WeddingContractWizardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = location.pathname.includes('/edit')
  const { currentStep, setStep, loadProposal, reset, data } = useProposalWizard()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEdit && id) {
      weddingContractService.getById(id).then((contract) => {
        if (contract) loadProposal(contractToWizardData(contract), contract.id)
      })
    } else {
      reset('wedding', 'contract')
    }
  }, [isEdit, id, loadProposal, reset])

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const isLastStep = currentStep === CONTRACT_STEPS.length
  const isFormStep = currentStep === 1 || currentStep === 2

  const goNext = () => {
    if (currentStep < CONTRACT_STEPS.length) {
      setStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (isEdit) {
      navigate('/contracts')
    } else {
      navigate('/contracts/new')
    }
  }

  const handleNextClick = () => {
    if (isFormStep) {
      const form = formRef.current?.querySelector('form')
      form?.requestSubmit()
    } else if (currentStep === 3 && !canProceedFromContractPackages(data)) {
      return
    } else if (currentStep === 4 && !canProceedFromContractContent(data)) {
      return
    } else {
      goNext()
    }
  }

  const canContinue =
    currentStep === 3
      ? canProceedFromContractPackages(data)
      : currentStep === 4
        ? canProceedFromContractContent(data)
        : true

  return (
    <>
      <PageHeader
        title="Wedding Contract"
        subtitle={CONTRACT_STEPS[currentStep - 1]?.label}
        backTo=""
      />
      <StepProgress
        currentStep={currentStep}
        steps={CONTRACT_STEPS.map((s) => ({ id: s.id, label: s.label }))}
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
