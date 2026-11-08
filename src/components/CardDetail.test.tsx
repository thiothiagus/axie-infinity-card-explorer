import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardDetail } from './CardDetail'
import type { Card } from '../types/card'

const mockCard: Card = {
  id: 'c1',
  name: 'Mossy Leaf',
  generation: 'classic',
  axieClass: 'Plant',
  part: null,
  tier: 'B',
  image: null,
  stats: { HP: 15, MOV: 5, ATK: 5, DEF: 5 },
  skills: ['Grow', 'Sustain'],
}

const mockCardNoDetails: Card = {
  id: 'c2',
  name: 'Anemone',
  generation: 'origin-v3',
  axieClass: 'Aqua',
  part: 'Tail',
  tier: 'A',
  image: 'anemone',
  stats: null,
  skills: [],
}

describe('CardDetail', () => {
  it('renders a dialog with the card name', () => {
    render(<CardDetail card={mockCard} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName('Mossy Leaf')
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<CardDetail card={mockCard} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /fechar detalhes/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<CardDetail card={mockCard} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the overlay is clicked (but not the dialog)', () => {
    const onClose = vi.fn()
    render(<CardDetail card={mockCard} onClose={onClose} />)
    const overlay = screen.getByRole('dialog').parentElement!
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows stats when they exist', () => {
    render(<CardDetail card={mockCard} onClose={vi.fn()} />)
    expect(screen.getByText('HP').nextElementSibling).toHaveTextContent('15')
    expect(screen.getByText('ATK').nextElementSibling).toHaveTextContent('5')
  })

  it('shows the "no details" message when stats and skills are absent', () => {
    render(<CardDetail card={mockCardNoDetails} onClose={vi.fn()} />)
    expect(
      screen.getByText(/detalhes completos ainda não disponíveis/i),
    ).toBeInTheDocument()
  })

  it('lists skills when they exist', () => {
    render(<CardDetail card={mockCard} onClose={vi.fn()} />)
    expect(screen.getByText('Grow')).toBeInTheDocument()
    expect(screen.getByText('Sustain')).toBeInTheDocument()
  })
})
