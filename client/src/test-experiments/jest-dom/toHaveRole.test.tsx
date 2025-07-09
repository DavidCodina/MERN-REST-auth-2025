import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaverole
// toHaveRole(expectedRole: string)
//
// This allows you to assert that an element has the expected role.
//
// This is useful in cases where you already have access to an element via some
// query other than the role itself, and want to make additional assertions regarding
// its accessibility.
//
// The role can match either an explicit role (via the role attribute), or an implicit
// one via the implicit ARIA semantics.
//
// Note: roles are matched literally by string equality, without inheriting from the ARIA
// role hierarchy. As a result, querying a superclass role like 'checkbox' will not include
// elements with a subclass role like 'switch'.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveRole...', () => {
  test('should pass', () => {
    render(
      <>
        <button data-testid='button'>Continue</button>
        <div role='button' data-testid='button-explicit'>
          Continue
        </div>

        <button
          role='switch button' // eslint-disable-line
          data-testid='button-explicit-multiple'
        >
          Continue
        </button>
        <a href='/about' data-testid='link'>
          About
        </a>

        <a // eslint-disable-line
          data-testid='link-invalid'
        >
          Invalid link
        </a>
      </>
    )

    expect(screen.getByTestId('button')).toHaveRole('button')
    expect(screen.getByTestId('button-explicit')).toHaveRole('button')
    expect(screen.getByTestId('button-explicit-multiple')).toHaveRole('button')
    expect(screen.getByTestId('button-explicit-multiple')).toHaveRole('switch')
    expect(screen.getByTestId('link')).toHaveRole('link')
    expect(screen.getByTestId('link-invalid')).not.toHaveRole('link')
    expect(screen.getByTestId('link-invalid')).toHaveRole('generic')
  })
})
