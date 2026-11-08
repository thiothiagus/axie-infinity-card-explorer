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
  tier: string
  image: string | null
  stats: Stats | null
  skills: string[]
}

export type GenerationFilter = 'all' | Generation
