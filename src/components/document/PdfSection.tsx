interface PdfSectionProps {
  children: React.ReactNode
  className?: string
}

/** Wraps a block that should stay together when exporting to PDF */
export function PdfSection({ children, className = '' }: PdfSectionProps) {
  return (
    <div data-pdf-section className={`pdf-section ${className}`}>
      {children}
    </div>
  )
}
