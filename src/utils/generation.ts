import type { GenerationFilter } from '../types/card'
import classesData from '../data/classes.json'
import partsData from '../data/parts.json'

const classesByGeneration = classesData as Array<{
  generation: string
  classes: string[]
}>

const partsByGeneration = partsData as Array<{
  generation: string
  parts: string[]
}>

export function getAvailableClasses(generation: GenerationFilter): string[] {
  if (generation === 'all') {
    return [...new Set(classesByGeneration.flatMap((entry) => entry.classes))]
  }
  const entry = classesByGeneration.find((e) => e.generation === generation)
  return entry ? entry.classes : []
}

export function getAvailableParts(generation: GenerationFilter): string[] {
  if (generation === 'all') {
    return [...new Set(partsByGeneration.flatMap((entry) => entry.parts))]
  }
  const entry = partsByGeneration.find((e) => e.generation === generation)
  return entry ? entry.parts : []
}
