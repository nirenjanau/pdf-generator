import { Check } from 'lucide-react'
import { cn } from '@/utils/format'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, description, disabled }: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer touch-manipulation py-2',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          checked
            ? 'border-brand-900 bg-brand-900 text-white'
            : 'border-border bg-white hover:border-brand-400'
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug">{label}</p>
        {description && (
          <p className="text-xs text-text-muted mt-0.5 leading-snug">{description}</p>
        )}
      </div>
    </label>
  )
}

interface CheckboxGroupProps {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  hint?: string
}

export function CheckboxGroup({ label, options, selected, onChange, hint }: CheckboxGroupProps) {
  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    )
  }

  return (
    <fieldset className="space-y-1">
      <legend className="text-sm font-medium text-text-primary mb-2">{label}</legend>
      <div className="rounded-xl border border-border bg-surface-secondary/50 divide-y divide-border/60">
        {options.map((option) => (
          <div key={option} className="px-3 first:pt-0 last:pb-0">
            <Checkbox
              label={option}
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
          </div>
        ))}
      </div>
      {hint && <p className="text-xs text-text-muted mt-1.5">{hint}</p>}
    </fieldset>
  )
}
