export type Generation = 'classic' | 'origin-v3'

export interface Stats {
  HP: number
  MOV: number
  ATK: number
  DEF: number
}

export interface Card {
  id: string
  name: string
  generation: Generation
  axieClass: string
  part: string | null
  tier: string | null
  image: string | null
  stats: Stats | null
  skills: string[]
  description?: string
  energyCost?: number
  actionType?: 'Melee' | 'Ranged' | 'Support'
}

export type GenerationFilter = 'all' | Generation

export type SortCriteria = 'name-asc' | 'name-desc' | 'tier' | 'hp'
