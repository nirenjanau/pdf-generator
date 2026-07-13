import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { defaultAppSettings } from '@/services/mockData'
import {
  buildContractDeliveryText,
  PHOTO_GALLERY_TEXT,
} from '@/services/contractDocumentTemplates'
import { formatCurrency, formatDateLong } from '@/utils/format'
import { PdfSection } from '../PdfSection'
import { PackageDocumentHeader } from '../wedding-package/PackageDocumentHeader'
import { PackageSection, PackageTextBlock } from '../wedding-package/PackageSection'
import { PackageTierCard } from '../wedding-package/PackageTierCard'
import { ReceptionPackageSection } from '../wedding-package/ReceptionPackageSection'

interface WeddingContractDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

const CONTACT_CLOSING = `Thank you for choosing Bhavana Studio to capture one of the most important days of your life.

We are committed to delivering beautiful photographs and candid videography that preserve your wedding memories for generations to come.

Should you have any questions regarding this agreement, please feel free to contact us at any time.

Warm Regards,
Bhavana Studio`

export function WeddingContractDocument({
  data,
  config = defaultAppSettings.documentConfig,
  className = '',
  id,
}: WeddingContractDocumentProps) {
  const confirmedTier =
    data.tiers.find((t) => t.id === data.confirmed_tier_id) ??
    data.tiers.find((t) => t.enabled)

  const weddingPrice = confirmedTier?.price ?? 0
  const receptionPrice = data.reception.enabled ? data.reception.price : 0
  const totalCost = weddingPrice + receptionPrice
  const advanceReceived = data.advance_received ?? 0
  const balancePayable = Math.max(0, totalCost - advanceReceived)

  const deliveryText =
    data.show_delivery_section !== false
      ? buildContractDeliveryText(data.contract_delivery_items ?? [])
      : ''

  const overviewText = data.contract_overview_text ?? data.overview_text
  const detailsText = data.contract_details_letter ?? data.details_letter

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
          {data.events_covered.length > 0 && (
            <ul className="doc-list mt-3">
              {data.events_covered.map((event, i) => (
                <li key={i}>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          )}
          {data.wedding_date && (
            <p className="doc-highlight">Wedding Date: {formatDateLong(data.wedding_date)}</p>
          )}
        </PackageSection>
      </PdfSection>

      <PdfSection>
        <PackageSection title="Details">
          <PackageTextBlock text={detailsText} />
        </PackageSection>
      </PdfSection>

      <PdfSection>
        <PackageSection title={data.collection_title || 'Packages Details'}>
          {data.coverage_dates && (
            <p className="doc-meta">Coverage Dates: {data.coverage_dates}</p>
          )}
          {confirmedTier && (
            <PackageTierCard
              name={confirmedTier.name}
              price={confirmedTier.price}
              subtitle={
                data.coverage_dates
                  ? `${confirmedTier.subtitle} (Coverage Dates: ${data.coverage_dates})`
                  : confirmedTier.subtitle
              }
              includes={confirmedTier.includes}
              coverageTeam={confirmedTier.coverageTeam}
              album={confirmedTier.album}
              deliverables={confirmedTier.deliverables}
            />
          )}
        </PackageSection>
      </PdfSection>

      {data.reception.enabled && (
        <PdfSection>
          <ReceptionPackageSection reception={data.reception} />
        </PdfSection>
      )}

      <PdfSection>
        <PackageSection title="Payment Details">
          <div className="doc-body space-y-2">
            {confirmedTier && (
              <p>
                <strong>Selected Wedding Package:</strong> {confirmedTier.name} –{' '}
                {formatCurrency(weddingPrice)}
              </p>
            )}
            {data.reception.enabled && (
              <p>
                <strong>Selected Reception Package:</strong> {data.reception.name} –{' '}
                {formatCurrency(receptionPrice)}
              </p>
            )}
            <p>
              <strong>Total Package Cost:</strong> {formatCurrency(totalCost)}
            </p>
            <p>
              <strong>Advance Amount Received:</strong> {formatCurrency(advanceReceived)}
              {data.advance_received_date &&
                ` (Received on ${formatDateLong(data.advance_received_date)})`}
            </p>
            <p>
              <strong>Balance Amount Payable:</strong> {formatCurrency(balancePayable)}
            </p>
          </div>
          {data.balance_payment_note?.trim() && (
            <div className="mt-4">
              <PackageTextBlock text={data.balance_payment_note} />
            </div>
          )}
        </PackageSection>
      </PdfSection>

      {deliveryText.trim() && (
        <PdfSection>
          <PackageSection title="Delivery & File Access">
            <PackageTextBlock text={deliveryText} />
          </PackageSection>
        </PdfSection>
      )}

      {data.service_coverage_terms?.trim() && (
        <PdfSection>
          <PackageSection title="Service Coverage & Terms">
            <PackageTextBlock text={data.service_coverage_terms} />
          </PackageSection>
        </PdfSection>
      )}

      {data.show_photo_gallery && (
        <PdfSection>
          <PackageSection title="Complimentary Service">
            <PackageTextBlock text={PHOTO_GALLERY_TEXT} />
          </PackageSection>
        </PdfSection>
      )}

      <PdfSection>
        <PackageSection title="Contact">
          <PackageTextBlock text={CONTACT_CLOSING} />
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
