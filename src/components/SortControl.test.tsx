import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SortControl } from './SortControl'
import type { SortCriteria } from '../types/card'

describe('SortControl', () => {
  const baseProps = {
    sortBy: 'name-asc' as SortCriteria,
    onChange: vi.fn(),
  }

  it('renders all sort options', () => {
    render(<SortControl {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Nome (A-Z)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nome (Z-A)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tier' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'HP' })).toBeInTheDocument()
  })

  it('marks the selected option with aria-pressed="true"', () => {
    render(<SortControl {...baseProps} sortBy="name-asc" />)
    expect(screen.getByRole('button', { name: 'Nome (A-Z)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Nome (Z-A)' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Tier' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'HP' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('calls onChange with name-asc when Nome (A-Z) is clicked', () => {
    const onChange = vi.fn()
    render(<SortControl {...baseProps} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Nome (A-Z)' }))
    expect(onChange).toHaveBeenCalledWith('name-asc')
  })

  it('calls onChange with name-desc when Nome (Z-A) is clicked', () => {
    const onChange = vi.fn()
    render(<SortControl {...baseProps} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Nome (Z-A)' }))
    expect(onChange).toHaveBeenCalledWith('name-desc')
  })

  it('calls onChange with tier when Tier is clicked', () => {
    const onChange = vi.fn()
    render(<SortControl {...baseProps} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tier' }))
    expect(onChange).toHaveBeenCalledWith('tier')
  })

  it('calls onChange with hp when HP is clicked', () => {
    const onChange = vi.fn()
    render(<SortControl {...baseProps} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'HP' }))
    expect(onChange).toHaveBeenCalledWith('hp')
  })

  it('updates aria-pressed when sortBy prop changes', () => {
    const { rerender } = render(<SortControl {...baseProps} sortBy="name-asc" />)
    expect(screen.getByRole('button', { name: 'Nome (A-Z)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    rerender(<SortControl {...baseProps} sortBy="hp" />)
    expect(screen.getByRole('button', { name: 'HP' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Nome (A-Z)' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
