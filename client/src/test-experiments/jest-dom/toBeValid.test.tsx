import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobevalid
//
// This allows you to check if the value of an element, is currently valid.
// An element is valid if it has no aria-invalid attributes or an attribute value of "false".
/// The result of checkValidity() must also be true if it's a form element.
//
///////////////////////////////////////////////////////////////////////////
describe('toBeValid...', () => {
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

    expect(screen.getByTestId('no-aria-invalid')).toBeValid()
    expect(screen.getByTestId('aria-invalid')).not.toBeValid()
    expect(screen.getByTestId('aria-invalid-value')).not.toBeValid()
    expect(screen.getByTestId('aria-invalid-false')).toBeValid()

    expect(screen.getByTestId('valid-form')).toBeValid()
    expect(screen.getByTestId('invalid-form')).not.toBeValid()
  })
})
