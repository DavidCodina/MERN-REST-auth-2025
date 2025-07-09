import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavestyle
// toHaveStyle(css: string | object)
//
// This allows you to check if a certain element has some specific css properties
// with specific values applied. It matches only if the element has all the expected
// properties applied, not just some of them.
//
// This also works with rules that are applied to the element via a class name for which
// some rules are defined in a stylesheet currently active in the document. The usual
// rules of css precedence apply.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveStyle...', () => {
  test('should pass', () => {
    render(
      <>
        <button
          data-testid='delete-button'
          style={{
            display: 'none',
            backgroundColor: 'red'
          }}
        >
          Delete item
        </button>
      </>
    )

    const button = screen.getByTestId('delete-button')

    expect(button).toHaveStyle('display: none')
    expect(button).toHaveStyle({ display: 'none' })

    expect(button).toHaveStyle(
      'display: none; background-color: rgb(255, 0, 0);' //^ Gotcha: React and/or the browser converts it to rgb(255, 0, 0)
    )

    expect(button).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)', //^ Gotcha: React and/or the browser converts it to rgb(255, 0, 0)
      display: 'none'
    })
    expect(button).not.toHaveStyle(
      `background-color: rgb(0, 0, 255); display: none;`
    )
    expect(button).not.toHaveStyle({
      backgroundColor: 'rgb(0, 0, 255)',
      display: 'none'
    })
  })
})
