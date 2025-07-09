import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveaccessiblename
// toHaveAccessibleName(expectedAccessibleName?: string | RegExp)
//
// This allows you to assert that an element has the expected accessible name.
// It is useful, for instance, to assert that form elements and buttons are properly labelled.
//
// You can pass the exact string of the expected accessible name, or you can make a partial match
// passing a regular expression, or by using expect.stringContaining/expect.stringMatching.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveAccessibleName...', () => {
  test('should pass', () => {
    render(
      <>
        <img data-testid='img-alt' src='' alt='Test alt' />

        <img data-testid='img-empty-alt' src='' alt='' />

        <svg data-testid='svg-title'>
          <title>Test title</title>
        </svg>

        <button data-testid='button-img-alt'>
          <img src='' alt='Test' />
        </button>

        <p>
          <img data-testid='img-paragraph' src='' alt='' /> Test content
        </p>

        <button data-testid='svg-button'>
          <svg>
            <title>Test</title>
          </svg>
        </button>
        <div>
          <svg data-testid='svg-without-title'></svg>
        </div>
        <input data-testid='input-title' title='test' />
      </>
    )

    expect(screen.getByTestId('img-alt')).toHaveAccessibleName('Test alt')
    expect(screen.getByTestId('img-empty-alt')).not.toHaveAccessibleName()
    expect(screen.getByTestId('svg-title')).toHaveAccessibleName('Test title')
    expect(screen.getByTestId('button-img-alt')).toHaveAccessibleName()
    expect(screen.getByTestId('img-paragraph')).not.toHaveAccessibleName()
    expect(screen.getByTestId('svg-button')).toHaveAccessibleName()
    expect(screen.getByTestId('svg-without-title')).not.toHaveAccessibleName()
    expect(screen.getByTestId('input-title')).toHaveAccessibleName()
  })
})
