import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobepartiallychecked
// toBePartiallyChecked()
//
// This allows you to check whether the given element is partially checked.
// It accepts an input of type checkbox and elements with a role of checkbox
// with a aria-checked="mixed", or input of type checkbox with indeterminate set to true
//
///////////////////////////////////////////////////////////////////////////

describe('toBePartiallyChecked...', () => {
  test('should pass', () => {
    render(
      <>
        <input
          type='checkbox'
          aria-checked='mixed'
          data-testid='aria-checkbox-mixed'
        />
        <input type='checkbox' checked data-testid='input-checkbox-checked' />
        <input type='checkbox' data-testid='input-checkbox-unchecked' />
        <div
          role='checkbox'
          aria-checked='true'
          data-testid='aria-checkbox-checked'
        />
        <div
          role='checkbox'
          aria-checked='false'
          data-testid='aria-checkbox-unchecked'
        />
        <input type='checkbox' data-testid='input-checkbox-indeterminate' />
      </>
    )

    const ariaCheckboxMixed = screen.getByTestId('aria-checkbox-mixed')
    const inputCheckboxChecked = screen.getByTestId('input-checkbox-checked')
    const inputCheckboxUnchecked = screen.getByTestId(
      'input-checkbox-unchecked'
    )
    const ariaCheckboxChecked = screen.getByTestId('aria-checkbox-checked')
    const ariaCheckboxUnchecked = screen.getByTestId('aria-checkbox-unchecked')
    const inputCheckboxIndeterminate = screen.getByTestId(
      'input-checkbox-indeterminate'
    ) as HTMLInputElement

    expect(ariaCheckboxMixed).toBePartiallyChecked()
    expect(inputCheckboxChecked).not.toBePartiallyChecked()
    expect(inputCheckboxUnchecked).not.toBePartiallyChecked()
    expect(ariaCheckboxChecked).not.toBePartiallyChecked()
    expect(ariaCheckboxUnchecked).not.toBePartiallyChecked()

    inputCheckboxIndeterminate.indeterminate = true
    expect(inputCheckboxIndeterminate).toBePartiallyChecked()
  })
})
