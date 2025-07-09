import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tocontainelement
//
// This allows you to assert whether an element contains another element as a descendant or not.

///////////////////////////////////////////////////////////////////////////
describe('toContainElement...', () => {
  test('should pass', () => {
    render(
      <span data-testid='ancestor'>
        <span data-testid='descendant'></span>
      </span>
    )

    const ancestor = screen.getByTestId('ancestor')
    const descendant = screen.getByTestId('descendant')
    // const nonExistantElement = screen.getByTestId('does-not-exist')

    expect(ancestor).toContainElement(descendant)
    expect(descendant).not.toContainElement(ancestor)
    // expect(ancestor).not.toContainElement(nonExistantElement)
  })
})
