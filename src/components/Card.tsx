import { memo } from 'react'
import styles from './Card.module.css'
import type { Card as CardType } from '../types/card'

const CLASS_COLORS: Record<string, string> = {
  Plant: 'var(--color-plant)',
  Bird: 'var(--color-bird)',
  Aquatic: 'var(--color-aquatic)',
  Bug: 'var(--color-bug)',
  Reptile: 'var(--color-reptile)',
  Beast: 'var(--color-beast)',
  Aqua: 'var(--color-aqua)',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase())
    .slice(0, 2)
    .join('')
}

function getClassColor(axieClass: string): string {
  return CLASS_COLORS[axieClass] ?? '#888'
}

interface CardProps {
  card: CardType
  onClick: () => void
}

function CardComponent({ card, onClick }: CardProps) {
  const classColor = getClassColor(card.axieClass)

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Ver detalhes de ${card.name}`}
    >
      <div
        className={styles.imageArea}
        style={{ borderColor: classColor }}
        role="img"
        aria-label={card.image ? `Carta ${card.name}` : `Placeholder da carta ${card.name}`}
      >
        {card.image ? (
          <span className={styles.imageLabel}>{card.image}</span>
        ) : (
          <span className={styles.initials} style={{ color: classColor }}>
            {getInitials(card.name)}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{card.name}</h3>
          <span
            className={styles.tier}
            aria-label={`Tier ${card.tier}`}
            style={{ borderColor: classColor, color: classColor }}
          >
            {card.tier}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.generation}>{card.generation === 'classic' ? 'Classic' : 'Origin v3'}</span>
          <span
            className={styles.class}
            style={{ color: classColor }}
          >
            {card.axieClass}
          </span>
          {card.part && <span className={styles.part}>{card.part}</span>}
        </div>
      </div>
    </button>
  )
}

export const Card = memo(CardComponent)
