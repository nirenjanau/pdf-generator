/** Predefined package options — selected items appear as rows in the PDF table */

export const INCLUDES_OPTIONS = [
  'Temple Wedding',
  'Wedding Hall / Function',
  'Wedding Function Coverage',
  'Pre Wedding',
  'Reception',
  'Mehendi / Haldi',
  'Sangeet / Engagement',
  'Save The Date Shoot',
] as const

export const INCLUDES_OTHER_LABEL = 'Other'

export const COVERAGE_TEAM_OPTIONS = [
  'Still Photographer',
  'Traditional Videographer',
  'Candid Photographer',
  'Candid Videographer',
  'Candid Videographer 2',
  'Candid Photographer 2',
] as const

export const ALBUM_TYPE_OPTIONS = [
  'Premium Pearl Finish Album',
  'Classic NT HD Album',
  'Standard NT Album',
] as const

export const DELIVERABLE_OPTIONS = [
  'Pen drive',
  'Google Drive',
  'Album',
  'Laminated Photo',
  'Pendrive with final files',
  'Highlight Video',
  'Full Coverage Video',
  'Family Book / Mini Book',
  'Table Calendar',
  'Google Drive access',
] as const

export const ALL_CATALOG_OPTIONS = [
  ...INCLUDES_OPTIONS,
  ...COVERAGE_TEAM_OPTIONS,
  ...ALBUM_TYPE_OPTIONS,
  ...DELIVERABLE_OPTIONS,
] as const

export function toggleCatalogOption(selected: string[], option: string): string[] {
  return selected.includes(option)
    ? selected.filter((item) => item !== option)
    : [...selected, option]
}

export function isCatalogOptionSelected(selected: string[], option: string): boolean {
  return selected.includes(option)
}

/** Album rows = selected pages + selected types */
export function buildAlbumSelection(pages: string[], types: string[]): string[] {
  return [...pages, ...types]
}

export function splitAlbumSelection(album: string[]): {
  pages: string[]
  types: string[]
} {
  const typeSet = new Set<string>(ALBUM_TYPE_OPTIONS)

  return {
    pages: album.filter((item) => !typeSet.has(item)),
    types: album.filter((item) => typeSet.has(item)),
  }
}

export function formatAlbumPagesInput(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^\d+$/.test(trimmed)) return `${trimmed} pages`
  return trimmed
}

export function hasAlbumSelection(album: string[]): boolean {
  return album.some((item) => item.trim().length > 0)
}

export function splitIncludesSelection(includes: string[]): {
  catalog: string[]
  custom: string
} {
  const catalogSet = new Set<string>(INCLUDES_OPTIONS)
  const catalog = includes.filter((item) => catalogSet.has(item))
  const custom = includes.filter((item) => !catalogSet.has(item)).join(', ')
  return { catalog, custom }
}

export function buildIncludesSelection(catalog: string[], custom: string, includeOther: boolean): string[] {
  const items = [...catalog]
  if (includeOther && custom.trim()) {
    items.push(custom.trim())
  }
  return items
}

/** --- Dance programme packages --- */

export const DANCE_INCLUDES_OPTIONS = [
  'Makeup Session Coverage',
  'Promo Video',
  'Pre-Performance Photo Shoot',
  'Stage Performance Coverage',
  'Backstage & Candid Moments',
  'Stage Reel 1',
  'Stage Reel 2',
  'Stage Reel 3',
  'Stage Reel 4',
] as const

export const DANCE_COVERAGE_TEAM_OPTIONS = [
  'Photographer',
  'Candid Photographer',
  'Videographer',
  'Candid Videographer',
  'Candid Videographer 2',
  'Assistant Photographer',
  'Two Videographers (Two-Camera Setup)',
] as const

export const DANCE_DELIVERABLE_OPTIONS = [
  'Promo Video',
  'Performance Video',
  'Full Performance Video',
  'Professionally Edited Photos',
  'Google Drive Access to All Final Files',
  'Pendrive with final files',
  'Lamination',
  'Album',
  'Highlight Video',
  'Stage Reel 1',
  'Stage Reel 2',
  'Stage Reel 3',
  'Stage Reel 4',
] as const

export function splitDanceIncludesSelection(includes: string[]): {
  catalog: string[]
  custom: string
} {
  const catalogSet = new Set<string>(DANCE_INCLUDES_OPTIONS)
  const catalog = includes.filter((item) => catalogSet.has(item))
  const custom = includes.filter((item) => !catalogSet.has(item)).join(', ')
  return { catalog, custom }
}

export function buildDanceIncludesSelection(
  catalog: string[],
  custom: string,
  includeOther: boolean
): string[] {
  const items = [...catalog]
  if (includeOther && custom.trim()) {
    items.push(custom.trim())
  }
  return items
}
