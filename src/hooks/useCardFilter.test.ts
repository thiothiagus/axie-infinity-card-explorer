import { describe, it, expect } from 'vitest'
import { filterCards } from './useCardFilter'
import type { Card } from '../types/card'

const mockCards: Card[] = [
  {
    id: '1',
    name: 'Anemone',
    generation: 'classic',
    axieClass: 'Plant',
    part: 'Horn',
    tier: 'S',
    image: null,
  },
  {
    id: '2',
    name: 'Bug Signal',
    generation: 'classic',
    axieClass: 'Bug',
    part: 'Back',
    tier: 'A',
    image: null,
  },
  {
    id: '3',
    name: 'Cloud Nine',
    generation: 'origin',
    axieClass: 'Bird',
    part: 'Tail',
    tier: 'S',
    image: null,
  },
  {
    id: '4',
    name: 'Risky Fish',
    generation: 'origin',
    axieClass: 'Aqua',
    part: 'Eyes',
    tier: 'B',
    image: null,
  },
]

describe('filterCards', () => {
  describe('generation filter', () => {
    it('returns all cards when generation is "all"', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(4)
    })

    it('returns only classic cards when generation is "classic"', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'classic',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(2)
      expect(result.every((card) => card.generation === 'classic')).toBe(true)
    })

    it('returns only origin cards when generation is "origin"', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'origin',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(2)
      expect(result.every((card) => card.generation === 'origin')).toBe(true)
    })
  })

  describe('axieClass filter', () => {
    it('returns all cards when axieClass is null', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(4)
    })

    it('returns only cards of specified class', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: 'Plant',
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.axieClass).toBe('Plant')
    })
  })

  describe('part filter', () => {
    it('returns all cards when part is null', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(4)
    })

    it('returns only cards with specified part', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: null,
        part: 'Horn',
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.part).toBe('Horn')
    })
  })

  describe('search filter', () => {
    it('returns all cards when search is empty', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(4)
    })

    it('filters cards by name case-insensitively', () => {
      const result = filterCards(mockCards, {
        search: 'bug',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('Bug Signal')
    })

    it('filters cards by partial name match', () => {
      const result = filterCards(mockCards, {
        search: 'fish',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('Risky Fish')
    })

    it('trims search input', () => {
      const result = filterCards(mockCards, {
        search: '  cloud  ',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('Cloud Nine')
    })
  })

  describe('combined filters', () => {
    it('applies generation and axieClass filters together', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'classic',
        axieClass: 'Bug',
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.generation).toBe('classic')
      expect(result[0]?.axieClass).toBe('Bug')
    })

    it('applies search and generation filters together', () => {
      const result = filterCards(mockCards, {
        search: 'fish',
        generation: 'origin',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.name).toBe('Risky Fish')
    })

    it('applies all filters together', () => {
      const result = filterCards(mockCards, {
        search: 'anemone',
        generation: 'classic',
        axieClass: 'Plant',
        part: 'Horn',
      })
      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe('1')
    })

    it('returns empty array when no cards match combined filters', () => {
      const result = filterCards(mockCards, {
        search: '',
        generation: 'classic',
        axieClass: 'Aqua',
        part: null,
      })
      expect(result).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('handles empty card array', () => {
      const result = filterCards([], {
        search: '',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(0)
    })

    it('handles search with only spaces', () => {
      const result = filterCards(mockCards, {
        search: '   ',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(4)
    })

    it('returns empty array when search matches nothing', () => {
      const result = filterCards(mockCards, {
        search: 'nonexistent',
        generation: 'all',
        axieClass: null,
        part: null,
      })
      expect(result).toHaveLength(0)
    })
  })
})
