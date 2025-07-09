import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveclass
// toHaveClass(...classNames: string[], options?: {exact: boolean})
//
// This allows you to check whether the given element has certain classes within
// its class attribute. You must provide at least one class, unless you are asserting
// that an element does not have any classes.
//
// The list of class names may include strings and regular expressions.
// Regular expressions are matched against each individual class in the target element,
// and it is NOT matched against its full class attribute value as whole.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveClass...', () => {
  test('should pass', () => {
    render(
      <>
        <button data-testid='delete-button' className='btn extra btn-danger'>
          Delete item
        </button>
        <button data-testid='no-classes'>No Classes</button>
      </>
    )

    const deleteButton = screen.getByTestId('delete-button')
    const noClasses = screen.getByTestId('no-classes')

    expect(deleteButton).toHaveClass('extra')
    expect(deleteButton).toHaveClass('btn-danger btn')
    expect(deleteButton).toHaveClass(/danger/, 'btn')
    expect(deleteButton).toHaveClass('btn-danger', 'btn')
    expect(deleteButton).not.toHaveClass('btn-link')
    expect(deleteButton).not.toHaveClass(/link/)
    expect(deleteButton).not.toHaveClass(/btn extra/) // It does not match

    expect(deleteButton).toHaveClass('btn-danger extra btn', { exact: true }) // to check if the element has EXACTLY a set of classes
    expect(deleteButton).not.toHaveClass('btn-danger extra', { exact: true }) // if it has more than expected it is going to fail

    expect(noClasses).not.toHaveClass()
  })
})
