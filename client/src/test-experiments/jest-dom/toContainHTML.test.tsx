import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tocontainhtml
//
// Assert whether a string representing a HTML element is contained in another element.
//The string should contain valid html, and not any incomplete html.
//
// Chances are you probably do not need to use this matcher. We encourage testing from the
// perspective of how the user perceives the app in a browser. That's why testing against
// a specific DOM structure is not advised.
//
// It could be useful in situations where the code being tested renders html that was obtained
// from an external source, and you want to validate that that html code was used as intended.
//
// It should not be used to check DOM structure that you control. Please use toContainElement instead.
//
///////////////////////////////////////////////////////////////////////////

describe('toContainHTML...', () => {
  test('should pass', () => {
    render(
      <span data-testid='parent'>
        <span data-testid='child'></span>
      </span>
    )

    // These are valid uses
    expect(screen.getByTestId('parent')).toContainHTML(
      '<span data-testid="child"></span>'
    )
    expect(screen.getByTestId('parent')).toContainHTML(
      '<span data-testid="child" />'
    )
    expect(screen.getByTestId('parent')).not.toContainHTML('<br />')

    // These won't work
    // expect(screen.getByTestId('parent')).toContainHTML('data-testid="child"')
    // expect(screen.getByTestId('parent')).toContainHTML('data-testid')
    // expect(screen.getByTestId('parent')).toContainHTML('</span>')
  })
})
