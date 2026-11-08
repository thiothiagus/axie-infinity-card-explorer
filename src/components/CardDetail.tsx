import { useEffect, memo } from 'react'
import styles from './CardDetail.module.css'
import type { Card } from '../types/card'

interface CardDetailProps {
  card: Card
  onClose: () => void
}

function CardDetailComponent({ card, onClose }: CardDetailProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={styles.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={styles.title} className={styles.title}>
            {card.name}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar detalhes"
          >
            ×
          </button>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.badge}>
            {card.generation === 'classic' ? 'Axie Classic' : 'Axie Origin v3'}
          </span>
          <span className={styles.badge}>{card.axieClass}</span>
          {card.part && <span className={styles.badge}>{card.part}</span>}
          <span className={styles.tierBadge} aria-label={`Tier ${card.tier}`}>
            Tier {card.tier}
          </span>
        </div>

        {card.stats && (
          <dl className={styles.stats}>
            <div>
              <dt>HP</dt>
              <dd>{card.stats.HP}</dd>
            </div>
            <div>
              <dt>MOV</dt>
              <dd>{card.stats.MOV}</dd>
            </div>
            <div>
              <dt>ATK</dt>
              <dd>{card.stats.ATK}</dd>
            </div>
            <div>
              <dt>DEF</dt>
              <dd>{card.stats.DEF}</dd>
            </div>
          </dl>
        )}

        {card.skills.length > 0 && (
          <div className={styles.skills}>
            <h3 className={styles.sectionTitle}>Skills</h3>
            <ul>
              {card.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {card.stats === null && card.skills.length === 0 && (
          <p className={styles.noDetails}>
            Detalhes completos ainda não disponíveis — os dados desta carta
            serão expandidos quando o dataset for completado.
          </p>
        )}
      </div>
    </div>
  )
}

export const CardDetail = memo(CardDetailComponent)
