import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveaccessibleerrormessage
// toHaveAccessibleErrorMessage(expectedAccessibleErrorMessage?: string | RegExp)
//
// This allows you to assert that an element has the expected accessible error message.
//
// You can pass the exact string of the expected accessible error message.
// Alternatively, you can perform a partial match by passing a regular expression
// or by using expect.stringContaining/expect.stringMatching.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveAccessibleErrorMessage...', () => {
  test('should pass', () => {
    render(
      <>
        <input
          aria-label='Has Error'
          aria-invalid='true'
          aria-errormessage='error-message'
        />
        <div id='error-message' role='alert'>
          This field is invalid
        </div>

        <input aria-label='No Error Attributes' />
        <input
          aria-label='Not Invalid'
          aria-invalid='false'
          aria-errormessage='error-message'
        />
      </>
    )

    // Inputs with Valid Error Messages
    expect(
      screen.getByRole('textbox', { name: 'Has Error' })
    ).toHaveAccessibleErrorMessage()
    expect(
      screen.getByRole('textbox', { name: 'Has Error' })
    ).toHaveAccessibleErrorMessage('This field is invalid')
    expect(
      screen.getByRole('textbox', { name: 'Has Error' })
    ).toHaveAccessibleErrorMessage(/invalid/i)
    expect(
      screen.getByRole('textbox', { name: 'Has Error' })
    ).not.toHaveAccessibleErrorMessage('This field is absolutely correct!')

    // Inputs without Valid Error Messages
    expect(
      screen.getByRole('textbox', { name: 'No Error Attributes' })
    ).not.toHaveAccessibleErrorMessage()

    expect(
      screen.getByRole('textbox', { name: 'Not Invalid' })
    ).not.toHaveAccessibleErrorMessage()
  })
})
