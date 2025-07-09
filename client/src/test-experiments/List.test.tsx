import { render, screen, within } from '@testing-library/react'

/* ======================
        List
====================== */

const List = ({ items }: { items?: string[] }) => {
  if (!items || !Array.isArray(items)) {
    return null
  }

  return (
    <ul className='list-disc'>
      {items.map((item, index) => {
        return (
          <li key={index} className='font-bold'>
            {item}
          </li>
        )
      })}
    </ul>
  )
}

/* ========================================================================
                                Tests   
======================================================================== */

describe('List...', () => {
  test('should be in document.', () => {
    // const { container } = render(<List items={[]}  />)
    // const list = container.querySelector('ul') // eslint-disable-line
    render(<List items={[]} />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument() // Note: typing '.tbi' will suggest toBeInTheDocument.
  })

  /* ======================

  ====================== */

  test('should not be in the document (i.e., null).', () => {
    const { container } = render(<List />)
    const list = screen.queryByRole('list')
    // expect(list).toBe(null) // eslint-disable-line
    // expect(list).toBeNull() // eslint-disable-line
    expect(list).not.toBeInTheDocument()
    // This is also a way of inferring that nothing was rendered,
    // since the expected output will be <div />
    expect(container).toBeEmptyDOMElement()
  })

  /* ======================

  ====================== */

  test('should be a list with three list items.', () => {
    render(<List items={['a', 'b', 'c']} />)

    // You could do this...
    // const listItems = screen.getAllByRole('listitem')
    // expect(listItems).toHaveLength(3)

    // But here's another way:
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    // Get all list items within the list and check there are the expected number.
    const listItems = within(list).getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })

  /* ======================

  ====================== */

  test("should be a list with second item of 'Item 2'.", () => {
    const items = ['Item 1', 'Item 2', 'Item 3']
    render(<List items={items} />)
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[1]).toHaveTextContent(items[1] as string)
  })

  /* ======================

  ====================== */

  test(`should have a third <li> with a class of 'font-bold' `, () => {
    render(<List items={['w', 'x', 'y', 'z']} />)
    const listItems = screen.getAllByRole('listitem')
    expect(listItems[2]).toHaveClass('font-bold')
  })
})
