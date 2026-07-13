interface PackageSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function PackageSection({ title, children, className = '' }: PackageSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="doc-heading">{title}</h2>
      {children}
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="doc-list">
      {items.map((item, i) => (
        <li key={i}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

interface PackageBlockProps {
  label: string
  items: string[]
}

export function PackageBlock({ label, items }: PackageBlockProps) {
  if (items.length === 0) return null
  return (
    <div className="mb-3">
      <p className="doc-label">{label}:</p>
      <BulletList items={items} />
    </div>
  )
}

/** Renders multi-paragraph text with professional justified spacing */
export function PackageTextBlock({ text, justify = true }: { text: string; justify?: boolean }) {
  if (!text.trim()) return null

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className={justify ? 'doc-body' : ''}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={
            justify
              ? undefined
              : { marginBottom: '0.75em', lineHeight: 1.75, whiteSpace: 'pre-line' }
          }
        >
          {para.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
