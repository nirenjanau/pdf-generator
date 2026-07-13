import { useContractWizard } from '@/hooks/useContractWizard'
import { QuotationDocument } from '@/components/document/QuotationDocument'
import type { WizardStepProps } from './types'

export function StepPreview(_props: WizardStepProps) {
  const { data } = useContractWizard()

  return (
    <div className="animate-slide-up">
      <p className="text-sm text-text-secondary mb-4">
        Preview of your quotation. Changes update instantly.
      </p>
      <div className="bg-gray-100 rounded-2xl p-4 overflow-auto max-h-[60vh]">
        <div className="bg-white rounded-lg shadow-sm p-6 min-w-[280px]">
          <QuotationDocument data={data} id="quotation-preview" />
        </div>
      </div>
    </div>
  )
}
