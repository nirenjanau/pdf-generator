import { Outlet } from 'react-router-dom'
import { ContractWizardProvider } from '@/hooks/useContractWizard'

export function WizardLayout() {
  return (
    <ContractWizardProvider>
      <div className="min-h-dvh flex flex-col">
        <Outlet />
      </div>
    </ContractWizardProvider>
  )
}
