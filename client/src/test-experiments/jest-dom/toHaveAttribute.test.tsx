import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// /testing-library/jest-dom?tab=readme-ov-file#tohaveattribute
// toHaveAttribute(attr: string, value?: any)
//
// This allows you to check whether the given element has an attribute or not.
// You can also optionally check that the attribute has a specific expected value
// or partial match using expect.stringContaining/expect.stringMatching
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveAttribute...', () => {
  test('should pass', () => {
    render(
      <>
        <button data-testid='ok-button' type='submit' disabled>
          ok
        </button>
      </>
    )

    const button = screen.getByTestId('ok-button')

    expect(button).toHaveAttribute('disabled') // eslint-disable-line
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).not.toHaveAttribute('type', 'button')

    expect(button).toHaveAttribute('type', expect.stringContaining('sub'))
    expect(button).toHaveAttribute('type', expect.not.stringContaining('but'))
  })
})
