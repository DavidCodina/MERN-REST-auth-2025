import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobeemptydomelement
//
// This allows you to assert whether an element has no visible content for the user.
// It ignores comments but will fail if the element contains white-space.
//
///////////////////////////////////////////////////////////////////////////
describe('toBeEmptyDOMElement...', () => {
  test('should pass', () => {
    render(<button></button>)
    const button = screen.getByRole('button')
    expect(button).toBeEmptyDOMElement()
  })
})
