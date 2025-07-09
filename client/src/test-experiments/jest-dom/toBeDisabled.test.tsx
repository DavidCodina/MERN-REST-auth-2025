import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tobedisabled
//
// This allows you to check whether an element is disabled from the user's perspective.
// According to the specification, the following elements can be disabled: button, input,
// select, textarea, optgroup, option, fieldset, and custom elements.
//
// This custom matcher considers an element as disabled if the element is among the types of
// elements that can be disabled (listed above), and the disabled attribute is present.
// It will also consider the element as disabled if it's inside a parent form element that
// supports being disabled and has the disabled attribute present.
//
// This custom matcher does not take into account the presence or absence of the aria-disabled attribute.
// For more on why this is the case, check #144.
//
///////////////////////////////////////////////////////////////////////////
describe('toBeDisabled...', () => {
  test('should pass', () => {
    render(<button disabled>Click Me</button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
