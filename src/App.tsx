import { useState } from 'react'
import { SearchInput } from './components/SearchInput'
import { FilterBar } from './components/FilterBar'
import { SortControl } from './components/SortControl'
import { CardGrid } from './components/CardGrid'
import { CardDetail } from './components/CardDetail'
import { useCardFilter } from './hooks/useCardFilter'
import { useCardSort } from './hooks/useCardSort'
import { getAvailableClasses, getAvailableParts } from './utils/generation'
import type { Card, GenerationFilter, SortCriteria } from './types/card'
import cardsData from './data/cards.json'
import mascotUrl from './assets/mascote-detetive-com-lupa-e-carta.png'
import styles from './App.module.css'

const cards = cardsData as Card[]

export function App() {
  const [search, setSearch] = useState('')
  const [generation, setGeneration] = useState<GenerationFilter>('all')
  const [axieClass, setAxieClass] = useState<string | null>(null)
  const [part, setPart] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortCriteria>('name-asc')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const filteredCards = useCardFilter(cards, { search, generation, axieClass, part })
  const sortedCards = useCardSort(filteredCards, sortBy)

  const availableClasses = getAvailableClasses(generation)
  const availableParts = getAvailableParts(generation)

  const handleGenerationChange = (next: GenerationFilter) => {
    setGeneration(next)
    setAxieClass(null)
    setPart(null)
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <img src={mascotUrl} alt="Mascote detetive" className={styles.headerMascot} />
        <div>
          <h1 className={styles.title}>Axie Infinity Card Explorer</h1>
          <p className={styles.subtitle}>
            Explore cartas de <strong>Axie Classic</strong> e <strong>Axie Origin v3</strong>.
          </p>
        </div>
      </header>

      <section className={styles.controls} aria-label="Busca e filtros">
        <SearchInput value={search} onChange={setSearch} />
        <FilterBar
          generation={generation}
          axieClass={axieClass}
          part={part}
          onGenerationChange={handleGenerationChange}
          onClassChange={setAxieClass}
          onPartChange={setPart}
          availableClasses={availableClasses}
          availableParts={availableParts}
        />
        <SortControl sortBy={sortBy} onChange={setSortBy} />
      </section>

      <p className={styles.resultCount} aria-live="polite">
        {sortedCards.length} {sortedCards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
      </p>

      <CardGrid
        cards={sortedCards}
        onCardClick={setSelectedCard}
        mascotUrl={mascotUrl}
      />

      {selectedCard && (
        <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </main>
  )
}
