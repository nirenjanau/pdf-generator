function SectionBlock({ title, content }: { title: string; content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="mb-6">
      <h4 className="doc-heading" style={{ fontSize: '11pt' }}>
        {title}
      </h4>
      <div className="doc-body">
        {paragraphs.map((para, i) => (
          <p key={i}>
            {para.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  )
}

export function DocumentDeliverables({ content }: { content: string }) {
  return <SectionBlock title="Deliverables" content={content} />
}

export function DocumentAlbumDetails({ content }: { content: string }) {
  return <SectionBlock title="Album Details" content={content} />
}

export function DocumentTerms({ content }: { content: string }) {
  return <SectionBlock title="Terms & Conditions" content={content} />
}

export function DocumentNotes({ content }: { content: string }) {
  return <SectionBlock title="Notes" content={content} />
}
