import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { defaultAppSettings } from '@/services/mockData'
import { formatDateLong } from '@/utils/format'
import { PdfSection } from '../PdfSection'
import { PackageDocumentHeader } from './PackageDocumentHeader'
import { PackageSection, PackageTextBlock } from './PackageSection'
import { PackageTiersGrid } from './PackageTierCard'
import { ReceptionPackageSection } from './ReceptionPackageSection'

interface WeddingPackageDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

const CONTACT_CLOSING = `Thank you for considering Bhavana Studio to capture one of the most important days of your life.

We are committed to delivering beautiful photographs and candid videography that preserve your wedding memories for generations to come.

Should you have any questions or wish to customize any aspect of the package, please feel free to contact us at any time.

Warm Regards,
Bhavana Studio`

export function WeddingPackageDocument({
  data,
  config = defaultAppSettings.documentConfig,
  className = '',
  id,
}: WeddingPackageDocumentProps) {
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
          {data.events_covered.length > 0 && (
            <div className="mt-4">
              <p className="doc-body" style={{ marginBottom: '0.5rem' }}>
                The proposal includes coverage options for the following wedding events:
              </p>
              <ul className="doc-list">
                {data.events_covered.map((event, i) => (
                  <li key={i}>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.wedding_date && (
            <p className="doc-highlight">Wedding Date: {formatDateLong(data.wedding_date)}</p>
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
          {data.coverage_dates && (
            <p className="doc-meta">Coverage Dates: {data.coverage_dates}</p>
          )}
          <PackageTiersGrid tiers={data.tiers} />
        </section>
      </PdfSection>

      {data.reception.enabled && (
        <PdfSection>
          <ReceptionPackageSection reception={data.reception} />
        </PdfSection>
      )}

      {data.show_pricing_difference && data.pricing_difference_text.trim() && (
        <PdfSection>
          <PackageSection title="Key Reasons for Pricing Differences">
            <PackageTextBlock text={data.pricing_difference_text} />
          </PackageSection>
        </PdfSection>
      )}

      {data.booking_text.trim() && (
        <PdfSection>
          <PackageSection title="How to Book Your Wedding Package">
            <PackageTextBlock text={data.booking_text} />
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
