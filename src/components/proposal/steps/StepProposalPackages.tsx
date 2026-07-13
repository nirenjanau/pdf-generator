import { useState } from 'react'
import { ChevronDown, ChevronUp, Package, Plus, Trash2 } from 'lucide-react'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { buildPricingDifferenceText, createEmptyPackageTier, PRESET_WEDDING_TIER_IDS } from '@/services/weddingPackageTemplates'
import {
  collectDeliverablesFromPackages,
  suggestContractDeliveryItems,
} from '@/services/contractDocumentTemplates'
import {
  collectDeliverablesFromDancePackage,
  suggestDanceContractDeliveryItems,
} from '@/services/danceContractTemplates'
import {
  AlbumCheckboxEditor,
  DanceIncludesCheckboxEditor,
  IncludesCheckboxEditor,
  PackageCheckboxGroup,
  PackageListEditor,
  PackageNameFields,
  WEDDING_CHECKBOX_FIELDS,
  DANCE_CHECKBOX_FIELDS,
  RECEPTION_PACKAGE_FIELDS,
  RECEPTION_CHECKBOX_FIELDS,
} from '@/components/proposal/PackageEditors'
import type { PackageTier, ReceptionPackageData } from '@/types'
import type { ProposalStepProps } from './types'

export function StepProposalPackages(_props: ProposalStepProps) {
  const { data, updateData } = useProposalWizard()
  const isDance = data.proposal_type === 'dance'
  const isWedding = !isDance
  const isContract = data.document_type === 'contract'

  const applyTiers = (tiers: PackageTier[], extra: Partial<typeof data> = {}) => {
    updateData({
      tiers,
      pricing_difference_text: buildPricingDifferenceText(tiers),
      ...extra,
    })
  }

  const updateTier = (tierId: string, updates: Partial<PackageTier>) => {
    applyTiers(data.tiers.map((t) => (t.id === tierId ? { ...t, ...updates } : t)))
  }

  const toggleTier = (tierId: string, enabled: boolean) => {
    updateTier(tierId, { enabled })
  }

  const addCustomPackage = () => {
    applyTiers([...data.tiers, createEmptyPackageTier()])
  }

  const removeTier = (tierId: string) => {
    applyTiers(data.tiers.filter((t) => t.id !== tierId))
  }

  const updateReception = (updates: Partial<ReceptionPackageData>) => {
    updateData({ reception: { ...data.reception, ...updates } })
  }

  const selectConfirmedTier = (tierId: string) => {
    const tiers = data.tiers.map((t) => ({
      ...t,
      enabled: t.id === tierId,
    }))
    const tier = tiers.find((t) => t.id === tierId)
    const packageItems = isDance
      ? collectDeliverablesFromDancePackage(tier)
      : collectDeliverablesFromPackages(tier, data.reception)
    const contract_delivery_items = isDance
      ? suggestDanceContractDeliveryItems(packageItems)
      : suggestContractDeliveryItems(packageItems)
    applyTiers(tiers, {
      confirmed_tier_id: tierId,
      contract_delivery_items,
    })
  }

  const enabledCount =
    (isContract ? (data.confirmed_tier_id ? 1 : 0) : data.tiers.filter((t) => t.enabled).length) +
    (isWedding && data.reception.enabled ? 1 : 0)

  const danceFields = DANCE_CHECKBOX_FIELDS

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Package className="h-4 w-4" />
        {isContract ? 'Confirmed Package' : 'Customize Packages'}
      </div>
      <p className="text-sm text-text-muted">
        {isContract
          ? 'Select the confirmed wedding package for this contract, then customize its details.'
          : 'Check includes, coverage team, album, and deliverables for each package. Use Create Custom Package to add a new package from scratch.'}
      </p>

      {isContract && (
        <Card padding="md" className="space-y-2">
          <p className="text-sm font-medium">
            {isDance ? 'Confirmed Dance Package' : 'Confirmed Wedding Package'}
          </p>
          {data.tiers.map((tier) => (
            <label
              key={tier.id}
              className="flex items-center gap-3 py-2 cursor-pointer touch-manipulation"
            >
              <input
                type="radio"
                name="confirmed-tier"
                checked={data.confirmed_tier_id === tier.id}
                onChange={() => selectConfirmedTier(tier.id)}
                className="h-4 w-4 accent-brand-900"
              />
              <span className="text-sm font-medium">{tier.name}</span>
              <span className="text-sm text-text-muted ml-auto">
                {formatCurrency(tier.price)}
              </span>
            </label>
          ))}
        </Card>
      )}

      <div className="space-y-3">
        {data.tiers.map((tier) => {
          if (isContract && tier.id !== data.confirmed_tier_id) return null
          return (
          <TierEditor
            key={tier.id}
            tier={tier}
            isDance={isDance}
            isContract={isContract}
            danceFields={danceFields}
            canDelete={isWedding && !PRESET_WEDDING_TIER_IDS.has(tier.id) && !isContract}
            onToggle={(enabled) => toggleTier(tier.id, enabled)}
            onUpdate={(updates) => updateTier(tier.id, updates)}
            onDelete={() => removeTier(tier.id)}
          />
          )
        })}

        {isWedding && !isContract && (
          <Button variant="outline" onClick={addCustomPackage} fullWidth>
            <Plus className="h-5 w-5" /> Create Custom Package
          </Button>
        )}
      </div>

      {isWedding && (
        <ReceptionEditor
          reception={data.reception}
          onUpdate={updateReception}
        />
      )}

      {enabledCount === 0 && (
        <p className="text-sm text-warning text-center">
          {isContract ? 'Select a confirmed wedding package to continue.' : 'Enable at least one package to continue.'}
        </p>
      )}
    </div>
  )
}

function TierEditor({
  tier,
  isDance,
  isContract,
  danceFields,
  canDelete,
  onToggle,
  onUpdate,
  onDelete,
}: {
  tier: PackageTier
  isDance: boolean
  isContract: boolean
  danceFields: typeof DANCE_CHECKBOX_FIELDS
  canDelete: boolean
  onToggle: (enabled: boolean) => void
  onUpdate: (updates: Partial<PackageTier>) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(isContract || tier.enabled)

  return (
    <Card padding="md">
      {!isContract && (
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Toggle
            label={tier.name}
            description={tier.subtitle}
            checked={tier.enabled}
            onChange={(enabled) => {
              onToggle(enabled)
              if (enabled) setExpanded(true)
            }}
          />
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-danger hover:bg-red-50 rounded-lg shrink-0"
            aria-label="Remove package"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      )}

      {isContract && (
        <p className="text-sm font-medium text-text-primary mb-2">{tier.name} — package details</p>
      )}

      {(isContract || tier.enabled) && (
        <div className="mt-3 pt-3 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">Package details</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> Edit table rows
                </>
              )}
            </Button>
          </div>

          <Input
            label="Price (₹)"
            type="number"
            inputMode="numeric"
            value={tier.price}
            onChange={(e) => onUpdate({ price: Number(e.target.value) || 0 })}
          />
          <p className="text-lg font-bold text-brand-900 -mt-2">{formatCurrency(tier.price)}</p>

          {expanded && (
            <div className="space-y-4 pt-2">
              <PackageNameFields
                name={tier.name}
                subtitle={tier.subtitle}
                onNameChange={(name) => onUpdate({ name })}
                onSubtitleChange={(subtitle) => onUpdate({ subtitle })}
              />

              {isDance ? (
                <>
                  <DanceIncludesCheckboxEditor
                    includes={tier.includes}
                    onChange={(includes) => onUpdate({ includes })}
                  />

                  <PackageCheckboxGroup
                    label={danceFields.coverageTeam.label}
                    options={danceFields.coverageTeam.options}
                    selected={tier.coverageTeam}
                    onChange={(coverageTeam) => onUpdate({ coverageTeam })}
                  />

                  <PackageCheckboxGroup
                    label={danceFields.deliverables.label}
                    options={danceFields.deliverables.options}
                    selected={tier.deliverables}
                    onChange={(deliverables) => onUpdate({ deliverables })}
                  />
                </>
              ) : (
                <>
                  <IncludesCheckboxEditor
                    includes={tier.includes}
                    onChange={(includes) => onUpdate({ includes })}
                  />

                  <PackageCheckboxGroup
                    label={WEDDING_CHECKBOX_FIELDS.coverageTeam.label}
                    options={WEDDING_CHECKBOX_FIELDS.coverageTeam.options}
                    selected={tier.coverageTeam}
                    onChange={(coverageTeam) => onUpdate({ coverageTeam })}
                  />

                  <AlbumCheckboxEditor
                    album={tier.album}
                    onChange={(album) => onUpdate({ album })}
                  />

                  <PackageCheckboxGroup
                    label={WEDDING_CHECKBOX_FIELDS.deliverables.label}
                    options={WEDDING_CHECKBOX_FIELDS.deliverables.options}
                    selected={tier.deliverables}
                    onChange={(deliverables) => onUpdate({ deliverables })}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function ReceptionEditor({
  reception,
  onUpdate,
}: {
  reception: ReceptionPackageData
  onUpdate: (updates: Partial<ReceptionPackageData>) => void
}) {
  const [expanded, setExpanded] = useState(reception.enabled)

  return (
    <Card padding="md" className="mt-2">
      <Toggle
        label="Include Reception Package"
        description={
          reception.enabled
            ? reception.subtitle
            : 'Enable if this client has a separate reception event'
        }
        checked={reception.enabled}
        onChange={(enabled) => {
          onUpdate({ enabled })
          if (enabled) setExpanded(true)
        }}
      />

      {reception.enabled && (
        <div className="mt-3 pt-3 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">Reception package details</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> Edit table rows
                </>
              )}
            </Button>
          </div>

          <Input
            label="Price (₹)"
            type="number"
            inputMode="numeric"
            value={reception.price}
            onChange={(e) => onUpdate({ price: Number(e.target.value) || 0 })}
          />
          <p className="text-lg font-bold text-brand-900 -mt-2">{formatCurrency(reception.price)}</p>

          {expanded && (
            <div className="space-y-4 pt-2">
              <PackageNameFields
                name={reception.name}
                subtitle={reception.subtitle}
                onNameChange={(name) => onUpdate({ name })}
                onSubtitleChange={(subtitle) => onUpdate({ subtitle })}
              />

              {RECEPTION_PACKAGE_FIELDS.filter(
                (field) =>
                  field.key !== 'includes' &&
                  field.key !== 'coverageTeam' &&
                  field.key !== 'album' &&
                  field.key !== 'deliverables'
              ).map((field) => (
                <PackageListEditor
                  key={field.key}
                  label={field.label}
                  items={reception[field.key]}
                  onChange={(items) => onUpdate({ [field.key]: items })}
                  rows={field.rows}
                  hint="One item per line"
                />
              ))}

              <IncludesCheckboxEditor
                includes={reception.includes}
                onChange={(includes) => onUpdate({ includes })}
              />

              <PackageCheckboxGroup
                label={RECEPTION_CHECKBOX_FIELDS.coverageTeam.label}
                options={RECEPTION_CHECKBOX_FIELDS.coverageTeam.options}
                selected={reception.coverageTeam}
                onChange={(coverageTeam) => onUpdate({ coverageTeam })}
              />

              <AlbumCheckboxEditor
                album={reception.album}
                onChange={(album) => onUpdate({ album })}
              />

              <PackageCheckboxGroup
                label={RECEPTION_CHECKBOX_FIELDS.deliverables.label}
                options={RECEPTION_CHECKBOX_FIELDS.deliverables.options}
                selected={reception.deliverables}
                onChange={(deliverables) => onUpdate({ deliverables })}
              />

              <Textarea
                label="Additional Reception Information"
                rows={5}
                value={reception.additionalInfo}
                onChange={(e) => onUpdate({ additionalInfo: e.target.value })}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export function canProceedFromContractPackages(data: {
  document_type?: string
  proposal_type?: string
  confirmed_tier_id?: string
  tiers: PackageTier[]
  reception: { enabled: boolean }
}) {
  if (data.document_type === 'contract') {
    if (data.proposal_type === 'dance') {
      return Boolean(data.confirmed_tier_id)
    }
    return Boolean(data.confirmed_tier_id) || data.reception.enabled
  }
  return canProceedFromPackages(data)
}

export function canProceedFromPackages(data: {
  proposal_type?: string
  tiers: PackageTier[]
  reception: { enabled: boolean }
}) {
  const hasTier = data.tiers.some((t) => t.enabled)
  if (data.proposal_type === 'dance') return hasTier
  return hasTier || data.reception.enabled
}
