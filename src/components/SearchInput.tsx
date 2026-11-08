import { memo } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function SearchInputComponent({ value, onChange, label = 'Buscar carta' }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder="Buscar carta…"
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
    </div>
  )
}

export const SearchInput = memo(SearchInputComponent)
