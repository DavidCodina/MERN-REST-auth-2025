import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#toberequired
//
// This allows you to check if a form element is currently required.
// An element is required if it is having a required or aria-required="true" attribute.
//
///////////////////////////////////////////////////////////////////////////
describe('toBeRequired...', () => {
  test('should pass', () => {
    render(
      <>
        <input data-testid='required-input' required />
        <input data-testid='aria-required-input' aria-required='true' />
        <input data-testid='conflicted-input' required aria-required='false' />
        <input data-testid='aria-not-required-input' aria-required='false' />
        <input data-testid='optional-input' />
        <input data-testid='unsupported-type' type='image' alt='' required />
        <select data-testid='select' required></select>
        <textarea data-testid='textarea' required></textarea>
        <div
          data-testid='supported-role'
          role='tree'
          // @ts-ignore
          required
        ></div>
        <div
          data-testid='supported-role-aria'
          role='tree'
          aria-required='true'
        ></div>
      </>
    )

    expect(screen.getByTestId('required-input')).toBeRequired()
    expect(screen.getByTestId('aria-required-input')).toBeRequired()
    expect(screen.getByTestId('conflicted-input')).toBeRequired()
    expect(screen.getByTestId('aria-not-required-input')).not.toBeRequired()
    expect(screen.getByTestId('optional-input')).not.toBeRequired()
    expect(screen.getByTestId('unsupported-type')).not.toBeRequired()
    expect(screen.getByTestId('select')).toBeRequired()
    expect(screen.getByTestId('textarea')).toBeRequired()
    expect(screen.getByTestId('supported-role')).not.toBeRequired()
    expect(screen.getByTestId('supported-role-aria')).toBeRequired()
  })
})
