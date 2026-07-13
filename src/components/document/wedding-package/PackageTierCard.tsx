import type { PackageTier } from '@/types'
import { formatCurrency } from '@/utils/format'

interface PackageTiersGridProps {
  tiers: PackageTier[]
}

const ALL_ROWS: {
  key: keyof Pick<PackageTier, 'includes' | 'coverageTeam' | 'album' | 'deliverables'>
  label: string
}[] = [
  { key: 'includes', label: 'Includes' },
  { key: 'coverageTeam', label: 'Coverage Team' },
  { key: 'album', label: 'Album' },
  { key: 'deliverables', label: 'Deliverables' },
]

function visibleRows(tiers: PackageTier[]) {
  return ALL_ROWS.filter((row) =>
    tiers.some((t) => (t[row.key] as string[])?.length > 0)
  )
}

function CellList({ items }: { items: string[] }) {
  if (!items.length) return <span className="pkg-empty">—</span>
  return (
    <ul className="pkg-cell-list">
      {items.map((item, i) => (
        <li key={i}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Comparison table: row labels on the left, packages side-by-side */
export function PackageTiersGrid({ tiers }: PackageTiersGridProps) {
  const enabled = tiers.filter((t) => t.enabled)
  if (enabled.length === 0) return null

  const rows = visibleRows(enabled)

  return (
    <div className="pkg-compare-wrap">
      <table className="pkg-compare-table">
        <thead>
          <tr>
            <th className="pkg-label-col pkg-label-header" />
            {enabled.map((tier) => (
              <th key={tier.id} className="pkg-compare-th">
                <div className="pkg-compare-name">{tier.name}</div>
                <div className="pkg-compare-price">{formatCurrency(tier.price)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pkg-label-col">Experience</td>
            {enabled.map((tier) => (
              <td key={tier.id} className="pkg-compare-td pkg-compare-subtitle">
                <em>{tier.subtitle}</em>
              </td>
            ))}
          </tr>

          {rows.map((row) => (
            <tr key={row.key}>
              <td className="pkg-label-col">{row.label}</td>
              {enabled.map((tier) => (
                <td key={tier.id} className="pkg-compare-td">
                  <CellList items={tier[row.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Single-package table (reception / contract) — label column + details column */
export function PackageTierCard({
  name,
  price,
  subtitle,
  includes,
  coverageTeam,
  album,
  deliverables,
  extraSections,
}: {
  name: string
  price: number
  subtitle?: string
  includes?: string[]
  coverageTeam?: string[]
  album?: string[]
  deliverables?: string[]
  extraSections?: { label: string; items: string[] }[]
}) {
  const rows = [
    subtitle ? { label: 'Experience', items: [subtitle], italic: true } : null,
    { label: 'Includes', items: includes ?? [] },
    { label: 'Album', items: album ?? [] },
    { label: 'Team Included', items: coverageTeam ?? [] },
    { label: 'Deliverables', items: deliverables ?? [] },
    ...(extraSections?.map((s) => ({ label: s.label, items: s.items, italic: false })) ?? []),
  ].filter((r): r is { label: string; items: string[]; italic?: boolean } =>
    Boolean(r && r.items.length > 0)
  )

  return (
    <div className="pkg-compare-wrap">
      <table className="pkg-compare-table pkg-single-table">
        <thead>
          <tr>
            <th colSpan={2} className="pkg-compare-th">
              <div className="pkg-compare-name">{name}</div>
              <div className="pkg-compare-price">{formatCurrency(price)}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="pkg-label-col">{row.label}</td>
              <td className="pkg-compare-td">
                {row.italic ? (
                  <em className="pkg-compare-subtitle">{row.items[0]}</em>
                ) : (
                  <CellList items={row.items} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
