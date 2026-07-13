import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus, Users } from 'lucide-react'
import { useContractWizard } from '@/hooks/useContractWizard'
import { useClients } from '@/hooks/useClients'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { SearchInput } from '@/components/ui/SearchInput'
import { Chip } from '@/components/ui/Chip'
import type { Client, ClientFormData } from '@/types'
import type { WizardStepProps } from './types'

export function StepClient({ onNext }: WizardStepProps) {
  const { data, updateClient, updateData } = useContractWizard()
  const { clients, search } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'new'>(data.client_id ? 'search' : 'search')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: data.client,
  })

  useEffect(() => {
    if (searchQuery) search(searchQuery)
  }, [searchQuery, search])

  const selectClient = (client: Client) => {
    setSelectedClient(client)
    setValue('name', client.name)
    setValue('phone', client.phone)
    setValue('bride_name', client.bride_name ?? '')
    setValue('groom_name', client.groom_name ?? '')
    setValue('email', client.email ?? '')
    setValue('address', client.address ?? '')
    updateData({ client_id: client.id })
    updateClient({
      name: client.name,
      phone: client.phone,
      bride_name: client.bride_name ?? '',
      groom_name: client.groom_name ?? '',
      email: client.email ?? '',
      address: client.address ?? '',
    })
    setMode('new')
  }

  const onSubmit = (formData: ClientFormData) => {
    updateClient(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-slide-up">
      <div className="flex gap-2">
        <Chip
          label="Search Client"
          selected={mode === 'search'}
          onClick={() => setMode('search')}
        />
        <Chip
          label="New Client"
          selected={mode === 'new'}
          onClick={() => { setMode('new'); setSelectedClient(null); updateData({ client_id: undefined }) }}
        />
      </div>

      {mode === 'search' && (
        <div className="space-y-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or phone..."
          />
          {clients.slice(0, 5).map((client) => (
            <Card
              key={client.id}
              onClick={() => selectClient(client)}
              selected={selectedClient?.id === client.id}
              padding="sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-brand-900" />
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-text-secondary">{client.phone}</p>
                </div>
              </div>
            </Card>
          ))}
          {clients.length === 0 && searchQuery && (
            <p className="text-sm text-text-muted text-center py-4">No clients found</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <UserPlus className="h-4 w-4" />
          Client Information
        </div>

        <Input
          label="Client Name"
          placeholder="e.g. Priya & Arjun"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
        <Input
          label="Phone"
          type="tel"
          inputMode="tel"
          placeholder="9876543210"
          {...register('phone', { required: 'Phone is required' })}
          error={errors.phone?.message}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bride Name"
            placeholder="Bride"
            {...register('bride_name', { required: 'Required' })}
            error={errors.bride_name?.message}
          />
          <Input
            label="Groom Name"
            placeholder="Groom"
            {...register('groom_name', { required: 'Required' })}
            error={errors.groom_name?.message}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="Optional"
          {...register('email')}
        />
        <Input
          label="Address"
          placeholder="Optional"
          {...register('address')}
        />
      </div>
    </form>
  )
}
