import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobechecked
// toBeChecked()
//
// This allows you to check whether the given element is checked. It accepts
// an input of type checkbox or radio and elements with a role of checkbox, radio
// or switch with a valid aria-checked attribute of "true" or "false".
//
///////////////////////////////////////////////////////////////////////////

describe('toBeChecked...', () => {
  test('should pass', () => {
    render(
      <>
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

        <input
          type='radio'
          checked
          value='foo'
          data-testid='input-radio-checked'
        />
        <input type='radio' value='foo' data-testid='input-radio-unchecked' />
        <div
          role='radio'
          aria-checked='true'
          data-testid='aria-radio-checked'
        />
        <div
          role='radio'
          aria-checked='false'
          data-testid='aria-radio-unchecked'
        />
        <div
          role='switch'
          aria-checked='true'
          data-testid='aria-switch-checked'
        />
        <div
          role='switch'
          aria-checked='false'
          data-testid='aria-switch-unchecked'
        />
      </>
    )

    const inputCheckboxChecked = screen.getByTestId('input-checkbox-checked')
    const inputCheckboxUnchecked = screen.getByTestId(
      'input-checkbox-unchecked'
    )
    const ariaCheckboxChecked = screen.getByTestId('aria-checkbox-checked')
    const ariaCheckboxUnchecked = screen.getByTestId('aria-checkbox-unchecked')
    expect(inputCheckboxChecked).toBeChecked()
    expect(inputCheckboxUnchecked).not.toBeChecked()
    expect(ariaCheckboxChecked).toBeChecked()
    expect(ariaCheckboxUnchecked).not.toBeChecked()

    const inputRadioChecked = screen.getByTestId('input-radio-checked')
    const inputRadioUnchecked = screen.getByTestId('input-radio-unchecked')
    const ariaRadioChecked = screen.getByTestId('aria-radio-checked')
    const ariaRadioUnchecked = screen.getByTestId('aria-radio-unchecked')
    expect(inputRadioChecked).toBeChecked()
    expect(inputRadioUnchecked).not.toBeChecked()
    expect(ariaRadioChecked).toBeChecked()
    expect(ariaRadioUnchecked).not.toBeChecked()

    const ariaSwitchChecked = screen.getByTestId('aria-switch-checked')
    const ariaSwitchUnchecked = screen.getByTestId('aria-switch-unchecked')
    expect(ariaSwitchChecked).toBeChecked()
    expect(ariaSwitchUnchecked).not.toBeChecked()
  })
})
