import { useMemo } from 'react'
import type { Card, GenerationFilter } from '../types/card'

export interface CardFilterState {
  search: string
  generation: GenerationFilter
  axieClass: string | null
  part: string | null
}

export function filterCards(
  cards: Card[],
  { search, generation, axieClass, part }: CardFilterState,
): Card[] {
  const normalizedSearch = search.trim().toLowerCase()
  return cards.filter((card) => {
    if (generation !== 'all' && card.generation !== generation) {
      return false
    }
    if (axieClass !== null && card.axieClass !== axieClass) {
      return false
    }
    if (part !== null && card.part !== part) {
      return false
    }
    if (normalizedSearch.length > 0 && !card.name.toLowerCase().includes(normalizedSearch)) {
      return false
    }
    return true
  })
}

export function useCardFilter(
  cards: Card[],
  filters: CardFilterState,
): Card[] {
  const { search, generation, axieClass, part } = filters
  return useMemo(
    () => filterCards(cards, { search, generation, axieClass, part }),
    [cards, search, generation, axieClass, part],
  )
}
