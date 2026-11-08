import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('renders the welcome heading and mascot', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /Axie Infinity Card Explorer/i }),
    ).toBeInTheDocument()
    expect(screen.getByAltText(/mascote detetive/i)).toBeInTheDocument()
  })

  it('renders all 12 cards by default', () => {
    render(<App />)
    const cards = screen.getAllByRole('button', { name: /ver detalhes de/i })
    expect(cards).toHaveLength(12)
  })

  it('filters cards by search term (case-insensitive)', () => {
    render(<App />)
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'CLOUD' } })
    const cards = screen.getAllByRole('button', { name: /ver detalhes de/i })
    expect(cards).toHaveLength(1)
    expect(screen.getByText('Cloud')).toBeInTheDocument()
  })

  it('filters cards by generation (classic)', () => {
    render(<App />)
    const classicButton = screen.getByRole('button', { name: 'Classic' })
    fireEvent.click(classicButton)
    const cards = screen.getAllByRole('button', { name: /ver detalhes de/i })
    expect(cards).toHaveLength(6)
    expect(screen.getByText('Mossy Leaf')).toBeInTheDocument()
    expect(screen.queryByText('Anemone')).not.toBeInTheDocument()
  })

  it('filters cards by generation (origin-v3)', () => {
    render(<App />)
    const originButton = screen.getByRole('button', { name: 'Origin v3' })
    fireEvent.click(originButton)
    const cards = screen.getAllByRole('button', { name: /ver detalhes de/i })
    expect(cards).toHaveLength(6)
    expect(screen.getByText('Anemone')).toBeInTheDocument()
  })

  it('shows empty state when no cards match the filter', () => {
    render(<App />)
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'zzz-not-found' } })
    expect(screen.getByText(/nenhuma carta encontrada/i)).toBeInTheDocument()
  })

  it('opens and closes the card detail modal', () => {
    render(<App />)
    const firstCard = screen.getByRole('button', { name: /ver detalhes de mossy leaf/i })
    fireEvent.click(firstCard)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Mossy Leaf')

    const closeBtn = screen.getByRole('button', { name: /fechar detalhes/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
