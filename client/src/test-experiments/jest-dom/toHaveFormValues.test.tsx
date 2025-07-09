import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveformvalues
//
//   toHaveFormValues(expectedValues: {
//     [name: string]: any
//   })
//
// This allows you to check if a form or fieldset contains form controls for each given name,
// and having the specified value.
//
//   It is important to stress that this matcher can only be invoked on a form or a fieldset element.
//
//   This allows it to take advantage of the .elements property in form and fieldset to reliably fetch
//   all form controls within them.
//
//   This also avoids the possibility that users provide a container that contains more than one form,
//   thereby intermixing form controls that are not related, and could even conflict with one another.
//
//
// This matcher abstracts away the particularities with which a form control value is obtained depending
// on the type of form control. For instance, <input> elements have a value attribute, but <select> elements
// do not. Here's a list of all cases covered:
//
//   - <input type="number"> elements return the value as a number, instead of a string.
//
//   - <input type="checkbox"> elements:
//     A. if there's a single one with the given name attribute, it is treated as a boolean,
//        returning true if the checkbox is checked, false if unchecked.
//
//     B. if there's more than one checkbox with the same name attribute, they are all treated
//        collectively as a single form control, which returns the value as an array containing all
//        the values of the selected checkboxes in the collection.
//
//   - <input type="radio"> elements are all grouped by the name attribute, and such a group treated
///    as a single form control. This form control returns the value as a string corresponding to
//     the value attribute of the selected radio button within the group.
//
//   - <input type="text"> elements return the value as a string. This also applies to <input> elements
//      having any other possible type attribute that's not explicitly covered in different rules above
//      (e.g. search, email, date, password, hidden, etc.)
//
//   - <select> elements without the multiple attribute return the value as a string corresponding to the
//     value attribute of the selected option, or undefined if there's no selected option.
//
//   - <select multiple> elements return the value as an array containing all the values of the selected options.
//
//   - <textarea> elements return their value as a string. The value corresponds to their node content.
//
//
// The above rules make it easy, for instance, to switch from using a single select control to using a group
// of radio buttons. Or to switch from a multi select control, to using a group of checkboxes. The resulting
// set of form values used by this matcher to compare against would be the same.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveFormValues...', () => {
  test('should pass', () => {
    render(
      <>
        <form data-testid='login-form'>
          <input type='text' name='username' value='jane.doe' />
          <input type='password' name='password' value='12345678' />
          <input type='checkbox' name='rememberMe' checked />
          <button type='submit'>Sign in</button>
        </form>
      </>
    )

    expect(screen.getByTestId('login-form')).toHaveFormValues({
      username: 'jane.doe',
      rememberMe: true
    })
  })
})
