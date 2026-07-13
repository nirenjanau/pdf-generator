import { useState } from 'react'
import { Plus, Users, Phone, Mail } from 'lucide-react'
import { PageHeader, EmptyState, Button } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useClients } from '@/hooks/useClients'
import { clientService } from '@/services/clientService'

export function ClientsPage() {
  const { clients, loading, refetch, search } = useClients()
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', bride_name: '', groom_name: '',
  })

  const handleSearch = (q: string) => {
    setQuery(q)
    search(q)
  }

  const handleCreate = async () => {
    if (!form.name || !form.phone) return
    await clientService.create(form)
    setForm({ name: '', phone: '', email: '', address: '', bride_name: '', groom_name: '' })
    setShowForm(false)
    refetch()
  }

  return (
    <>
      <PageHeader
        title="Clients"
        action={
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <SearchInput value={query} onChange={handleSearch} placeholder="Search clients..." />

        {showForm && (
          <Card className="space-y-3 animate-slide-up">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Bride" value={form.bride_name} onChange={(e) => setForm({ ...form, bride_name: e.target.value })} />
              <Input label="Groom" value={form.groom_name} onChange={(e) => setForm({ ...form, groom_name: e.target.value })} />
            </div>
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleCreate} className="flex-1">Save</Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-900 border-t-transparent" />
          </div>
        ) : clients.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="No clients yet"
            description="Add your first client to get started"
          />
        ) : (
          clients.map((client) => (
            <Card key={client.id} padding="sm" className="mb-2">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-brand-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{client.name}</p>
                  {(client.bride_name || client.groom_name) && (
                    <p className="text-sm text-text-secondary">
                      {[client.bride_name, client.groom_name].filter(Boolean).join(' & ')}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</span>
                    {client.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</span>}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
