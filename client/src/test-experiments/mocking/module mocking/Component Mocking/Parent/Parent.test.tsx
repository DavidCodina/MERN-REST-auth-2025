import { render, screen } from '@testing-library/react'
import { Parent } from './'

// This example is intended to demonstrate how one can mock a React
// component within another React component.

// Naive Approach:
// vi.mock('../Child', () => ({ Child: vi.fn().mockReturnValue(<div>Mock Child</div>) }))

vi.mock('../Child', async (importOriginal) => {
  const originalModule: any = await importOriginal()
  return {
    ...originalModule,
    Child: vi.fn().mockReturnValue(<div>Mock Child</div>)
  }
})

describe('Parent...', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not contain actual <Child/>.', () => {
    render(<Parent />)

    const parentText = screen.getByText(/this is the parent/i)
    expect(parentText).toBeInTheDocument()

    const mockChildText = screen.getByText(/mock child/i)
    expect(mockChildText).toBeInTheDocument()

    const childText = screen.queryByText(/this is the child/i)
    expect(childText).not.toBeInTheDocument()
  })
})
