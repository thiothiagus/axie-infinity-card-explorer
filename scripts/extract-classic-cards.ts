#!/usr/bin/env tsx
/**
 * Script auxiliar para extração manual de cartas Axie Classic
 * Fonte: Card Explorer oficial (https://classic.axieinfinity.com/explorer/cards)
 * 
 * Template da estrutura Card para facilitar transcrição
 */

import type { Card } from '../src/types/card'

// Template para transcrição manual
const cardTemplate: Card = {
  id: 'axie-classic-{class}-{name-slug}',
  name: 'Card Name',
  generation: 'classic',
  axieClass: 'Plant', // Plant | Bird | Aquatic | Bug | Reptile | Beast
  part: 'Horn', // Horn | Mouth | Back | Tail | null
  tier: 'B', // A | B | C | S | null
  image: null, // sem assets nesta task
  stats: {
    HP: 0,
    MOV: 0,
    ATK: 0,
    DEF: 0
  },
  skills: [
    'Descrição textual da habilidade'
  ],
  description: 'Descrição da carta (opcional)',
  energyCost: 1, // custo de energia (opcional)
  actionType: 'Melee' // Melee | Ranged | Support (opcional)
}

// Exemplo de carta real extraída
const exampleCard: Card = {
  id: 'axie-classic-plant-pumpkin',
  name: 'Pumpkin',
  generation: 'classic',
  axieClass: 'Plant',
  part: 'Back',
  tier: 'B',
  image: null,
  stats: {
    HP: 0,
    MOV: 0,
    ATK: 80,
    DEF: 15
  },
  skills: [
    'Apply 2 Stun to target if combo count is 4 or more'
  ],
  description: 'Stuns target with high combo count',
  energyCost: 1,
  actionType: 'Melee'
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Axie Classic Card Extraction Helper

Uso: npx tsx scripts/extract-classic-cards.ts [options]

Estrutura da carta:
${JSON.stringify(cardTemplate, null, 2)}

Exemplo de carta real:
${JSON.stringify(exampleCard, null, 2)}

Instruções:
1. Acesse https://classic.axieinfinity.com/explorer/cards
2. Filtre por classe (Plant, Bird, Aquatic, Bug, Reptile, Beast)
3. Para cada carta, transcreva os dados seguindo o template
4. Salve em scripts/cards-raw.json
5. Execute normalização com scripts/normalize-cards.ts

Campos obrigatórios:
  - id: formato "axie-classic-{class}-{name-slug}"
  - name: nome da carta (exatamente como no Explorer)
  - generation: sempre "classic"
  - axieClass: uma das 6 classes
  - part: parte do corpo (Horn/Mouth/Back/Tail) ou null
  - stats: {HP, MOV, ATK, DEF}

Campos opcionais:
  - tier: A/B/C/S ou null
  - image: null nesta task
  - skills: array de descrições textuais
  - description: descrição resumida
  - energyCost: custo de energia
  - actionType: Melee/Ranged/Support
`)
    process.exit(0)
  }
  
  console.log('Template de carta disponível. Use --help para instruções completas.')
}

main()
