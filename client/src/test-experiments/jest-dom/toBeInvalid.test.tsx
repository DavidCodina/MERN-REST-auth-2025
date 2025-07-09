import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobeinvalid
//
// This allows you to check if an element, is currently invalid.
// An element is invalid if it has an aria-invalid attribute with no value or a value of "true",
// or if the result of checkValidity() is false.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeInvalid...', () => {
  test('should pass', () => {
    render(
      <>
        <input data-testid='no-aria-invalid' />
        <input data-testid='aria-invalid' aria-invalid />
        <input data-testid='aria-invalid-value' aria-invalid='true' />
        <input data-testid='aria-invalid-false' aria-invalid='false' />

        <form data-testid='valid-form'>
          <input />
        </form>

        <form data-testid='invalid-form'>
          <input required />
        </form>
      </>
    )

    expect(screen.getByTestId('no-aria-invalid')).not.toBeInvalid()
    expect(screen.getByTestId('aria-invalid')).toBeInvalid()
    expect(screen.getByTestId('aria-invalid-value')).toBeInvalid()
    expect(screen.getByTestId('aria-invalid-false')).not.toBeInvalid()

    expect(screen.getByTestId('valid-form')).not.toBeInvalid()
    expect(screen.getByTestId('invalid-form')).toBeInvalid()
  })
})
