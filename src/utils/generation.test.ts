import { describe, it, expect } from 'vitest'
import { getAvailableClasses, getAvailableParts } from './generation'

describe('getAvailableClasses', () => {
  it('returns union of all classes when generation is "all"', () => {
    const result = getAvailableClasses('all')
    expect(result.length).toBeGreaterThan(0)
    // Should contain classes from both generations without duplicates
    expect(new Set(result).size).toBe(result.length)
    // Check for known classes from both generations
    expect(result).toContain('Plant')
    expect(result).toContain('Aqua')
  })

  it('returns only classic classes when generation is "classic"', () => {
    const result = getAvailableClasses('classic')
    expect(result.length).toBeGreaterThan(0)
    // Classic generation has classes like Plant, Bird, Aquatic, Bug, Reptile, Beast
    expect(result).toContain('Plant')
    expect(result).toContain('Bird')
    expect(result).toContain('Aquatic')
    // Should not contain Origin-only classes like "Aqua"
    expect(result).not.toContain('Aqua')
  })

  it('returns only origin classes when generation is "origin-v3"', () => {
    const result = getAvailableClasses('origin-v3')
    expect(result.length).toBeGreaterThan(0)
    // Origin generation has classes like Aqua, Beast, Bird, Bug, Plant, Reptile
    expect(result).toContain('Aqua')
    expect(result).toContain('Beast')
    // Should not contain Classic-only classes like "Aquatic"
    expect(result).not.toContain('Aquatic')
  })

  it('returns empty array for invalid generation', () => {
    // @ts-expect-error Testing invalid input
    const result = getAvailableClasses('invalid')
    expect(result).toEqual([])
  })

  it('returns consistent results on multiple calls', () => {
    const result1 = getAvailableClasses('classic')
    const result2 = getAvailableClasses('classic')
    expect(result1).toEqual(result2)
  })
})

describe('getAvailableParts', () => {
  it('returns union of all parts when generation is "all"', () => {
    const result = getAvailableParts('all')
    expect(result.length).toBeGreaterThan(0)
    // Should contain parts from both generations without duplicates
    expect(new Set(result).size).toBe(result.length)
    // Check for known parts from both generations
    expect(result).toContain('Horn')
    expect(result).toContain('Mouth')
  })

  it('returns only classic parts when generation is "classic"', () => {
    const result = getAvailableParts('classic')
    expect(result).toEqual([])
    // Classic generation currently has no parts in the data
  })

  it('returns only origin parts when generation is "origin-v3"', () => {
    const result = getAvailableParts('origin-v3')
    expect(result.length).toBeGreaterThan(0)
    // Origin generation has parts like Ears, Eyes, Tail, Horn, Mouth, Back
    expect(result).toContain('Ears')
    expect(result).toContain('Eyes')
    expect(result).toContain('Tail')
    expect(result).toContain('Horn')
    expect(result).toContain('Mouth')
    expect(result).toContain('Back')
  })

  it('returns empty array for invalid generation', () => {
    // @ts-expect-error Testing invalid input
    const result = getAvailableParts('invalid')
    expect(result).toEqual([])
  })

  it('returns consistent results on multiple calls', () => {
    const result1 = getAvailableParts('origin-v3')
    const result2 = getAvailableParts('origin-v3')
    expect(result1).toEqual(result2)
  })
})

describe('getAvailableClasses and getAvailableParts integration', () => {
  it('all generation includes items from both classic and origin', () => {
    const allClasses = getAvailableClasses('all')
    const classicClasses = getAvailableClasses('classic')
    const originClasses = getAvailableClasses('origin')

    // All should include at least what's in classic and origin
    classicClasses.forEach((cls) => {
      expect(allClasses).toContain(cls)
    })
    originClasses.forEach((cls) => {
      expect(allClasses).toContain(cls)
    })

    const allParts = getAvailableParts('all')
    const classicParts = getAvailableParts('classic')
    const originParts = getAvailableParts('origin')

    classicParts.forEach((part) => {
      expect(allParts).toContain(part)
    })
    originParts.forEach((part) => {
      expect(allParts).toContain(part)
    })
  })
})
