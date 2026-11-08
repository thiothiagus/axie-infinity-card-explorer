import { memo } from 'react'
import styles from './CardGrid.module.css'
import { Card } from './Card'
import type { Card as CardType } from '../types/card'

interface CardGridProps {
  cards: CardType[]
  onCardClick: (card: CardType) => void
  mascotUrl: string
}

function CardGridComponent({ cards, onCardClick, mascotUrl }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className={styles.empty}>
        <img src={mascotUrl} alt="Mascote detetive" className={styles.mascot} />
        <p className={styles.emptyText}>Nenhuma carta encontrada</p>
      </div>
    )
  }

  return (
    <div className={styles.grid} role="list" aria-label="Cartas">
      {cards.map((card) => (
        <div key={card.id} role="listitem">
          <Card card={card} onClick={() => onCardClick(card)} />
        </div>
      ))}
    </div>
  )
}

export const CardGrid = memo(CardGridComponent)
