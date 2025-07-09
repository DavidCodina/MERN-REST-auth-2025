import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveerrormessage
// toHaveErrorMessage(text: string | RegExp)
//
// This custom matcher is deprecated. Prefer toHaveAccessibleErrorMessage instead, which is
// more comprehensive in implementing the official spec.
//
// This allows you to check whether the given element has an ARIA error message or not.
//
// Use the aria-errormessage attribute to reference another element that contains custom
// error message text. Multiple ids is NOT allowed. Authors MUST use aria-invalid in
// conjunction with aria-errormessage. Learn more from aria-errormessage spec.
//
// Whitespace is normalized.
//
// When a string argument is passed through, it will perform a whole case-sensitive match to
// the error message text.
//
// To perform a case-insensitive match, you can use a RegExp with the /i modifier.
//
// To perform a partial match, you can pass a RegExp or use expect.stringContaining("partial string").
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveErrorMessage...', () => {
  test('should pass', () => {
    render(
      <>
        <label htmlFor='startTime'>
          {' '}
          Please enter a start time for the meeting:{' '}
        </label>
        <input
          id='startTime'
          type='text'
          data-testid='input-start-time'
          aria-errormessage='msgID'
          aria-invalid='true'
          value='11:30 PM'
        />
        <span
          id='msgID'
          aria-live='assertive'
          style={{
            visibility: 'visible'
          }}
        >
          Invalid time: the time must be between 9:00 AM and 5:00 PM
        </span>
      </>
    )

    const timeInput = screen.getByTestId('input-start-time')

    expect(timeInput).toHaveErrorMessage(
      'Invalid time: the time must be between 9:00 AM and 5:00 PM'
    )

    expect(timeInput).toHaveErrorMessage(/invalid time/i) // to partially match
    expect(timeInput).toHaveErrorMessage(
      expect.stringContaining('Invalid time')
    ) // to partially match
    expect(timeInput).not.toHaveErrorMessage('Pikachu!')
  })
})
