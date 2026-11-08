import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardGrid } from './CardGrid'
import type { Card } from '../types/card'

const mockCards: Card[] = [
  {
    id: 'c1',
    name: 'Mossy Leaf',
    generation: 'classic',
    axieClass: 'Plant',
    part: null,
    tier: 'B',
    image: null,
    stats: { HP: 15, MOV: 5, ATK: 5, DEF: 5 },
    skills: [],
  },
  {
    id: 'c2',
    name: 'Anemone',
    generation: 'origin-v3',
    axieClass: 'Aqua',
    part: 'Tail',
    tier: 'A',
    image: 'anemone',
    stats: null,
    skills: [],
  },
]

describe('CardGrid', () => {
  it('renders one card per item', () => {
    render(<CardGrid cards={mockCards} onCardClick={vi.fn()} mascotUrl="" />)
    const cards = screen.getAllByRole('button', { name: /ver detalhes de/i })
    expect(cards).toHaveLength(2)
  })

  it('shows empty state when no cards', () => {
    render(<CardGrid cards={[]} onCardClick={vi.fn()} mascotUrl="" />)
    expect(screen.getByText(/nenhuma carta encontrada/i)).toBeInTheDocument()
  })

  it('calls onCardClick when a card is clicked', () => {
    const onClick = vi.fn()
    render(<CardGrid cards={mockCards} onCardClick={onClick} mascotUrl="" />)
    const firstCard = screen.getByRole('button', { name: /ver detalhes de mossy leaf/i })
    fireEvent.click(firstCard)
    expect(onClick).toHaveBeenCalledWith(mockCards[0])
  })
})
