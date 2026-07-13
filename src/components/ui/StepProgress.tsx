import { WIZARD_STEPS } from '@/types'
import { cn } from '@/utils/format'

interface StepProgressProps {
  currentStep: number
  steps?: { id: number; label: string }[]
}

export function StepProgress({ currentStep, steps = WIZARD_STEPS.map((s) => ({ id: s.id, label: s.label })) }: StepProgressProps) {
  const total = steps.length
  const progress = (currentStep / total) * 100

  return (
    <div className="px-4 py-3 bg-surface border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">
          Step {currentStep} of {total}
        </span>
        <span className="text-sm text-text-secondary">
          {steps[currentStep - 1]?.label}
        </span>
      </div>
      <div className="h-1.5 bg-surface-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full bg-brand-900 rounded-full transition-all duration-500 ease-out')}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
