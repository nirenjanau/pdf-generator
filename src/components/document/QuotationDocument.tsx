import type { ContractWizardData, DocumentConfig } from '@/types'
import { calculatePricing } from '@/utils/calculations'
import { defaultAppSettings } from '@/services/mockData'
import { DocumentHeader } from './DocumentHeader'
import { DocumentOverview } from './DocumentOverview'
import { DocumentClientDetails } from './DocumentClientDetails'
import { DocumentEventDetails } from './DocumentEventDetails'
import { DocumentServicesTable } from './DocumentServicesTable'
import { DocumentPaymentDetails } from './DocumentPaymentDetails'
import { DocumentDeliverables } from './DocumentDeliverables'
import { DocumentTerms } from './DocumentTerms'
import { DocumentNotes } from './DocumentNotes'
import { DocumentFooter } from './DocumentFooter'
import { DocumentPaymentSchedule } from './DocumentPaymentSchedule'
import { DocumentAlbumDetails } from './DocumentAlbumDetails'

interface QuotationDocumentProps {
  data: ContractWizardData
  config?: DocumentConfig
  className?: string
  id?: string
}

export function QuotationDocument({
  data,
  config = defaultAppSettings.documentConfig,
  className = '',
  id,
}: QuotationDocumentProps) {
  const pricing = calculatePricing(data.services, data.pricing)

  return (
    <div
      id={id}
      className={`doc-page bg-white ${className}`}
      style={{ maxWidth: '800px' }}
    >
      <DocumentHeader config={config} contractNumber={data.contract_number} />
      <DocumentOverview
        brideName={data.client.bride_name}
        groomName={data.client.groom_name}
        eventDate={data.event.event_date}
        packageName={data.package_name}
      />
      <DocumentClientDetails client={data.client} />
      <DocumentEventDetails event={data.event} />
      <DocumentServicesTable
        services={data.services}
        columns={config.tableColumns}
      />
      <DocumentPaymentDetails pricing={data.pricing} services={data.services} breakdown={pricing} />
      {data.sections.paymentSchedule && data.payment_schedule.length > 0 && (
        <DocumentPaymentSchedule items={data.payment_schedule} />
      )}
      {data.sections.deliverables && data.deliverables && (
        <DocumentDeliverables content={data.deliverables} />
      )}
      {data.sections.albumDetails && data.album_details && (
        <DocumentAlbumDetails content={data.album_details} />
      )}
      {data.sections.terms && data.terms && (
        <DocumentTerms content={data.terms} />
      )}
      {data.sections.notes && data.event.notes && (
        <DocumentNotes content={data.event.notes} />
      )}
      <DocumentFooter config={config} />
    </div>
  )
}
