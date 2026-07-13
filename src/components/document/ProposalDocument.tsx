import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { WeddingPackageDocument } from './wedding-package/WeddingPackageDocument'
import { DancePackageDocument } from './DancePackageDocument'

interface ProposalDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

export function ProposalDocument({ data, config, className, id }: ProposalDocumentProps) {
  if (data.proposal_type === 'dance') {
    return <DancePackageDocument data={data} config={config} className={className} id={id} />
  }
  return <WeddingPackageDocument data={data} config={config} className={className} id={id} />
}

export { DancePackageDocument } from './DancePackageDocument'
