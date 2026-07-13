import type { DocumentConfig } from '@/types'
import { DocumentLogo } from '../DocumentLogo'

interface PackageDocumentHeaderProps {
  config: DocumentConfig
  proposalNumber?: string
}

export function PackageDocumentHeader({ config, proposalNumber }: PackageDocumentHeaderProps) {
  return (
    <header className="mb-10">
      <div className="text-center mb-6">
        <DocumentLogo src={config.companyLogoUrl} className="mb-5" />
        <p
          style={{
            fontSize: '10.5pt',
            color: '#444',
            lineHeight: 1.65,
            whiteSpace: 'pre-line',
          }}
        >
          {config.companyAddress}
        </p>
        <p style={{ fontSize: '10.5pt', color: '#444', marginTop: '0.25rem' }}>
          {config.companyPhone}
        </p>
      </div>
      {proposalNumber && (
        <p
          style={{
            textAlign: 'right',
            fontSize: '9pt',
            color: '#999',
            fontFamily: 'ui-monospace, monospace',
            marginBottom: '0.5rem',
          }}
        >
          #{proposalNumber}
        </p>
      )}
    </header>
  )
}
