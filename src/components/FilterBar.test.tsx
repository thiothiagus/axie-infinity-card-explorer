import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  const baseProps = {
    generation: 'all' as const,
    axieClass: null,
    part: null,
    onGenerationChange: vi.fn(),
    onClassChange: vi.fn(),
    onPartChange: vi.fn(),
    availableClasses: ['Plant', 'Bird', 'Aqua'],
    availableParts: [],
  }

  function getClassGroupButton(name: string): HTMLElement {
    const allGroups = screen.getAllByRole('button', { name })
    // The class group button is the one whose parent group label is "Classe"
    return allGroups.find((btn) => {
      const group = btn.closest('[class*="group"]')
      return group && group.textContent?.includes('Classe')
    })!
  }

  it('renders generation chips', () => {
    render(<FilterBar {...baseProps} />)
    // "Todas" appears in both the generation and class groups
    const todasButtons = screen.getAllByRole('button', { name: 'Todas' })
    expect(todasButtons.length).toBe(2)
    expect(screen.getByRole('button', { name: 'Classic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Origin v3' })).toBeInTheDocument()
  })

  it('calls onGenerationChange when a generation chip is clicked', () => {
    const onGenerationChange = vi.fn()
    render(
      <FilterBar {...baseProps} onGenerationChange={onGenerationChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Classic' }))
    expect(onGenerationChange).toHaveBeenCalledWith('classic')
  })

  it('calls onClassChange when a class chip is clicked', () => {
    const onClassChange = vi.fn()
    render(<FilterBar {...baseProps} onClassChange={onClassChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Plant' }))
    expect(onClassChange).toHaveBeenCalledWith('Plant')
  })

  it('calls onClassChange(null) when the class "Todas" chip is clicked', () => {
    const onClassChange = vi.fn()
    render(<FilterBar {...baseProps} onClassChange={onClassChange} />)
    const classTodas = getClassGroupButton('Todas')
    fireEvent.click(classTodas)
    expect(onClassChange).toHaveBeenCalledWith(null)
  })

  it('renders part chips only when availableParts is non-empty', () => {
    const { rerender, unmount } = render(
      <FilterBar {...baseProps} availableParts={['Ears', 'Tail']} />,
    )
    expect(screen.getByRole('button', { name: 'Ears' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tail' })).toBeInTheDocument()

    rerender(<FilterBar {...baseProps} />)
    expect(screen.queryByRole('button', { name: 'Ears' })).not.toBeInTheDocument()
    expect(screen.queryByText('Parte')).not.toBeInTheDocument()
    unmount()
  })

  it('marks the active generation chip with aria-pressed', () => {
    render(<FilterBar {...baseProps} generation="classic" />)
    expect(screen.getByRole('button', { name: 'Classic' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Origin v3' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
