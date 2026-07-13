import { FileText, RefreshCw } from 'lucide-react'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Card } from '@/components/ui/Card'
import { PackageCheckboxGroup } from '@/components/proposal/PackageEditors'
import {
  CONTRACT_DELIVERY_OPTIONS,
  buildContractDeliveryText,
  collectDeliverablesFromPackages,
  suggestContractDeliveryItems,
  defaultContractDetailsLetter,
  defaultContractOverview,
} from '@/services/contractDocumentTemplates'
import {
  DANCE_CONTRACT_DELIVERY_OPTIONS,
  buildDanceContractDeliveryText,
  collectDeliverablesFromDancePackage,
  suggestDanceContractDeliveryItems,
  defaultDanceContractDetailsLetter,
  defaultDanceContractOverview,
  defaultDanceBalancePaymentNote,
} from '@/services/danceContractTemplates'
import { formatDateLong } from '@/utils/format'
import type { ProposalStepProps } from '@/components/proposal/steps/types'

export function StepContractContent(_props: ProposalStepProps) {
  const { data, updateData } = useProposalWizard()
  const isDance = data.proposal_type === 'dance'

  const confirmedTier =
    data.tiers.find((t) => t.id === data.confirmed_tier_id) ??
    data.tiers.find((t) => t.enabled)

  const syncDeliveryFromPackages = () => {
    const packageItems = isDance
      ? collectDeliverablesFromDancePackage(confirmedTier)
      : collectDeliverablesFromPackages(confirmedTier, data.reception)
    const suggested = isDance
      ? suggestDanceContractDeliveryItems(packageItems)
      : suggestContractDeliveryItems(packageItems)
    updateData({ contract_delivery_items: suggested })
  }

  const deliveryPreview = isDance
    ? buildDanceContractDeliveryText(data.contract_delivery_items ?? [])
    : buildContractDeliveryText(data.contract_delivery_items ?? [])

  const refreshOverview = () => {
    const name = data.greeting_name || data.client.name
    const org = data.organization_name ?? ''
    const programmeDate = data.wedding_date ? formatDateLong(data.wedding_date) : data.coverage_dates

    if (isDance) {
      updateData({
        contract_overview_text: defaultDanceContractOverview(
          org || name,
          programmeDate,
          confirmedTier?.includes ?? []
        ),
        contract_details_letter: defaultDanceContractDetailsLetter(name, org, programmeDate),
        balance_payment_note: data.balance_payment_note || defaultDanceBalancePaymentNote,
      })
      return
    }

    const dates = [data.coverage_dates, data.wedding_date].filter(Boolean).join(', ')
    updateData({
      contract_overview_text: defaultContractOverview(name, dates),
      contract_details_letter: defaultContractDetailsLetter(
        name,
        data.events_covered,
        data.coverage_dates || dates
      ),
    })
  }

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <FileText className="h-4 w-4" />
        Contract Content
      </div>
      <p className="text-sm text-text-muted">
        {isDance
          ? 'Confirm payment received and delivery details for this dance programme contract.'
          : 'Configure contract sections. Delivery & File Access is only for contracts — not shown in package proposals.'}
      </p>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" type="button" onClick={refreshOverview}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh overview & letter
        </Button>
      </div>

      <Textarea
        label="Overview"
        rows={6}
        value={data.contract_overview_text ?? ''}
        onChange={(e) => updateData({ contract_overview_text: e.target.value })}
      />

      <Textarea
        label="Details Letter (Dear …)"
        rows={8}
        value={data.contract_details_letter ?? ''}
        onChange={(e) => updateData({ contract_details_letter: e.target.value })}
      />

      <Card className="space-y-4">
        <Toggle
          label={isDance ? 'Delivery Detail' : 'Delivery & File Access'}
          description="Include delivery section in the contract PDF"
          checked={data.show_delivery_section !== false}
          onChange={(show_delivery_section) => updateData({ show_delivery_section })}
        />

        {data.show_delivery_section !== false && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Delivery items</p>
              <Button variant="ghost" size="sm" type="button" onClick={syncDeliveryFromPackages}>
                <RefreshCw className="h-3.5 w-3.5" />
                Sync from package
              </Button>
            </div>
            <PackageCheckboxGroup
              label="What the client receives"
              options={isDance ? DANCE_CONTRACT_DELIVERY_OPTIONS : CONTRACT_DELIVERY_OPTIONS}
              selected={data.contract_delivery_items ?? []}
              onChange={(contract_delivery_items) => updateData({ contract_delivery_items })}
              hint="Checked items appear in the contract delivery section"
            />
            {deliveryPreview && (
              <Textarea
                label="Preview"
                rows={6}
                value={deliveryPreview}
                readOnly
                className="bg-surface-secondary"
              />
            )}
          </div>
        )}
      </Card>

      {!isDance && (
        <Card className="space-y-4">
          <Toggle
            label="Smart Guest Photo Gallery"
            description="Complimentary service — only show if client requested it"
            checked={Boolean(data.show_photo_gallery)}
            onChange={(show_photo_gallery) => updateData({ show_photo_gallery })}
          />
        </Card>
      )}

      <Card className="space-y-4">
        <p className="text-sm font-medium text-text-primary">Payment Received</p>
        <Input
          label="Advance Amount Received (₹)"
          type="number"
          inputMode="numeric"
          value={data.advance_received ?? ''}
          onChange={(e) =>
            updateData({ advance_received: Number(e.target.value) || 0 })
          }
        />
        <Input
          label="Advance Received Date"
          type="date"
          value={data.advance_received_date ?? ''}
          onChange={(e) => updateData({ advance_received_date: e.target.value })}
        />
        <Textarea
          label="Balance Payment Note"
          rows={4}
          value={data.balance_payment_note ?? ''}
          onChange={(e) => updateData({ balance_payment_note: e.target.value })}
          placeholder={isDance ? defaultDanceBalancePaymentNote : undefined}
        />
      </Card>

      {!isDance && (
        <Textarea
          label="Service Coverage & Terms"
          rows={8}
          value={data.service_coverage_terms ?? ''}
          onChange={(e) => updateData({ service_coverage_terms: e.target.value })}
        />
      )}
    </div>
  )
}

export function canProceedFromContractContent(data: {
  confirmed_tier_id?: string
  tiers: { id: string; enabled: boolean }[]
}): boolean {
  return Boolean(
    data.confirmed_tier_id || data.tiers.some((t) => t.enabled)
  )
}
