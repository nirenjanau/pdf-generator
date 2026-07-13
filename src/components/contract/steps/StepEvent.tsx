import { useForm } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import { useContractWizard } from '@/hooks/useContractWizard'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { EventFormData } from '@/types'
import type { WizardStepProps } from './types'

export function StepEvent({ onNext }: WizardStepProps) {
  const { data, updateEvent } = useContractWizard()

  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    defaultValues: data.event,
  })

  const onSubmit = (formData: EventFormData) => {
    updateEvent(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Calendar className="h-4 w-4" />
        Event Details
      </div>

      <Input
        label="Wedding Date"
        type="date"
        {...register('event_date', { required: 'Wedding date is required' })}
        error={errors.event_date?.message}
      />
      <Input
        label="Reception Date"
        type="date"
        {...register('reception_date')}
      />
      <Input
        label="Venue"
        placeholder="e.g. Taj West End, Bangalore"
        {...register('venue', { required: 'Venue is required' })}
        error={errors.venue?.message}
      />
      <Input
        label="Event Time"
        type="time"
        {...register('event_time')}
      />
      <Textarea
        label="Notes"
        placeholder="Any special requirements..."
        rows={3}
        {...register('notes')}
      />
    </form>
  )
}
