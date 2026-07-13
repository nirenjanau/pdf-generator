import type { DocumentConfig } from '@/types'

export function DocumentFooter({ config }: { config: DocumentConfig }) {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
      <p>{config.companyName} · {config.companyAddress}</p>
      <p className="mt-1">{config.companyPhone} · {config.companyEmail}</p>
      <p className="mt-2 text-gray-400">Thank you for choosing us to capture your special day.</p>
    </footer>
  )
}
