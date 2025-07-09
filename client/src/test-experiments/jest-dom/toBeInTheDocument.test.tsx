import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobeinthedocument
//
// This allows you to assert whether an element is present in the document or not.
//
// Note: This matcher does not find detached elements. The element must be added to the
// document to be found by toBeInTheDocument. If you desire to search in a detached element
// please use: toContainElement
//
///////////////////////////////////////////////////////////////////////////
describe('toBeEnabled...', () => {
  test('should pass', () => {
    render(<button>Click Me</button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
