/** Common wedding events — pick only what applies to this client */
export const WEDDING_EVENT_OPTIONS = [
  { id: 'temple', label: 'Temple Wedding' },
  { id: 'hall', label: 'Wedding at Hall / Venue' },
  { id: 'reception', label: 'Reception' },
  { id: 'prewed', label: 'Pre-wedding Shoot' },
  { id: 'save_date', label: 'Save The Date Shoot' },
  { id: 'mehendi', label: 'Mehendi / Haldi' },
  { id: 'sangeet', label: 'Sangeet / Engagement' },
] as const

const EVENT_LABEL_TO_INCLUDE: Record<string, string> = {
  'Temple Wedding': 'Temple Wedding',
  'Wedding at Hall / Venue': 'Wedding Hall / Function',
  'Reception': 'Reception',
  'Pre-wedding Shoot': 'Pre Wedding',
  'Save The Date Shoot': 'Save The Date Shoot',
  'Mehendi / Haldi': 'Mehendi / Haldi',
  'Sangeet / Engagement': 'Sangeet / Engagement',
}

const KNOWN_EVENT_LABELS = new Set<string>(WEDDING_EVENT_OPTIONS.map((o) => o.label))

export function formatEventList(events: string[]): string {
  if (events.length === 0) return 'your wedding celebrations'
  if (events.length === 1) return events[0]
  return `${events.slice(0, -1).join(', ')}, and ${events[events.length - 1]}`
}

export function hasReceptionEvent(events: string[]): boolean {
  return events.some((e) => e.toLowerCase().includes('reception'))
}

export function hasPreWeddingEvent(events: string[]): boolean {
  return events.some(
    (e) =>
      e.toLowerCase().includes('pre-wedding') ||
      e.toLowerCase().includes('pre wedding') ||
      e.toLowerCase().includes('save the date')
  )
}

/** Build default "Includes" checkboxes for wedding tiers based on selected events */
export function buildWeddingIncludesLine(events: string[]): string[] {
  const includes: string[] = []

  for (const event of events) {
    const mapped = EVENT_LABEL_TO_INCLUDE[event]
    if (mapped) {
      if (!includes.includes(mapped)) includes.push(mapped)
    } else if (!KNOWN_EVENT_LABELS.has(event) && !includes.includes(event)) {
      includes.push(event)
    }
  }

  return includes.length > 0 ? includes : ['Wedding Function Coverage']
}

export function applyEventsToWeddingTiers(
  tiers: import('@/types').PackageTier[],
  events: string[]
): import('@/types').PackageTier[] {
  const includesLine = buildWeddingIncludesLine(events)
  return tiers.map((t) => ({ ...t, includes: [...includesLine] }))
}
