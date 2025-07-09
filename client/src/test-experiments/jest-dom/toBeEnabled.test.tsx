import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobeenabled
//
// This allows you to check whether an element is not disabled from the user's perspective.
// It works like not.toBeDisabled(). Use this matcher to avoid double negation in your tests.
//
// This custom matcher does not take into account the presence or absence of the aria-disabled
// attribute. For more on why this is the case, check #144.
//
///////////////////////////////////////////////////////////////////////////
describe('toBeEnabled...', () => {
  test('should pass', () => {
    render(<button>Click Me</button>)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })
})
