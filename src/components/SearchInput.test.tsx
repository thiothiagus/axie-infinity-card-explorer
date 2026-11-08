import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders with placeholder and aria-label', () => {
    render(<SearchInput value="" onChange={vi.fn()} />)
    const input = screen.getByRole('searchbox')
    expect(input).toHaveAttribute('placeholder', 'Buscar carta…')
    expect(input).toHaveAttribute('aria-label', 'Buscar carta')
  })

  it('calls onChange when the value changes', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)
    const input = screen.getByRole('searchbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'anemone' } })
    expect(onChange).toHaveBeenCalledWith('anemone')
  })

  it('shows a clear button when value is non-empty and clears it', () => {
    const onChange = vi.fn()
    render(<SearchInput value="abc" onChange={onChange} />)
    const clearBtn = screen.getByRole('button', { name: /limpar busca/i })
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('does not show a clear button when value is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} />)
    expect(
      screen.queryByRole('button', { name: /limpar busca/i }),
    ).not.toBeInTheDocument()
  })

  it('reflects the controlled value', () => {
    render(<SearchInput value="cloud" onChange={vi.fn()} />)
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('cloud')
  })
})
