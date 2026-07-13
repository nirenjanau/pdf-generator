import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { WizardLayout } from '@/layouts/WizardLayout'
import { ProposalWizardLayout } from '@/layouts/ProposalWizardLayout'
import { HomePage } from '@/pages/HomePage'
import { ContractsPage } from '@/pages/ContractsPage'
import { ContractDetailPage } from '@/pages/ContractDetailPage'
import { ContractWizardPage } from '@/pages/ContractWizardPage'
import { NewContractPage } from '@/pages/NewContractPage'
import { WeddingContractWizardPage } from '@/pages/WeddingContractWizardPage'
import { DanceContractWizardPage } from '@/pages/DanceContractWizardPage'
import { ProposalsPage } from '@/pages/ProposalsPage'
import { NewProposalPage } from '@/pages/NewProposalPage'
import { ProposalWizardPage } from '@/pages/ProposalWizardPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { PackagesPage } from '@/pages/PackagesPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="contracts/:id" element={<ContractDetailPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route element={<WizardLayout />}>
          <Route path="contracts/new" element={<NewContractPage />} />
          <Route path="contracts/new/quotation" element={<ContractWizardPage />} />
        </Route>

        <Route element={<ProposalWizardLayout />}>
          <Route path="proposals/new" element={<NewProposalPage />} />
          <Route path="proposals/new/:type" element={<ProposalWizardPage />} />
          <Route path="proposals/:id/edit" element={<ProposalWizardPage />} />
          <Route path="contracts/new/wedding" element={<WeddingContractWizardPage />} />
          <Route path="contracts/wedding/:id/edit" element={<WeddingContractWizardPage />} />
          <Route path="contracts/new/dance" element={<DanceContractWizardPage />} />
          <Route path="contracts/dance/:id/edit" element={<DanceContractWizardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
