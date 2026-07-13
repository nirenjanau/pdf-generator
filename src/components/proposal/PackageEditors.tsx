import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Checkbox, CheckboxGroup } from '@/components/ui/Checkbox'
import {
  ALBUM_TYPE_OPTIONS,
  COVERAGE_TEAM_OPTIONS,
  DELIVERABLE_OPTIONS,
  DANCE_COVERAGE_TEAM_OPTIONS,
  DANCE_DELIVERABLE_OPTIONS,
  DANCE_INCLUDES_OPTIONS,
  INCLUDES_OPTIONS,
  INCLUDES_OTHER_LABEL,
  buildAlbumSelection,
  buildDanceIncludesSelection,
  buildIncludesSelection,
  formatAlbumPagesInput,
  splitAlbumSelection,
  splitDanceIncludesSelection,
  splitIncludesSelection,
} from '@/services/packageOptionCatalog'

export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function listToLines(items: string[]): string {
  return items.join('\n')
}

interface PackageListEditorProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  rows?: number
  hint?: string
}

/** Edit a package table row — one item per line (album pages, team, deliverables, etc.) */
export function PackageListEditor({
  label,
  items,
  onChange,
  placeholder,
  rows = 4,
  hint,
}: PackageListEditorProps) {
  return (
    <div>
      <Textarea
        label={label}
        rows={rows}
        value={listToLines(items)}
        onChange={(e) => onChange(linesToList(e.target.value))}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  )
}

interface PackageCheckboxGroupProps {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (items: string[]) => void
  hint?: string
}

/** Multi-select checkboxes — each checked item becomes a row in the PDF table */
export function PackageCheckboxGroup({
  label,
  options,
  selected,
  onChange,
  hint = 'Checked items are added to the package table in the PDF',
}: PackageCheckboxGroupProps) {
  return (
    <CheckboxGroup
      label={label}
      options={options}
      selected={selected}
      onChange={onChange}
      hint={hint}
    />
  )
}

interface IncludesCheckboxEditorProps {
  includes: string[]
  onChange: (includes: string[]) => void
}

/** Includes section: event/location checkboxes + optional custom "Other" text */
export function IncludesCheckboxEditor({ includes, onChange }: IncludesCheckboxEditorProps) {
  const { catalog, custom } = splitIncludesSelection(includes)
  const [otherChecked, setOtherChecked] = useState(() => custom.length > 0)
  const [otherText, setOtherText] = useState(custom)

  useEffect(() => {
    if (custom) {
      setOtherChecked(true)
      setOtherText(custom)
    }
  }, [custom])

  const commit = (nextCatalog: string[], nextOther: string, nextOtherChecked: boolean) => {
    onChange(buildIncludesSelection(nextCatalog, nextOther, nextOtherChecked))
  }

  return (
    <div className="space-y-3">
      <PackageCheckboxGroup
        label="Includes"
        options={INCLUDES_OPTIONS}
        selected={catalog}
        onChange={(nextCatalog) => commit(nextCatalog, otherText, otherChecked)}
      />

      <div className="space-y-2">
        <Checkbox
          label={INCLUDES_OTHER_LABEL}
          description="Add a custom inclusion not listed above"
          checked={otherChecked}
          onChange={(checked) => {
            setOtherChecked(checked)
            commit(catalog, otherText, checked)
          }}
        />
        {otherChecked && (
          <Input
            label="Other (custom)"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            onBlur={() => commit(catalog, otherText, otherChecked)}
            placeholder="Type custom inclusion..."
          />
        )}
      </div>
    </div>
  )
}

interface DanceIncludesCheckboxEditorProps {
  includes: string[]
  onChange: (includes: string[]) => void
}

/** Dance includes — programme coverage checkboxes + optional Other */
export function DanceIncludesCheckboxEditor({ includes, onChange }: DanceIncludesCheckboxEditorProps) {
  const { catalog, custom } = splitDanceIncludesSelection(includes)
  const [otherChecked, setOtherChecked] = useState(() => custom.length > 0)
  const [otherText, setOtherText] = useState(custom)

  useEffect(() => {
    if (custom) {
      setOtherChecked(true)
      setOtherText(custom)
    }
  }, [custom])

  const commit = (nextCatalog: string[], nextOther: string, nextOtherChecked: boolean) => {
    onChange(buildDanceIncludesSelection(nextCatalog, nextOther, nextOtherChecked))
  }

  return (
    <div className="space-y-3">
      <PackageCheckboxGroup
        label="Includes"
        options={DANCE_INCLUDES_OPTIONS}
        selected={catalog}
        onChange={(nextCatalog) => commit(nextCatalog, otherText, otherChecked)}
      />

      <div className="space-y-2">
        <Checkbox
          label={INCLUDES_OTHER_LABEL}
          description="Add a custom inclusion not listed above"
          checked={otherChecked}
          onChange={(checked) => {
            setOtherChecked(checked)
            commit(catalog, otherText, checked)
          }}
        />
        {otherChecked && (
          <Input
            label="Other (custom)"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            onBlur={() => commit(catalog, otherText, otherChecked)}
            placeholder="Type custom inclusion..."
          />
        )}
      </div>
    </div>
  )
}

interface AlbumCheckboxEditorProps {
  album: string[]
  onChange: (album: string[]) => void
}

/** Album section: include toggle, custom pages input, album type checkboxes */
export function AlbumCheckboxEditor({ album, onChange }: AlbumCheckboxEditorProps) {
  const { pages, types } = splitAlbumSelection(album)
  const [includeAlbum, setIncludeAlbum] = useState(() => pages.length > 0 || types.length > 0)
  const [pagesInput, setPagesInput] = useState(pages[0] ?? '')

  useEffect(() => {
    if (pages.length > 0 || types.length > 0) {
      setIncludeAlbum(true)
    }
  }, [pages.length, types.length])

  useEffect(() => {
    setPagesInput(pages[0] ?? '')
  }, [pages[0]])

  const updatePages = (nextPages: string[]) => {
    onChange(buildAlbumSelection(nextPages, types))
  }

  const updateTypes = (nextTypes: string[]) => {
    onChange(buildAlbumSelection(pages, nextTypes))
  }

  const commitPages = (value: string) => {
    const formatted = formatAlbumPagesInput(value)
    updatePages(formatted ? [formatted] : [])
    setPagesInput(formatted || value.trim())
  }

  return (
    <div className="space-y-3">
      <Checkbox
        label="Include Album"
        description="Show album details in the package table"
        checked={includeAlbum}
        onChange={(checked) => {
          setIncludeAlbum(checked)
          if (!checked) {
            setPagesInput('')
            onChange([])
          }
        }}
      />

      {includeAlbum && (
        <div className="space-y-4 pl-1 border-l-2 border-brand-200 ml-1">
          <Input
            label="Number of Pages"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            onBlur={() => commitPages(pagesInput)}
            placeholder="e.g. 120 pages"
            inputMode="text"
          />
          <p className="text-xs text-text-muted -mt-2">
            Type any page count — e.g. 120, 120 pages, or 150 pages (Premium)
          </p>
          <PackageCheckboxGroup
            label="Album Type"
            options={ALBUM_TYPE_OPTIONS}
            selected={types}
            onChange={updateTypes}
          />
        </div>
      )}
    </div>
  )
}

export const WEDDING_CHECKBOX_FIELDS = {
  coverageTeam: { label: 'Coverage Team', options: COVERAGE_TEAM_OPTIONS },
  deliverables: { label: 'Deliverables', options: DELIVERABLE_OPTIONS },
} as const

export const RECEPTION_CHECKBOX_FIELDS = {
  coverageTeam: { label: 'Coverage Team', options: COVERAGE_TEAM_OPTIONS },
  deliverables: { label: 'Deliverables', options: DELIVERABLE_OPTIONS },
} as const

export const DANCE_CHECKBOX_FIELDS = {
  coverageTeam: { label: 'Coverage Team', options: DANCE_COVERAGE_TEAM_OPTIONS },
  deliverables: { label: 'Deliverables', options: DANCE_DELIVERABLE_OPTIONS },
} as const

export const RECEPTION_PACKAGE_FIELDS = [
  { key: 'includes' as const, label: 'Includes', rows: 2 },
  { key: 'coverageTeam' as const, label: 'Coverage Team', rows: 4 },
  { key: 'album' as const, label: 'Album', rows: 2 },
  { key: 'deliverables' as const, label: 'Deliverables', rows: 4 },
  { key: 'packageInclusions' as const, label: 'Package Inclusions', rows: 4 },
]

interface PackageNameFieldsProps {
  name: string
  subtitle: string
  onNameChange: (name: string) => void
  onSubtitleChange: (subtitle: string) => void
}

export function PackageNameFields({
  name,
  subtitle,
  onNameChange,
  onSubtitleChange,
}: PackageNameFieldsProps) {
  return (
    <div className="grid gap-3">
      <Input
        label="Package Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="e.g. Classic Collection"
      />
      <Input
        label="Subtitle / Tagline"
        value={subtitle}
        onChange={(e) => onSubtitleChange(e.target.value)}
        placeholder="e.g. Complete Wedding Storytelling Experience"
      />
    </div>
  )
}
