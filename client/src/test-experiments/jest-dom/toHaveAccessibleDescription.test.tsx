import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveaccessibledescription
// toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp)
//
// This allows you to assert that an element has the expected accessible description.
// You can pass the exact string of the expected accessible description, or you can make
// a partial match passing a regular expression, or by using expect.stringContaining/expect.stringMatching.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveAccessibleDescription...', () => {
  test('should pass', () => {
    render(
      <>
        <a
          data-testid='link'
          href='/'
          aria-label='Home page'
          title='A link to start over'
        >
          Start
        </a>
        <a data-testid='extra-link' href='/about' aria-label='About page'>
          About
        </a>
        <img src='avatar.jpg' data-testid='avatar' alt='User profile pic' />
        <img
          src='logo.jpg'
          data-testid='logo'
          alt='Company logo'
          aria-describedby='t1'
        />
        <span id='t1' role='presentation'>
          The logo of Our Company
        </span>
        <img // eslint-disable-line
          src='logo.jpg'
          data-testid='logo2'
          alt='Company logo'
          // ❌ The attribute aria-description is not supported by the role img.
          // This role is implicit on the element img.
          aria-description='The logo of Our Company'
        />
      </>
    )

    expect(screen.getByTestId('link')).toHaveAccessibleDescription()
    expect(screen.getByTestId('link')).toHaveAccessibleDescription(
      'A link to start over'
    )
    expect(screen.getByTestId('link')).not.toHaveAccessibleDescription(
      'Home page'
    )
    expect(screen.getByTestId('extra-link')).not.toHaveAccessibleDescription()
    expect(screen.getByTestId('avatar')).not.toHaveAccessibleDescription()
    expect(screen.getByTestId('logo')).not.toHaveAccessibleDescription(
      'Company logo'
    )
    expect(screen.getByTestId('logo')).toHaveAccessibleDescription(
      'The logo of Our Company'
    )
    expect(screen.getByTestId('logo2')).toHaveAccessibleDescription(
      'The logo of Our Company'
    )
  })
})
