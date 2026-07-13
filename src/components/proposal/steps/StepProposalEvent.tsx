import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Chip } from '@/components/ui/Chip'
import {
  defaultOverviewText,
  defaultDetailsLetter,
  buildPricingDifferenceText,
} from '@/services/weddingPackageTemplates'
import {
  WEDDING_EVENT_OPTIONS,
  applyEventsToWeddingTiers,
  hasReceptionEvent,
} from '@/services/weddingEventOptions'
import { buildDanceProposalContent } from '@/services/dancePackageTemplates'
import { formatDateLong } from '@/utils/format'
import type { ProposalStepProps } from './types'

interface EventStepForm {
  wedding_date: string
  coverage_dates: string
  custom_events: string
}

function selectedFromList(events: string[]): Set<string> {
  const labels = new Set<string>(WEDDING_EVENT_OPTIONS.map((o) => o.label))
  return new Set(events.filter((e) => labels.has(e)))
}

function customFromList(events: string[]): string {
  const labels = new Set<string>(WEDDING_EVENT_OPTIONS.map((o) => o.label))
  return events.filter((e) => !labels.has(e)).join('\n')
}

export function StepProposalEvent({ onNext }: ProposalStepProps) {
  const { data, updateData } = useProposalWizard()
  const isDance = data.proposal_type === 'dance'

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(
    () => selectedFromList(data.events_covered)
  )

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventStepForm>({
    defaultValues: {
      wedding_date: data.wedding_date,
      coverage_dates: data.coverage_dates,
      custom_events: customFromList(data.events_covered),
    },
  })

  const toggleEvent = (label: string) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const onSubmit = (formData: EventStepForm) => {
    if (isDance) {
      const dateFormatted = formData.wedding_date ? formatDateLong(formData.wedding_date) : ''
      const content = buildDanceProposalContent(
        data.organization_name || data.client.name,
        data.greeting_name,
        dateFormatted
      )
      updateData({
        wedding_date: formData.wedding_date,
        coverage_dates: formData.coverage_dates,
        overview_text: content.overview_text,
        details_letter: content.details_letter,
      })
      onNext()
      return
    }

    const custom = formData.custom_events
      .split('\n')
      .map((e) => e.trim())
      .filter(Boolean)
    const events = [...selectedEvents, ...custom]

    if (events.length === 0) return

    const tiers = applyEventsToWeddingTiers(data.tiers, events)
    const includeReception = hasReceptionEvent(events)
    const reception = {
      ...data.reception,
      enabled: includeReception,
    }

    updateData({
      wedding_date: formData.wedding_date,
      coverage_dates: formData.coverage_dates,
      events_covered: events,
      overview_text: defaultOverviewText(data.greeting_name, events),
      details_letter: defaultDetailsLetter(data.greeting_name, events),
      tiers,
      pricing_difference_text: buildPricingDifferenceText(tiers),
      reception,
    })
    onNext()
  }

  if (isDance) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-slide-up">
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <Calendar className="h-4 w-4" />
          Programme Details
        </div>

        <Input
          label="Programme Date"
          type="date"
          {...register('wedding_date', { required: 'Programme date is required' })}
          error={errors.wedding_date?.message}
        />
        <Input
          label="Additional Notes (optional)"
          placeholder="e.g. Evening programme, 2 dance performances"
          {...register('coverage_dates')}
        />
      </form>
    )
  }

  const customEvents = watch('custom_events')
  const hasEvents =
    selectedEvents.size > 0 ||
    customEvents.split('\n').some((e) => e.trim())

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Calendar className="h-4 w-4" />
        Wedding Event Details
      </div>

      <p className="text-sm text-text-muted">
        Select only the celebrations this client needs. Not every wedding has reception or
        pre-wedding — pick what applies.
      </p>

      <Input
        label="Main Wedding Date"
        type="date"
        {...register('wedding_date', { required: 'Wedding date is required' })}
        error={errors.wedding_date?.message}
      />

      <Input
        label="Coverage Dates"
        placeholder="e.g. 4th & 5th September 2026 — for multi-day coverage"
        {...register('coverage_dates')}
      />

      <div>
        <p className="text-sm font-medium text-text-primary mb-2">Celebrations to Cover</p>
        <div className="flex flex-wrap gap-2">
          {WEDDING_EVENT_OPTIONS.map(({ label }) => (
            <Chip
              key={label}
              label={label}
              selected={selectedEvents.has(label)}
              onClick={() => toggleEvent(label)}
            />
          ))}
        </div>
      </div>

      <Textarea
        label="Other Events (optional, one per line)"
        placeholder={'Engagement at home\nFamily dinner'}
        rows={3}
        {...register('custom_events')}
      />

      {!hasEvents && (
        <p className="text-sm text-warning">Select at least one celebration to continue.</p>
      )}

      {selectedEvents.has('Reception') && (
        <p className="text-xs text-text-muted bg-brand-50 rounded-xl p-3">
          Reception selected — the Reception Package section will be included on the PDF. You can
          turn it off in the Packages step if needed.
        </p>
      )}

      {(selectedEvents.has('Temple Wedding') || selectedEvents.has('Wedding at Hall / Venue')) &&
        !selectedEvents.has('Reception') && (
          <p className="text-xs text-text-muted bg-surface-secondary rounded-xl p-3">
            Temple or hall wedding only — no Reception Package will be added unless you select
            Reception above.
          </p>
        )}
    </form>
  )
}

export function validateWeddingEvents(selected: Set<string>, customEvents: string): boolean {
  return selected.size > 0 || customEvents.split('\n').some((e) => e.trim())
}
