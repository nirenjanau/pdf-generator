import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { defaultAppSettings } from '@/services/mockData'
import {
  buildDanceContractDeliveryText,
  buildDancePaymentDetailsText,
} from '@/services/danceContractTemplates'
import { formatCurrency, formatDateLong } from '@/utils/format'
import { PdfSection } from '../PdfSection'
import { PackageDocumentHeader } from '../wedding-package/PackageDocumentHeader'
import { PackageSection, PackageTextBlock } from '../wedding-package/PackageSection'
import { PackageTierCard } from '../wedding-package/PackageTierCard'

interface DanceContractDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

const CLOSING = `Thank you for choosing Bhavana Studio. We look forward to capturing your special moments beautifully.

Warm Regards,
Bhavana Studio`

export function DanceContractDocument({
  data,
  config = defaultAppSettings.documentConfig,
  className = '',
  id,
}: DanceContractDocumentProps) {
  const confirmedTier =
    data.tiers.find((t) => t.id === data.confirmed_tier_id) ??
    data.tiers.find((t) => t.enabled)

  const totalCost = confirmedTier?.price ?? 0
  const advanceReceived = data.advance_received ?? 0
  const balancePayable = Math.max(0, totalCost - advanceReceived)

  const deliveryText =
    data.show_delivery_section !== false
      ? buildDanceContractDeliveryText(data.contract_delivery_items ?? [])
      : ''

  const overviewText = data.contract_overview_text ?? data.overview_text
  const detailsText = data.contract_details_letter ?? data.details_letter

  const paymentText = buildDancePaymentDetailsText(
    totalCost,
    advanceReceived,
    data.advance_received_date ?? '',
    data.balance_payment_note ?? '',
    formatCurrency,
    formatDateLong
  )

  return (
    <div
      id={id}
      className={`doc-page bg-white ${className}`}
      style={{ maxWidth: '800px', padding: '8px 4px' }}
    >
      <PdfSection>
        <PackageDocumentHeader config={config} proposalNumber={data.proposal_number} />
      </PdfSection>

      <PdfSection>
        <PackageSection title="Overview">
          <PackageTextBlock text={overviewText} />
          {data.wedding_date && (
            <p className="doc-highlight">Programme Date: {formatDateLong(data.wedding_date)}</p>
          )}
        </PackageSection>
      </PdfSection>

      <PdfSection>
        <PackageSection title="Details">
          <PackageTextBlock text={detailsText} />
        </PackageSection>
      </PdfSection>

      {confirmedTier && (
        <PdfSection>
          <PackageSection title={data.collection_title || 'Package Details'}>
            <PackageTierCard
              name={confirmedTier.name}
              price={confirmedTier.price}
              subtitle={confirmedTier.subtitle}
              includes={confirmedTier.includes}
              coverageTeam={confirmedTier.coverageTeam}
              album={confirmedTier.album}
              deliverables={confirmedTier.deliverables}
            />
          </PackageSection>
        </PdfSection>
      )}

      <PdfSection>
        <PackageSection title="Package & Payment Details">
          <PackageTextBlock text={paymentText} />
          <div className="doc-body mt-4 space-y-1">
            <p>
              <strong>Total Package Cost:</strong> {formatCurrency(totalCost)}
            </p>
            <p>
              <strong>Advance Amount Received:</strong> {formatCurrency(advanceReceived)}
              {data.advance_received_date &&
                ` (${formatDateLong(data.advance_received_date)})`}
            </p>
            <p>
              <strong>Balance Amount Payable:</strong> {formatCurrency(balancePayable)}
            </p>
          </div>
        </PackageSection>
      </PdfSection>

      {deliveryText.trim() && (
        <PdfSection>
          <PackageSection title="Delivery Detail">
            <PackageTextBlock text={deliveryText} />
          </PackageSection>
        </PdfSection>
      )}

      <PdfSection>
        <PackageSection title="Contact">
          <PackageTextBlock text={CLOSING} />
          <div style={{ marginTop: '1.25rem' }}>
            <p className="doc-label" style={{ marginBottom: '0.35rem' }}>
              Call / WhatsApp
            </p>
            {data.contact_persons.map((person, i) => (
              <p key={i} className="doc-contact-line">
                {person.name} : {person.phone}
              </p>
            ))}
          </div>
        </PackageSection>
      </PdfSection>
    </div>
  )
}
