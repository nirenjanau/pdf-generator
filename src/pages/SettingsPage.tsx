import { useState } from 'react'
import { Settings, FileText, Database } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { defaultAppSettings } from '@/services/mockData'
import { isSupabaseConfigured } from '@/supabase/client'
import type { TableColumnKey } from '@/types'

export function SettingsPage() {
  const [columns, setColumns] = useState(defaultAppSettings.documentConfig.tableColumns)

  const toggleColumn = (key: TableColumnKey) => {
    setColumns((cols) =>
      cols.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    )
  }

  return (
    <>
      <PageHeader title="Settings" />

      <div className="px-4 py-4 space-y-6 max-w-lg mx-auto">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Connection
            </h2>
          </div>
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <span className="text-sm">Supabase</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isSupabaseConfigured
                  ? 'bg-green-50 text-success'
                  : 'bg-amber-50 text-warning'
              }`}>
                {isSupabaseConfigured ? 'Connected' : 'Using mock data'}
              </span>
            </div>
            {!isSupabaseConfigured && (
              <p className="text-xs text-text-muted mt-2">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect.
              </p>
            )}
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Table Columns
            </h2>
          </div>
          <Card className="divide-y divide-border">
            {columns.map((col) => (
              <div key={col.key} className="py-3 first:pt-0 last:pb-0">
                <Toggle
                  label={col.label}
                  checked={col.visible}
                  onChange={() => toggleColumn(col.key)}
                />
              </div>
            ))}
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4 text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Company Info
            </h2>
          </div>
          <Card padding="sm" className="space-y-1 text-sm">
            <p className="font-semibold">{defaultAppSettings.documentConfig.companyName}</p>
            <p className="text-text-secondary">{defaultAppSettings.documentConfig.companyTagline}</p>
            <p className="text-text-muted">{defaultAppSettings.documentConfig.companyPhone}</p>
            <p className="text-text-muted">{defaultAppSettings.documentConfig.companyEmail}</p>
          </Card>
        </section>

        <p className="text-xs text-text-muted text-center pb-4">
          Bhavana Studio v1.0.0 · PWA enabled
        </p>
      </div>
    </>
  )
}
