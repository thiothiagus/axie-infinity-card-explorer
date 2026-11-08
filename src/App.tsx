import { useState } from 'react'
import { SearchInput } from './components/SearchInput'
import { FilterBar } from './components/FilterBar'
import { CardGrid } from './components/CardGrid'
import { CardDetail } from './components/CardDetail'
import { useCardFilter } from './hooks/useCardFilter'
import type { Card, GenerationFilter } from './types/card'
import cardsData from './data/cards.json'
import classesData from './data/classes.json'
import partsData from './data/parts.json'
import mascotUrl from './assets/mascote-detetive-com-lupa-e-carta.png'
import styles from './App.module.css'

const cards = cardsData as Card[]
const classesByGeneration = classesData as Array<{
  generation: string
  classes: string[]
}>
const partsByGeneration = partsData as Array<{
  generation: string
  parts: string[]
}>

function getAvailableClasses(generation: GenerationFilter): string[] {
  if (generation === 'all') {
    return [...new Set(classesByGeneration.flatMap((entry) => entry.classes))]
  }
  const entry = classesByGeneration.find((e) => e.generation === generation)
  return entry ? entry.classes : []
}

function getAvailableParts(generation: GenerationFilter): string[] {
  if (generation === 'all') {
    return [...new Set(partsByGeneration.flatMap((entry) => entry.parts))]
  }
  const entry = partsByGeneration.find((e) => e.generation === generation)
  return entry ? entry.parts : []
}

export function App() {
  const [search, setSearch] = useState('')
  const [generation, setGeneration] = useState<GenerationFilter>('all')
  const [axieClass, setAxieClass] = useState<string | null>(null)
  const [part, setPart] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const filteredCards = useCardFilter(cards, { search, generation, axieClass, part })

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
      </section>

      <p className={styles.resultCount} aria-live="polite">
        {filteredCards.length} {filteredCards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
      </p>

      <CardGrid
        cards={filteredCards}
        onCardClick={setSelectedCard}
        mascotUrl={mascotUrl}
      />

      {selectedCard && (
        <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </main>
  )
}
