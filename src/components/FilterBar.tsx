import { memo } from 'react'
import styles from './FilterBar.module.css'
import type { GenerationFilter } from '../types/card'

interface FilterBarProps {
  generation: GenerationFilter
  axieClass: string | null
  part: string | null
  onGenerationChange: (g: GenerationFilter) => void
  onClassChange: (c: string | null) => void
  onPartChange: (p: string | null) => void
  availableClasses: string[]
  availableParts: string[]
}

const GENERATION_OPTIONS: Array<{ value: GenerationFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'classic', label: 'Classic' },
  { value: 'origin-v3', label: 'Origin v3' },
]

function FilterBarComponent({
  generation,
  axieClass,
  part,
  onGenerationChange,
  onClassChange,
  onPartChange,
  availableClasses,
  availableParts,
}: FilterBarProps) {
  return (
    <nav className={styles.bar} aria-label="Filtros de cartas">
      <div className={styles.group}>
        <span className={styles.groupLabel}>Geração</span>
        <div className={styles.chips}>
          {GENERATION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={styles.chip}
              aria-pressed={generation === value}
              onClick={() => onGenerationChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Classe</span>
        <div className={styles.chips}>
          <button
            type="button"
            className={styles.chip}
            aria-pressed={axieClass === null}
            onClick={() => onClassChange(null)}
          >
            Todas
          </button>
          {availableClasses.map((c) => (
            <button
              key={c}
              type="button"
              className={styles.chip}
              aria-pressed={axieClass === c}
              onClick={() => onClassChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {availableParts.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Parte</span>
          <div className={styles.chips}>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={part === null}
              onClick={() => onPartChange(null)}
            >
              Todas
            </button>
            {availableParts.map((p) => (
              <button
                key={p}
                type="button"
                className={styles.chip}
                aria-pressed={part === p}
                onClick={() => onPartChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export const FilterBar = memo(FilterBarComponent)
