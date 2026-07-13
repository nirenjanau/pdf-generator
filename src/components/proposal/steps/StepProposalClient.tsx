import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus, Users } from 'lucide-react'
import { useProposalWizard } from '@/hooks/useProposalWizard'
import { useClients } from '@/hooks/useClients'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { SearchInput } from '@/components/ui/SearchInput'
import { Chip } from '@/components/ui/Chip'
import {
  defaultOverviewText,
  defaultDetailsLetter,
} from '@/services/weddingPackageTemplates'
import { buildDanceProposalContent } from '@/services/dancePackageTemplates'
import { formatDateLong } from '@/utils/format'
import type { Client, ClientFormData } from '@/types'
import type { ProposalStepProps } from './types'

interface ClientStepForm extends ClientFormData {
  greeting_name: string
  organization_name?: string
}

export function StepProposalClient({ onNext }: ProposalStepProps) {
  const { data, updateClient, updateData } = useProposalWizard()
  const isDance = data.proposal_type === 'dance'
  const { clients, search } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'new'>('search')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientStepForm>({
    defaultValues: {
      ...data.client,
      greeting_name: data.greeting_name,
      organization_name: data.organization_name ?? data.client.name,
    },
  })

  useEffect(() => {
    if (searchQuery) search(searchQuery)
  }, [searchQuery, search])

  const applyContent = (greeting: string, clientName: string, orgName?: string) => {
    if (isDance) {
      const org = orgName || clientName
      const content = buildDanceProposalContent(
        org,
        greeting,
        data.wedding_date ? formatDateLong(data.wedding_date) : ''
      )
      updateData({
        greeting_name: greeting,
        organization_name: org,
        overview_text: content.overview_text,
        details_letter: content.details_letter,
      })
    } else {
      updateData({
        greeting_name: greeting,
        overview_text: defaultOverviewText(greeting, data.events_covered),
        details_letter: defaultDetailsLetter(greeting, data.events_covered),
      })
    }
  }

  const selectClient = (client: Client) => {
    const greeting = client.groom_name?.split(' ')[0] || client.name.split(' ')[0] || client.name
    setValue('name', client.name)
    setValue('phone', client.phone)
    setValue('groom_name', client.groom_name ?? '')
    setValue('bride_name', client.bride_name ?? '')
    setValue('email', client.email ?? '')
    setValue('address', client.address ?? '')
    setValue('greeting_name', greeting)
    if (isDance) setValue('organization_name', client.name)
    updateData({ client_id: client.id })
    updateClient({
      name: client.name,
      phone: client.phone,
      groom_name: client.groom_name ?? '',
      bride_name: client.bride_name ?? '',
      email: client.email ?? '',
      address: client.address ?? '',
    })
    applyContent(greeting, client.name, client.name)
    setMode('new')
  }

  const onSubmit = (formData: ClientStepForm) => {
    const greeting = formData.greeting_name || formData.name
    const clientName = isDance ? (formData.organization_name || formData.name) : formData.name
    updateClient({
      name: clientName,
      phone: formData.phone,
      groom_name: formData.groom_name,
      bride_name: formData.bride_name,
      email: formData.email,
      address: formData.address,
    })
    applyContent(greeting, clientName, formData.organization_name)
    if (isDance) {
      updateData({ organization_name: formData.organization_name || clientName })
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-slide-up">
      <div className="flex gap-2">
        <Chip label="Search Client" selected={mode === 'search'} onClick={() => setMode('search')} />
        <Chip
          label="New Client"
          selected={mode === 'new'}
          onClick={() => {
            setMode('new')
            updateData({ client_id: undefined })
          }}
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
            <Card key={client.id} onClick={() => selectClient(client)} padding="sm">
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
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <UserPlus className="h-4 w-4" />
          {isDance ? 'School / Client Details' : 'Client Information'}
        </div>

        {isDance ? (
          <>
            <Input
              label="School / Organization Name"
              placeholder="e.g. Varshas Kalhara Dance School"
              {...register('organization_name', { required: 'Organization name is required' })}
              error={errors.organization_name?.message}
            />
            <Input
              label="Greeting (for letter)"
              placeholder="e.g. Varsha Ma'am — used in Dear Varsha Ma'am,"
              {...register('greeting_name', { required: 'Greeting is required' })}
              error={errors.greeting_name?.message}
            />
          </>
        ) : (
          <>
            <Input
              label="Client / Groom Name"
              placeholder="e.g. Ashwin"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <Input
              label="Greeting Name (for letter)"
              placeholder="e.g. Ashwin — used in Dear Ashwin,"
              {...register('greeting_name', { required: 'Greeting name is required' })}
              error={errors.greeting_name?.message}
            />
          </>
        )}

        <Input
          label="Phone"
          type="tel"
          inputMode="tel"
          placeholder="9876543210"
          {...register('phone', { required: 'Phone is required' })}
          error={errors.phone?.message}
        />
        {!isDance && <Input label="Bride Name" placeholder="Optional" {...register('bride_name')} />}
      </div>
    </form>
  )
}
