import { Link } from 'react-router-dom'
import { Heart, Music2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'

export function NewProposalPage() {
  return (
    <>
      <PageHeader title="New Package" subtitle="Choose event type" backTo="/" />

      <div className="px-4 py-6 space-y-4 max-w-lg mx-auto animate-slide-up">
        <p className="text-sm text-text-secondary">
          Select the type of package you want to create. Wedding and Dance use different templates.
        </p>

        <Link to="/proposals/new/wedding">
          <Card padding="md" className="mb-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                <Heart className="h-7 w-7 text-brand-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Wedding</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Classic & Premium collections, reception package
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/proposals/new/dance">
          <Card padding="md">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                <Music2 className="h-7 w-7 text-brand-900" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dance</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  Stage performance, reels, dance programme coverage
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </>
  )
}
