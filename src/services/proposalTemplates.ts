import type { ProposalType, WeddingPackageProposalData } from '@/types'
import { createDefaultProposalData, createDefaultContractData } from './weddingPackageTemplates'
import { createDefaultDanceProposalData, createDefaultDanceContractData } from './dancePackageTemplates'

export function createDefaultProposalDataForType(
  type: ProposalType,
  documentType: 'proposal' | 'contract' = 'proposal'
): WeddingPackageProposalData {
  if (documentType === 'contract' && type === 'wedding') {
    return createDefaultContractData()
  }
  if (documentType === 'contract' && type === 'dance') {
    return createDefaultDanceContractData()
  }
  return type === 'dance' ? createDefaultDanceProposalData() : createDefaultProposalData()
}

export function contractTypeLabel(type: ProposalType): string {
  return type === 'dance' ? 'Dance Contract' : 'Wedding Contract'
}

export function proposalTypeLabel(type: ProposalType): string {
  return type === 'dance' ? 'Dance Package' : 'Wedding Package'
}
