import { memo } from 'react'
import styles from './SortControl.module.css'
import type { SortCriteria } from '../types/card'

interface SortControlProps {
  sortBy: SortCriteria
  onChange: (sortBy: SortCriteria) => void
}

const SORT_OPTIONS: Array<{ value: SortCriteria; label: string }> = [
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' },
  { value: 'tier', label: 'Tier' },
  { value: 'hp', label: 'HP' },
]

function SortControlComponent({ sortBy, onChange }: SortControlProps) {
  return (
    <nav className={styles.bar} aria-label="Ordenação de cartas">
      <div className={styles.group}>
        <span className={styles.groupLabel}>Ordenar por</span>
        <div className={styles.chips}>
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={styles.chip}
              aria-pressed={sortBy === value}
              onClick={() => onChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export const SortControl = memo(SortControlComponent)
