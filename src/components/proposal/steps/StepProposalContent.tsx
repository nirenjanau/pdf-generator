import { FileText, RefreshCw } from 'lucide-react'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Card } from '@/components/ui/Card'
import { buildPricingDifferenceText } from '@/services/weddingPackageTemplates'
import type { ProposalStepProps } from './types'

export function StepProposalContent(_props: ProposalStepProps) {
  const { data, updateData } = useProposalWizard()
  const isDance = data.proposal_type === 'dance'

  const refreshPricingNote = () => {
    updateData({ pricing_difference_text: buildPricingDifferenceText(data.tiers) })
  }

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <FileText className="h-4 w-4" />
        Proposal Content
      </div>
      <p className="text-sm text-text-muted">
        Review and edit every section for this client. The letter, overview, and pricing note should
        match what you agreed with them.
      </p>

      <Textarea
        label="Overview"
        rows={6}
        value={data.overview_text}
        onChange={(e) => updateData({ overview_text: e.target.value })}
      />

      <Textarea
        label="Details Letter (Dear …)"
        rows={9}
        value={data.details_letter}
        onChange={(e) => updateData({ details_letter: e.target.value })}
      />

      <Card className="space-y-4">
        <Toggle
          label="Key Reasons for Pricing Differences"
          description="Include this section in the PDF to explain why packages differ"
          checked={data.show_pricing_difference}
          onChange={(show_pricing_difference) => {
            const updates: Partial<typeof data> = { show_pricing_difference }
            if (show_pricing_difference && !data.pricing_difference_text.trim()) {
              updates.pricing_difference_text = buildPricingDifferenceText(data.tiers)
            }
            updateData(updates)
          }}
        />

        {data.show_pricing_difference && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-text-primary">
                Pricing difference note
              </label>
              <Button variant="ghost" size="sm" type="button" onClick={refreshPricingNote}>
                <RefreshCw className="h-3.5 w-3.5" />
                Reset from packages
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              Change this for every client — explain why package options differ for this{' '}
              {isDance ? 'programme' : 'wedding'}.
            </p>
            <Textarea
              rows={6}
              value={data.pricing_difference_text}
              onChange={(e) => updateData({ pricing_difference_text: e.target.value })}
              placeholder="Explain why package options differ for this client…"
            />
          </div>
        )}
      </Card>

      <Textarea
        label={isDance ? 'How to Confirm Booking' : 'How to Book'}
        rows={5}
        value={data.booking_text}
        onChange={(e) => updateData({ booking_text: e.target.value })}
      />
    </div>
  )
}
