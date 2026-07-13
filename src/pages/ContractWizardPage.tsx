import { useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useContractWizard } from '@/hooks/useContractWizard'
import { contractService, contractToWizardData } from '@/services/contractService'
import { PageHeader, StickyFooter, Button } from '@/components/ui/PageHeader'
import { StepProgress } from '@/components/ui/StepProgress'
import { WIZARD_STEPS } from '@/types'
import { StepClient } from '@/components/contract/steps/StepClient'
import { StepEvent } from '@/components/contract/steps/StepEvent'
import { StepPackage } from '@/components/contract/steps/StepPackage'
import { StepServices } from '@/components/contract/steps/StepServices'
import { StepPricing } from '@/components/contract/steps/StepPricing'
import { StepSections } from '@/components/contract/steps/StepSections'
import { StepPreview } from '@/components/contract/steps/StepPreview'
import { StepGenerate } from '@/components/contract/steps/StepGenerate'

const STEP_COMPONENTS = [
  StepClient,
  StepEvent,
  StepPackage,
  StepServices,
  StepPricing,
  StepSections,
  StepPreview,
  StepGenerate,
]

export function ContractWizardPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { currentStep, setStep, loadContract, reset } = useContractWizard()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) {
      contractService.getById(id).then((contract) => {
        if (contract) loadContract(contractToWizardData(contract), contract.id)
      })
    } else {
      reset()
    }
  }, [id, loadContract, reset])

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const isLastStep = currentStep === WIZARD_STEPS.length
  const isPackageStep = currentStep === 3

  const goNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleNextClick = () => {
    if (currentStep === 1 || currentStep === 2) {
      const form = formRef.current?.querySelector('form')
      form?.requestSubmit()
    } else {
      goNext()
    }
  }

  return (
    <>
      <PageHeader
        title="New Contract"
        subtitle={WIZARD_STEPS[currentStep - 1]?.label}
        backTo=""
      />
      <StepProgress currentStep={currentStep} />

      <div ref={formRef} className="px-4 py-6 pb-28 max-w-lg mx-auto">
        <StepComponent onNext={goNext} onBack={goBack} />
      </div>

      {!isLastStep && !isPackageStep && (
        <StickyFooter>
          <Button variant="ghost" onClick={goBack} className="flex-1">
            Back
          </Button>
          <Button variant="primary" onClick={handleNextClick} className="flex-[2]">
            Continue
          </Button>
        </StickyFooter>
      )}

      {isPackageStep && (
        <StickyFooter>
          <Button variant="ghost" onClick={goBack} fullWidth>
            Back
          </Button>
        </StickyFooter>
      )}
    </>
  )
}
