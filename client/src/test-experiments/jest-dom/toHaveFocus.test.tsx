import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavefocus
// toHaveFocus()
//
// This allows you to assert whether an element has focus or not.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveFocus...', () => {
  test('should pass', () => {
    render(
      <>
        <div>
          <input type='text' data-testid='element-to-focus' />
        </div>
      </>
    )

    const input = screen.getByTestId('element-to-focus')

    input.focus()
    expect(input).toHaveFocus()

    input.blur()
    expect(input).not.toHaveFocus()
  })
})
