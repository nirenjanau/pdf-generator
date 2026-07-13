import { Link } from 'react-router-dom'
import { Heart, Music2, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'

export function NewContractPage() {
  return (
    <>
      <PageHeader title="New Contract" subtitle="Choose contract type" backTo="/" />

      <div className="px-4 py-6 space-y-4 max-w-lg mx-auto animate-slide-up">
        <p className="text-sm text-text-secondary">
          Contracts confirm the agreed package, payment received, and delivery details for your
          client.
        </p>

        <Link to="/contracts/new/wedding">
          <Card padding="md" className="mb-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                <Heart className="h-7 w-7 text-brand-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Wedding Contract</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Confirmed package, payment & delivery details
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/contracts/new/dance">
          <Card padding="md" className="mb-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                <Music2 className="h-7 w-7 text-brand-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dance Performance Contract</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Programme coverage, advance received & delivery detail
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/contracts/new/quotation">
          <Card padding="md">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-surface-secondary flex items-center justify-center shrink-0">
                <FileText className="h-7 w-7 text-text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Simple Quotation</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Service list with pricing (legacy contract wizard)
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </>
  )
}
