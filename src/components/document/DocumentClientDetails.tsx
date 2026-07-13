import type { ClientFormData } from '@/types'

export function DocumentClientDetails({ client }: { client: ClientFormData }) {
  return (
    <section className="mb-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Client Details
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <div><span className="text-gray-500">Name:</span> {client.name}</div>
        <div><span className="text-gray-500">Phone:</span> {client.phone}</div>
        {client.bride_name && (
          <div><span className="text-gray-500">Bride:</span> {client.bride_name}</div>
        )}
        {client.groom_name && (
          <div><span className="text-gray-500">Groom:</span> {client.groom_name}</div>
        )}
        {client.email && (
          <div><span className="text-gray-500">Email:</span> {client.email}</div>
        )}
        {client.address && (
          <div className="col-span-2"><span className="text-gray-500">Address:</span> {client.address}</div>
        )}
      </div>
    </section>
  )
}
