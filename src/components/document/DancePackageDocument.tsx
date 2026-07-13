import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { defaultAppSettings } from '@/services/mockData'
import { formatDateLong } from '@/utils/format'
import { PdfSection } from './PdfSection'
import { PackageDocumentHeader } from './wedding-package/PackageDocumentHeader'
import { PackageSection, PackageTextBlock } from './wedding-package/PackageSection'
import { PackageTiersGrid } from './wedding-package/PackageTierCard'

interface DancePackageDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

export function DancePackageDocument({
  data,
  config = defaultAppSettings.documentConfig,
  className = '',
  id,
}: DancePackageDocumentProps) {
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
          <PackageTextBlock text={data.overview_text} />
          {data.wedding_date && (
            <p className="doc-highlight">Programme Date: {formatDateLong(data.wedding_date)}</p>
          )}
        </PackageSection>
      </PdfSection>

      <PdfSection>
        <PackageSection title="Details">
          <PackageTextBlock text={data.details_letter} />
        </PackageSection>
      </PdfSection>

      <PdfSection>
        <section className="mb-8">
          <h2 className="doc-heading">{data.collection_title}</h2>
          <PackageTiersGrid tiers={data.tiers} />
        </section>
      </PdfSection>

      {data.show_pricing_difference && data.pricing_difference_text.trim() && (
        <PdfSection>
          <PackageSection title="Key Reasons for Pricing Differences">
            <PackageTextBlock text={data.pricing_difference_text} />
          </PackageSection>
        </PdfSection>
      )}

      {data.booking_text.trim() && (
        <PdfSection>
          <PackageSection title="How to Confirm Your Booking">
            <PackageTextBlock text={data.booking_text} />
          </PackageSection>
        </PdfSection>
      )}

      <PdfSection>
        <PackageSection title="Contact">
          <PackageTextBlock
            text={`If you need any assistance or would like to discuss additional requirements, feel free to contact us.\n\nWarm Regards,\nBhavana Studio`}
          />
          <div style={{ marginTop: '1.25rem' }}>
            <p className="doc-label" style={{ marginBottom: '0.35rem' }}>
              Call / WhatsApp
            </p>
            {data.contact_persons.map((person, i) => (
              <p key={i} className="doc-contact-line">
                {person.name} — {person.phone}
              </p>
            ))}
          </div>
        </PackageSection>
      </PdfSection>
    </div>
  )
}
