import type { DocumentConfig } from '@/types'
import { DocumentLogo } from './DocumentLogo'

interface DocumentHeaderProps {
  config: DocumentConfig
  contractNumber?: string
}

export function DocumentHeader({ config, contractNumber }: DocumentHeaderProps) {
  return (
    <header className="border-b-2 border-gray-900 pb-4 mb-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <DocumentLogo src={config.companyLogoUrl} className="mx-0 !max-h-[72px]" />
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {config.companyName}
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">{config.companyTagline}</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600 shrink-0">
          <p>{config.companyPhone}</p>
          {config.companyEmail && <p>{config.companyEmail}</p>}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
          Wedding Quotation
        </h2>
        {contractNumber && (
          <span className="text-sm font-mono text-gray-500">#{contractNumber}</span>
        )}
      </div>
    </header>
  )
}
