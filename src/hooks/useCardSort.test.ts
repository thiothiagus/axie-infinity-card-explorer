import { describe, it, expect } from 'vitest'
import { sortCards } from './useCardSort'
import type { Card } from '../types/card'

const mockCards: Card[] = [
  {
    id: '1',
    name: 'Zebra Card',
    generation: 'classic',
    axieClass: 'Plant',
    part: 'Horn',
    tier: 'A',
    image: null,
    stats: { HP: 50, MOV: 2, ATK: 10, DEF: 5 },
    skills: [],
  },
  {
    id: '2',
    name: 'Alpha Card',
    generation: 'classic',
    axieClass: 'Bug',
    part: 'Back',
    tier: 'S',
    image: null,
    stats: { HP: 100, MOV: 3, ATK: 15, DEF: 8 },
    skills: [],
  },
  {
    id: '3',
    name: 'Beta Card',
    generation: 'origin-v3',
    axieClass: 'Bird',
    part: 'Tail',
    tier: null,
    image: null,
    stats: null,
    skills: [],
  },
  {
    id: '4',
    name: 'Gamma Card',
    generation: 'origin-v3',
    axieClass: 'Aqua',
    part: 'Eyes',
    tier: 'B',
    image: null,
    stats: { HP: 75, MOV: 4, ATK: 12, DEF: 6 },
    skills: [],
  },
]

describe('sortCards', () => {
  describe('name-asc', () => {
    it('sorts cards alphabetically in ascending order', () => {
      const result = sortCards(mockCards, 'name-asc')
      expect(result).toHaveLength(4)
      expect(result[0]?.name).toBe('Alpha Card')
      expect(result[1]?.name).toBe('Beta Card')
      expect(result[2]?.name).toBe('Gamma Card')
      expect(result[3]?.name).toBe('Zebra Card')
    })

    it('does not mutate the original array', () => {
      const original = [...mockCards]
      sortCards(mockCards, 'name-asc')
      expect(mockCards).toEqual(original)
    })
  })

  describe('name-desc', () => {
    it('sorts cards alphabetically in descending order', () => {
      const result = sortCards(mockCards, 'name-desc')
      expect(result).toHaveLength(4)
      expect(result[0]?.name).toBe('Zebra Card')
      expect(result[1]?.name).toBe('Gamma Card')
      expect(result[2]?.name).toBe('Beta Card')
      expect(result[3]?.name).toBe('Alpha Card')
    })
  })

  describe('tier', () => {
    it('sorts cards by tier alphabetically', () => {
      const result = sortCards(mockCards, 'tier')
      expect(result).toHaveLength(4)
      expect(result[0]?.tier).toBe('A')
      expect(result[1]?.tier).toBe('B')
      expect(result[2]?.tier).toBe('S')
      expect(result[3]?.tier).toBe(null)
    })

    it('places cards with null tier at the end', () => {
      const result = sortCards(mockCards, 'tier')
      const lastCard = result[result.length - 1]
      expect(lastCard?.tier).toBe(null)
      expect(lastCard?.name).toBe('Beta Card')
    })
  })

  describe('hp', () => {
    it('sorts cards by HP in descending order', () => {
      const result = sortCards(mockCards, 'hp')
      expect(result).toHaveLength(4)
      expect(result[0]?.stats?.HP).toBe(100)
      expect(result[1]?.stats?.HP).toBe(75)
      expect(result[2]?.stats?.HP).toBe(50)
      expect(result[3]?.stats).toBe(null)
    })

    it('places cards with null stats at the end', () => {
      const result = sortCards(mockCards, 'hp')
      const lastCard = result[result.length - 1]
      expect(lastCard?.stats).toBe(null)
      expect(lastCard?.name).toBe('Beta Card')
    })
  })

  describe('edge cases', () => {
    it('handles empty array', () => {
      const result = sortCards([], 'name-asc')
      expect(result).toHaveLength(0)
    })

    it('handles single card', () => {
      const singleCard = [mockCards[0]!]
      const result = sortCards(singleCard, 'name-asc')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(singleCard[0])
    })

    it('maintains relative order for equal values (stable sort)', () => {
      const cardsWithSameTier: Card[] = [
        { ...mockCards[0]!, id: 'a', name: 'First A', tier: 'A' },
        { ...mockCards[0]!, id: 'b', name: 'Second A', tier: 'A' },
        { ...mockCards[0]!, id: 'c', name: 'Third A', tier: 'A' },
      ]
      const result = sortCards(cardsWithSameTier, 'tier')
      expect(result[0]?.id).toBe('a')
      expect(result[1]?.id).toBe('b')
      expect(result[2]?.id).toBe('c')
    })

    it('handles all cards with null tier', () => {
      const cardsWithoutTier: Card[] = mockCards.map((c) => ({ ...c, tier: null }))
      const result = sortCards(cardsWithoutTier, 'tier')
      expect(result).toHaveLength(4)
      expect(result.every((c) => c.tier === null)).toBe(true)
    })

    it('handles all cards with null stats', () => {
      const cardsWithoutStats: Card[] = mockCards.map((c) => ({ ...c, stats: null }))
      const result = sortCards(cardsWithoutStats, 'hp')
      expect(result).toHaveLength(4)
      expect(result.every((c) => c.stats === null)).toBe(true)
    })
  })
})
