import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, getInitials, getClassColor } from './Card'
import type { Card as CardType } from '../types/card'

describe('getInitials', () => {
  it('returns single initial for one-word name', () => {
    expect(getInitials('Anemone')).toBe('A')
  })

  it('returns initials for two-word name', () => {
    expect(getInitials('Pumpkin Head')).toBe('PH')
  })

  it('returns only first 2 initials for names with more than 2 words', () => {
    expect(getInitials('Big Red Dragon')).toBe('BR')
  })

  it('returns empty string for empty name', () => {
    expect(getInitials('')).toBe('')
  })

  it('handles extra spaces correctly', () => {
    expect(getInitials('  Cloud   Nine  ')).toBe('CN')
  })

  it('converts initials to uppercase', () => {
    expect(getInitials('bug signal')).toBe('BS')
  })

  it('handles single letter words', () => {
    expect(getInitials('A B C')).toBe('AB')
  })

  it('filters out empty strings from multiple spaces', () => {
    expect(getInitials('First  Second')).toBe('FS')
  })
})

describe('getClassColor', () => {
  it('returns correct color for Plant class', () => {
    expect(getClassColor('Plant')).toBe('var(--color-plant)')
  })

  it('returns correct color for Bird class', () => {
    expect(getClassColor('Bird')).toBe('var(--color-bird)')
  })

  it('returns correct color for Aquatic class', () => {
    expect(getClassColor('Aquatic')).toBe('var(--color-aquatic)')
  })

  it('returns correct color for Bug class', () => {
    expect(getClassColor('Bug')).toBe('var(--color-bug)')
  })

  it('returns correct color for Reptile class', () => {
    expect(getClassColor('Reptile')).toBe('var(--color-reptile)')
  })

  it('returns correct color for Beast class', () => {
    expect(getClassColor('Beast')).toBe('var(--color-beast)')
  })

  it('returns correct color for Aqua class', () => {
    expect(getClassColor('Aqua')).toBe('var(--color-aqua)')
  })

  it('returns fallback color for unknown class', () => {
    expect(getClassColor('Unknown')).toBe('#888')
  })
})

describe('Card component', () => {
  const mockCard: CardType = {
    id: 'test-1',
    name: 'Test Card',
    generation: 'classic',
    axieClass: 'Plant',
    part: 'Horn',
    tier: 'S',
    image: null,
  }

  it('renders card with initials when no image is provided', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('TC')).toBeInTheDocument()
  })

  it('renders card with image label when image is provided', () => {
    const cardWithImage = { ...mockCard, image: 'test-image.png' }
    render(<Card card={cardWithImage} onClick={vi.fn()} />)
    expect(screen.getByText('test-image.png')).toBeInTheDocument()
  })

  it('renders card name', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  it('renders card tier', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('S')).toBeInTheDocument()
  })

  it('renders card generation as Classic', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('Classic')).toBeInTheDocument()
  })

  it('renders card generation as Origin v3 for origin cards', () => {
    const originCard = { ...mockCard, generation: 'origin' as const }
    render(<Card card={originCard} onClick={vi.fn()} />)
    expect(screen.getByText('Origin v3')).toBeInTheDocument()
  })

  it('renders card class', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('Plant')).toBeInTheDocument()
  })

  it('renders card part when provided', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByText('Horn')).toBeInTheDocument()
  })

  it('has correct aria-label for card button', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Ver detalhes de Test Card')
  })

  it('has correct aria-label for image area with image', () => {
    const cardWithImage = { ...mockCard, image: 'test-image.png' }
    render(<Card card={cardWithImage} onClick={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Carta Test Card')
  })

  it('has correct aria-label for image area with placeholder', () => {
    render(<Card card={mockCard} onClick={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Placeholder da carta Test Card')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Card card={mockCard} onClick={onClick} />)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
