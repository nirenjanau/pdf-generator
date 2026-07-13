import type { WeddingPackageProposalData, DocumentConfig } from '@/types'
import { WeddingContractDocument } from './wedding-contract/WeddingContractDocument'
import { DanceContractDocument } from './dance-contract/DanceContractDocument'

interface ContractDocumentProps {
  data: WeddingPackageProposalData
  config?: DocumentConfig
  className?: string
  id?: string
}

export function ContractDocument({ data, config, className, id }: ContractDocumentProps) {
  if (data.proposal_type === 'dance') {
    return (
      <DanceContractDocument data={data} config={config} className={className} id={id} />
    )
  }
  return (
    <WeddingContractDocument data={data} config={config} className={className} id={id} />
  )
}
