import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobevisible
//
// This allows you to check if an element is currently visible to the user.
// An element is visible if all the following conditions are met:
//
//   - it is present in the document
//   - it does not have its css property display set to none
//   - it does not have its css property visibility set to either hidden or collapse
//   - it does not have its css property opacity set to 0
//   - its parent element is also visible (and so on up to the top of the DOM tree)
//   - it does not have the hidden attribute
//   - if <details /> it has the open attribute
//
///////////////////////////////////////////////////////////////////////////

describe('toBeVisible...', () => {
  test('should pass', () => {
    render(
      <>
        <div
          data-testid='zero-opacity'
          style={{
            opacity: 0
          }}
        >
          Zero Opacity Example
        </div>
        <div
          data-testid='visibility-hidden'
          style={{
            visibility: 'hidden'
          }}
        >
          Visibility Hidden Example
        </div>
        <div
          data-testid='display-none'
          style={{
            display: 'none'
          }}
        >
          Display None Example
        </div>
        <div style={{ opacity: 0 }}>
          <span data-testid='hidden-parent'>Hidden Parent Example</span>
        </div>
        <div data-testid='visible'>Visible Example</div>
        <div data-testid='hidden-attribute' hidden>
          Hidden Attribute Example
        </div>
        <details>
          <summary>Title of hidden text</summary>
          Hidden Details Example
        </details>
        <details open>
          <summary>Title of visible text</summary>
          <div>Visible Details Example</div>
        </details>
      </>
    )

    expect(screen.getByText('Zero Opacity Example')).not.toBeVisible()
    expect(screen.getByText('Visibility Hidden Example')).not.toBeVisible()
    expect(screen.getByText('Display None Example')).not.toBeVisible()
    expect(screen.getByText('Hidden Parent Example')).not.toBeVisible()
    expect(screen.getByText('Visible Example')).toBeVisible()
    expect(screen.getByText('Hidden Attribute Example')).not.toBeVisible()
    expect(screen.getByText('Hidden Details Example')).not.toBeVisible()
    expect(screen.getByText('Visible Details Example')).toBeVisible()
  })
})
