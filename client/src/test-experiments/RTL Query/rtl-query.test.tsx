import { useEffect, useState } from 'react'
import {
  render,
  screen
  //, logRoles
} from '@testing-library/react'

/* ========================================================================

======================================================================== */
// https://testing-library.com/docs/queries/about/#manual-queries
// On top of the queries provided by the testing library, you can use
// the regular querySelector DOM API to query elements. Note that using
// this as an escape hatch to query by class or id is not recommended
// because they are invisible to the user. Use a testid if you have to,
// to make your intention to fall back to non-semantic queries clear and
// establish a stable API contract in the HTML.

describe('Manual Queries...', () => {
  test('...', () => {
    const view = render(
      <>
        <button>Click Me</button>
      </>
    )

    const { container } = view

    // logRoles(container)
    ///////////////////////////////////////////////////////////////////////////
    //
    // Princ implicit ARIA Roles with logRoles(container):
    // https://www.youtube.com/watch?v=Kvby4W2TpQU&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=33
    //
    //   stdout | src/test-experiments/RTL Query/rtl-query.test.tsx > Manual Queries... > ...
    //
    //   button:
    //
    //   Name "Click Me":
    //   <button />
    //
    ///////////////////////////////////////////////////////////////////////////

    const button = container.querySelector('button') // eslint-disable-line
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click Me')
  })
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://testing-library.com/docs/queries/about/#types-of-queries
// React Testing Library provides 6 different query types.
//
//   1. getBy...: Returns the matching node for a query, and throw a descriptive error
//      if no elements match or if more than one match is found (use getAllBy instead
//      if more than one element is expected).
//
//   2. queryBy...: Returns the matching node for a query, and return null if no elements match.
//      This is useful for asserting an element that is not present. Throws an error if more than
//      one match is found (use queryAllBy instead if this is OK).
//
//   3. findBy...: Returns a Promise which resolves when an element is found which matches the given query.
//      The promise is rejected if no element is found or if more than one element is found after a default
//      timeout of 1000ms. If you need to find more than one element, use findAllBy.
//
//   4. getAllBy...: Returns an array of all matching nodes for a query, and throws an error if no elements match.
//
//   5. queryAllBy...: Returns an array of all matching nodes for a query, and return an empty array ([]) if no elements match.
//
//   6. findAllBy...: findAllBy...: Returns a promise which resolves to an array of elements when any elements are found which
//      match the given query. The promise is rejected if no elements are found after a default timeout of 1000ms.
//
//   Summary Table:
//
//     -----------------------------------------------------------------------------------------
//     | Type of Query    |   0 Matches   |   1 Match     |   >1 Matches    |      Retry       |
//     -----------------------------------------------------------------------------------------
//     | Single Element                                                                        |
//     -----------------------------------------------------------------------------------------
//     | getBy...         | Throw error   | Return element |  Throw error   |       No         |
//     -----------------------------------------------------------------------------------------
//     | queryBy...       | Return null   | Return element |  Throw error   |       No         |
//     -----------------------------------------------------------------------------------------
//     | findBy...        | Throw error   | Return element |  Throw error   |       Yes        |
//     -----------------------------------------------------------------------------------------
//     | Multiple Elements                                                                     |
//     -----------------------------------------------------------------------------------------
//     | getAllBy...      | Throw error   |  Return array  |  Return array  |       No         |
//     -----------------------------------------------------------------------------------------
//     | queryAllBy...    | Return []     |  Return array  |  Return array  |       No         |
//     -----------------------------------------------------------------------------------------
//     | findAllBy...     | Throw error   |  Return array  |  Return array  |       Yes        |
//     -----------------------------------------------------------------------------------------
//
///////////////////////////////////////////////////////////////////////////

describe('RTL Query Types...', () => {
  /* ======================
          getBy...
  ====================== */

  // ...

  /* ======================
          getAllBy...
  ====================== */

  // ...

  /* ======================
          queryBy...
  ====================== */
  // https://www.youtube.com/watch?v=AabRgJD3rjI&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=30
  // Unlike, getBy... which throws an error if no element is found, qyueryBy... will simply return null.

  test('queryBy...', () => {
    render(<></>)
    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  /* ======================
        queryAllBy...
  ====================== */

  // ...

  /* ======================
          findBy...
  ====================== */
  // https://testing-library.com/docs/guide-disappearance
  // https://www.youtube.com/watch?v=XTKF8GKD1tA&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=31

  const FindByDemo = () => {
    const [show, setShow] = useState(false)
    useEffect(() => {
      setTimeout(() => {
        setShow(true)
      }, 500)
    }, [])
    return show ? <button>Click Me</button> : null
  }

  test('findBy...', async () => {
    render(<FindByDemo />)
    const button = await screen.findByRole(
      'button',
      {
        // Options...
      },
      {
        // https://testing-library.com/docs/dom-testing-library/api-async/#findby-queries
        // timeout: 1000 // Default
      }
    )
    // screen.debug()
    expect(button).toBeInTheDocument()
  })

  /* ======================
        findAllBy...
  ====================== */

  // ...
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Additionlly, there are 8 different query methods that can be used in
// conjunction with a given query type. Below they are listted in order of priority.
//
//   1. ...ByRole: This can be used to query every element that is exposed in the accessibility tree. With the name option you can
//      filter the returned elements by their accessible name. This should be your top preference for just about everything.
//      There's not much you can't get with this (if you can't, it's possible your UI is inaccessible). Most often, this will
//      be used with the name option like so: getByRole('button', {name: /submit/i}). Check the list of roles.
//
//      See here for a list of roles:
//
//        https://www.w3.org/TR/wai-aria-1.1/#role_definitions
//        https://www.w3.org/TR/html-aria/#docconformance
//        https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles
//
//
//   2. ...ByLabelText: This method is really good for form fields. When navigating through a website form, users find elements using
//      label text. This method emulates that behavior, so it should be your top preference.
//
//   3. ...ByPlaceholderText: A placeholder is not a substitute for a label. But if that's all you have, then it's better than alternatives.
//
//   4. ...ByText: Outside of forms, text content is the main way users find elements. This method can be used to find
//      non-interactive elements (like divs, spans, and paragraphs).
//
//   5. ...ByDisplayValue: The current value of a form element can be useful when navigating a page with filled-in values.
//
//   6. ...ByAltText: If your element is one which supports alt text (img, area, input, and any custom element),
//      then you can use this to find that element.
//
//   7. ...ByTitle: The title attribute is not consistently read by screenreaders, and is not visible by default for sighted users
//
//   8. ...ByTestId: The user cannot see (or hear) these, so this is only recommended for cases where you
//      can't match by role or text or it doesn't make sense (e.g. the text is dynamic).
//
//
// For help in query construction use: https://testing-playground.com/
// https://www.youtube.com/watch?v=424C8ppfzQA&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=34
//
///////////////////////////////////////////////////////////////////////////

describe('RTL Query Methods...', () => {
  /* ======================
        ...ByRole
  ====================== */
  // https://testing-library.com/docs/queries/byrole

  test('...ByRole should pass', () => {
    render(
      <>
        <h1 aria-describedby='my h1 title'>H1 Title</h1>
        <h2>H2 Title</h2>
        <button>Click Me</button>
      </>
    )

    // const h1 = screen.getByRole('heading', { level: 1 })
    const h1 = screen.getByRole('heading', {
      // name is of type TextMatch, but the actual typs just do this:
      // name?: RegExp | string | ((accessibleName: string, element: Element) => boolean)
      name: (accessibleName, _element) => {
        return accessibleName.toLowerCase().includes('h1')
      }
      // name: 'H1 Title'
      // name: /h1 title/i
    })
    const h2 = screen.getByRole('heading', { level: 2 })
    const button = screen.getByRole('button')

    expect(h1).toBeInTheDocument()
    expect(h2).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  /* ======================
        ...ByLabelText
  ====================== */
  // https://testing-library.com/docs/queries/bylabeltext

  test('...ByLabelText should pass', () => {
    render(
      <>
        <label htmlFor='inputMessage'>Message</label>
        <input
          id='inputMessage'
          value='Hello from input!'
          onChange={() => {}}
        />

        <label htmlFor='textareaMessage'>Message</label>
        <textarea
          id='textareaMessage'
          value='Hello from textarea!'
          onChange={() => {}}
        />
      </>
    )

    // In this case because both inputs have label text of 'Message',
    // we can narrow it down using the selector option.
    const inputMessage = screen.getByLabelText('Message', {
      selector: 'input'
    })

    const textareaMessage = screen.getByLabelText('Message', {
      selector: 'textarea'
    })

    expect(inputMessage).toBeInTheDocument()
    expect(inputMessage).toHaveValue('Hello from input!')

    expect(textareaMessage).toBeInTheDocument()
    expect(textareaMessage).toHaveValue('Hello from textarea!')
  })

  /* ======================
    ...ByPlaceholderText
  ====================== */
  // https://testing-library.com/docs/queries/byplaceholdertext

  test('...ByPlaceholderText should pass', () => {
    render(
      <>
        <input placeholder='First Name...' />
      </>
    )
    const input = screen.getByPlaceholderText('First Name...')
    expect(input).toBeInTheDocument()
  })

  /* ======================
        ...ByText
  ====================== */
  // https://testing-library.com/docs/queries/bytext

  test('...ByText should pass', () => {
    render(
      <>
        <h1>My Title</h1>
        <div>This is the subtitle</div>
        <div>Description: Bla, bla, bla...</div>
        <input type='submit' value='12345' onChange={() => {}} />
      </>
    )

    // https://testing-library.com/docs/queries/about/#precision
    // When using exact: false with the screen.getByText query in React Testing Library,
    // it allows for partial string matches and is case-insensitive. This means that if
    // you provide a string to search for, it will match any text that contains that string,
    // regardless of the case.
    const title = screen.getByText('my titl', {
      exact: false
    })

    const subtitle = screen.getByText(/sub/i)

    const descriptionNormalizer = (value: string) => {
      if (value.startsWith('Description: ')) {
        return value.replace('Description: ', '')
      }
      return value
    }

    const description = screen.getByText('Bla, bla, bla...', {
      normalizer: descriptionNormalizer
    })

    // While this works, it's more appropriate to use getByDisplayValue() here.
    const input = screen.getByText('12345')

    expect(title).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  /* ======================
      ...ByDisplayValue
  ====================== */
  // https://testing-library.com/docs/queries/bydisplayvalue

  test('...ByDisplayValue should pass', () => {
    render(
      <>
        <h1>12345</h1>
        <input type='submit' value='12345' onChange={() => {}} />
      </>
    )

    // ❌ TestingLibraryElementError: Found multiple elements with the text: 12345
    // const input = screen.getByText('12345')
    // In this case, using getByDisplayValue helps avoid the above error.

    const input = screen.getByDisplayValue('12345')
    expect(input).toBeInTheDocument()
  })

  /* ======================
      ...ByAltText
  ====================== */
  // https://testing-library.com/docs/queries/byalttext

  test('...ByDisplayValue should pass', () => {
    render(
      <>
        <img alt='avatar' src='avatar.jpg' />
      </>
    )

    const image = screen.getByAltText('avatar')
    expect(image).toBeInTheDocument()
  })

  /* ======================
      ...ByTitle
  ====================== */
  // https://testing-library.com/docs/queries/bytitle

  test('...ByTitle should pass', () => {
    render(<button title='my-button'>Click Me</button>)
    const button = screen.getByTitle('my-button')
    expect(button).toBeInTheDocument()
  })

  /* ======================
      ...ByTestId
  ====================== */
  // https://testing-library.com/docs/queries/bytestid

  test('...ByTestId should pass', () => {
    render(<button data-testid='btn1'>Click Me</button>)
    const button = screen.getByTestId('btn1')
    expect(button).toBeInTheDocument()
  })
})
