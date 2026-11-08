import { useMemo } from 'react'
import type { Card, SortCriteria } from '../types/card'

export function sortCards(cards: Card[], sortBy: SortCriteria): Card[] {
  const sorted = [...cards]

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))

    case 'tier': {
      return sorted.sort((a, b) => {
        if (a.tier === null) return 1
        if (b.tier === null) return -1
        return a.tier.localeCompare(b.tier)
      })
    }

    case 'hp': {
      return sorted.sort((a, b) => {
        const aHP = a.stats?.HP ?? null
        const bHP = b.stats?.HP ?? null
        if (aHP === null) return 1
        if (bHP === null) return -1
        return bHP - aHP // Decrescente: maior HP primeiro
      })
    }

    default:
      return sorted
  }
}

export function useCardSort(cards: Card[], sortBy: SortCriteria): Card[] {
  return useMemo(() => sortCards(cards, sortBy), [cards, sortBy])
}
