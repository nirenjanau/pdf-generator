import { Outlet } from 'react-router-dom'
import { ProposalWizardProvider } from '@/hooks/useProposalWizard'

export function ProposalWizardLayout() {
  return (
    <ProposalWizardProvider>
      <div className="min-h-dvh flex flex-col">
        <Outlet />
      </div>
    </ProposalWizardProvider>
  )
}
