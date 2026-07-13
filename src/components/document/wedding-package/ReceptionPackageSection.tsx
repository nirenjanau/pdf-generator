import type { ReceptionPackageData } from '@/types'
import { PackageTierCard } from './PackageTierCard'
import { PackageTextBlock } from './PackageSection'

interface ReceptionPackageSectionProps {
  reception: ReceptionPackageData
}

export function ReceptionPackageSection({ reception }: ReceptionPackageSectionProps) {
  if (!reception.enabled) return null

  return (
    <section className="mb-8">
      <h2 className="doc-heading">Reception Package</h2>

      <PackageTierCard
        name={reception.name}
        price={reception.price}
        subtitle={reception.subtitle}
        includes={reception.includes}
        coverageTeam={reception.coverageTeam}
        album={reception.album}
        deliverables={reception.deliverables}
        extraSections={[
          { label: 'Package Inclusions', items: reception.packageInclusions },
        ]}
      />

      {reception.additionalInfo && (
        <div className="mt-5">
          <h3 className="doc-label" style={{ fontSize: '11pt', marginBottom: '0.5rem' }}>
            Additional Reception Information
          </h3>
          <PackageTextBlock text={reception.additionalInfo} />
        </div>
      )}
    </section>
  )
}
