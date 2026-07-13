import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ContractWizardData } from '@/types'
import { defaultWizardData } from '@/services/mockData'
import { generateContractNumber } from '@/utils/format'

interface ContractWizardContextValue {
  data: ContractWizardData
  currentStep: number
  contractId?: string
  setStep: (step: number) => void
  updateData: (updates: Partial<ContractWizardData>) => void
  updateClient: (updates: Partial<ContractWizardData['client']>) => void
  updateEvent: (updates: Partial<ContractWizardData['event']>) => void
  updatePricing: (updates: Partial<ContractWizardData['pricing']>) => void
  updateSections: (updates: Partial<ContractWizardData['sections']>) => void
  reset: () => void
  loadContract: (data: ContractWizardData, id?: string) => void
}

const ContractWizardContext = createContext<ContractWizardContextValue | null>(null)

export function ContractWizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContractWizardData>(() => ({
    ...defaultWizardData,
    contract_number: generateContractNumber(),
  }))
  const [currentStep, setCurrentStep] = useState(1)
  const [contractId, setContractId] = useState<string>()

  const updateData = useCallback((updates: Partial<ContractWizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateClient = useCallback((updates: Partial<ContractWizardData['client']>) => {
    setData((prev) => ({ ...prev, client: { ...prev.client, ...updates } }))
  }, [])

  const updateEvent = useCallback((updates: Partial<ContractWizardData['event']>) => {
    setData((prev) => ({ ...prev, event: { ...prev.event, ...updates } }))
  }, [])

  const updatePricing = useCallback((updates: Partial<ContractWizardData['pricing']>) => {
    setData((prev) => ({ ...prev, pricing: { ...prev.pricing, ...updates } }))
  }, [])

  const updateSections = useCallback((updates: Partial<ContractWizardData['sections']>) => {
    setData((prev) => ({ ...prev, sections: { ...prev.sections, ...updates } }))
  }, [])

  const reset = useCallback(() => {
    setData({ ...defaultWizardData, contract_number: generateContractNumber() })
    setCurrentStep(1)
    setContractId(undefined)
  }, [])

  const loadContract = useCallback((wizardData: ContractWizardData, id?: string) => {
    setData(wizardData)
    setContractId(id)
    setCurrentStep(1)
  }, [])

  return (
    <ContractWizardContext.Provider
      value={{
        data,
        currentStep,
        contractId,
        setStep: setCurrentStep,
        updateData,
        updateClient,
        updateEvent,
        updatePricing,
        updateSections,
        reset,
        loadContract,
      }}
    >
      {children}
    </ContractWizardContext.Provider>
  )
}

export function useContractWizard() {
  const ctx = useContext(ContractWizardContext)
  if (!ctx) throw new Error('useContractWizard must be used within ContractWizardProvider')
  return ctx
}
