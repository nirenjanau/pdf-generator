import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ProposalType, WeddingPackageProposalData } from '@/types'
import { createDefaultProposalDataForType } from '@/services/proposalTemplates'
import { generateProposalNumber, generateContractNumber } from '@/utils/format'

interface ProposalWizardContextValue {
  data: WeddingPackageProposalData
  currentStep: number
  proposalId?: string
  setStep: (step: number) => void
  updateData: (updates: Partial<WeddingPackageProposalData>) => void
  updateClient: (updates: Partial<WeddingPackageProposalData['client']>) => void
  reset: (type?: ProposalType, documentType?: 'proposal' | 'contract') => void
  loadProposal: (data: WeddingPackageProposalData, id?: string) => void
}

const ProposalWizardContext = createContext<ProposalWizardContextValue | null>(null)

export function ProposalWizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WeddingPackageProposalData>(() => ({
    ...createDefaultProposalDataForType('wedding'),
    proposal_number: generateProposalNumber(),
  }))
  const [currentStep, setCurrentStep] = useState(1)
  const [proposalId, setProposalId] = useState<string>()

  const updateData = useCallback((updates: Partial<WeddingPackageProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateClient = useCallback((updates: Partial<WeddingPackageProposalData['client']>) => {
    setData((prev) => ({ ...prev, client: { ...prev.client, ...updates } }))
  }, [])

  const reset = useCallback((type: ProposalType = 'wedding', documentType: 'proposal' | 'contract' = 'proposal') => {
    setData({
      ...createDefaultProposalDataForType(type, documentType),
      proposal_number:
        documentType === 'contract' ? generateContractNumber() : generateProposalNumber(),
    })
    setCurrentStep(1)
    setProposalId(undefined)
  }, [])

  const loadProposal = useCallback((proposalData: WeddingPackageProposalData, id?: string) => {
    setData(proposalData)
    setProposalId(id)
    setCurrentStep(1)
  }, [])

  return (
    <ProposalWizardContext.Provider
      value={{
        data,
        currentStep,
        proposalId,
        setStep: setCurrentStep,
        updateData,
        updateClient,
        reset,
        loadProposal,
      }}
    >
      {children}
    </ProposalWizardContext.Provider>
  )
}

export function useProposalWizard() {
  const ctx = useContext(ProposalWizardContext)
  if (!ctx) throw new Error('useProposalWizard must be used within ProposalWizardProvider')
  return ctx
}
