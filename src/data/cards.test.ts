import { describe, it, expect } from 'vitest'
import cardsData from './cards.json'
import type { Card } from '../types/card'

const cards = cardsData as Card[]

describe('Cards Dataset - Classic', () => {
  const classicCards = cards.filter(card => card.generation === 'classic')

  it('deve conter pelo menos 20 cartas Classic', () => {
    expect(classicCards.length).toBeGreaterThanOrEqual(20)
  })

  it('deve ter todas as 6 classes Classic representadas', () => {
    const classes = new Set(classicCards.map(card => card.axieClass))
    
    expect(classes.has('Plant')).toBe(true)
    expect(classes.has('Bird')).toBe(true)
    expect(classes.has('Aquatic')).toBe(true)
    expect(classes.has('Bug')).toBe(true)
    expect(classes.has('Reptile')).toBe(true)
    expect(classes.has('Beast')).toBe(true)
  })

  it('cada classe deve ter pelo menos 3 cartas', () => {
    const classCounts: Record<string, number> = {}
    
    classicCards.forEach(card => {
      classCounts[card.axieClass] = (classCounts[card.axieClass] || 0) + 1
    })

    Object.values(classCounts).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(3)
    })
  })

  it('todas as cartas Classic devem ter estrutura válida', () => {
    classicCards.forEach(card => {
      // Campos obrigatórios
      expect(card.id).toBeTruthy()
      expect(card.name).toBeTruthy()
      expect(card.generation).toBe('classic')
      expect(card.axieClass).toBeTruthy()
      
      // Stats deve existir e ser válido para cartas Classic
      expect(card.stats).toBeTruthy()
      expect(card.stats).toHaveProperty('HP')
      expect(card.stats).toHaveProperty('MOV')
      expect(card.stats).toHaveProperty('ATK')
      expect(card.stats).toHaveProperty('DEF')
      
      // Skills deve ser array
      expect(Array.isArray(card.skills)).toBe(true)
    })
  })

  it('nenhuma carta Classic deve ter skills vazio', () => {
    const cardsWithEmptySkills = classicCards.filter(card => card.skills.length === 0)
    
    expect(cardsWithEmptySkills.length).toBe(0)
  })

  it('todas as cartas Classic devem ter ID único', () => {
    const ids = classicCards.map(card => card.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(classicCards.length)
  })

  it('todas as cartas Classic devem ter parte do corpo válida ou null', () => {
    const validParts = ['Horn', 'Mouth', 'Back', 'Tail', null]
    
    classicCards.forEach(card => {
      expect(validParts).toContain(card.part)
    })
  })

  it('todas as cartas Classic devem ter tier válido ou null', () => {
    const validTiers = ['A', 'B', 'C', 'S', null]
    
    classicCards.forEach(card => {
      expect(validTiers).toContain(card.tier)
    })
  })

  it('todas as cartas Classic devem ter actionType válido quando presente', () => {
    const validActionTypes = ['Melee', 'Ranged', 'Support', undefined]
    
    classicCards.forEach(card => {
      expect(validActionTypes).toContain(card.actionType)
    })
  })

  it('stats de cartas Classic devem ter valores numéricos válidos', () => {
    classicCards.forEach(card => {
      if (card.stats) {
        expect(typeof card.stats.HP).toBe('number')
        expect(typeof card.stats.MOV).toBe('number')
        expect(typeof card.stats.ATK).toBe('number')
        expect(typeof card.stats.DEF).toBe('number')
        
        // Valores não podem ser negativos
        expect(card.stats.HP).toBeGreaterThanOrEqual(0)
        expect(card.stats.MOV).toBeGreaterThanOrEqual(0)
        expect(card.stats.ATK).toBeGreaterThanOrEqual(0)
        expect(card.stats.DEF).toBeGreaterThanOrEqual(0)
      }
    })
  })

  it('distribuição por classe deve ser balanceada', () => {
    const classCounts: Record<string, number> = {}
    
    classicCards.forEach(card => {
      classCounts[card.axieClass] = (classCounts[card.axieClass] || 0) + 1
    })

    const counts = Object.values(classCounts)
    const minCount = Math.min(...counts)
    const maxCount = Math.max(...counts)
    
    // Diferença entre maior e menor não deve ser maior que 2
    expect(maxCount - minCount).toBeLessThanOrEqual(2)
  })
})

describe('Cards Dataset - Integridade Geral', () => {
  it('dataset deve conter cartas Classic e Origin v3', () => {
    const classicCount = cards.filter(c => c.generation === 'classic').length
    const originCount = cards.filter(c => c.generation === 'origin-v3').length
    
    expect(classicCount).toBeGreaterThan(0)
    expect(originCount).toBeGreaterThan(0)
  })

  it('todas as cartas devem ter ID único no dataset completo', () => {
    const ids = cards.map(card => card.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(cards.length)
  })

  it('dataset completo deve ser JSON válido e parseable', () => {
    expect(Array.isArray(cards)).toBe(true)
    expect(cards.length).toBeGreaterThan(0)
  })
})
