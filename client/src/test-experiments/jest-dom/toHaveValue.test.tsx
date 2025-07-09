import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavevalue
// toHaveValue(value: string | string[] | number)
//
// This allows you to check whether the given form element has the specified value.
// It accepts <input>, <select> and <textarea> elements with the exception of
// <input type="checkbox"> and <input type="radio">, which can be meaningfully
// matched only using toBeChecked or toHaveFormValues.
//
// It also accepts elements with roles meter, progressbar, slider or spinbutton
// and checks their aria-valuenow attribute (as a number).
//
// For all other form elements, the value is matched using the same algorithm as
// in toHaveFormValues does.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveValue...', () => {
  test('should pass', () => {
    render(
      <>
        <input type='text' value='text' data-testid='input-text' />
        <input type='number' value='5' data-testid='input-number' />
        <input type='text' data-testid='input-empty' />
        <select multiple data-testid='select-number'>
          <option value='first'>First Value</option>
          <option value='second' selected>
            Second Value
          </option>
          <option value='third' selected>
            Third Value
          </option>
        </select>
      </>
    )

    const textInput = screen.getByTestId('input-text')
    const numberInput = screen.getByTestId('input-number')
    const emptyInput = screen.getByTestId('input-empty')
    const selectInput = screen.getByTestId('select-number')

    expect(textInput).toHaveValue('text')
    expect(numberInput).toHaveValue(5)
    expect(emptyInput).not.toHaveValue()
    expect(selectInput).toHaveValue(['second', 'third'])
  })
})
