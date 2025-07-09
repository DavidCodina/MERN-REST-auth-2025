import { useState, useEffect } from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen /*, waitFor */ } from '@testing-library/react'
import { Button } from './index'

/* ========================================================================
            
======================================================================== */
// Review Testing Playground:
// https://testing-playground.com/
// https://chromewebstore.google.com/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano
// https://www.youtube.com/watch?v=424C8ppfzQA&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=34

describe('Button...', () => {
  /* ======================

  ====================== */
  // https://testing-library.com/docs/queries/about/#manual-queries
  // On top of the queries provided by the testing library, you can use
  // the regular querySelector DOM API to query elements. Note that using
  // this as an escape hatch to query by class or id is not recommended
  // because they are invisible to the user. Use a testid if you have to,
  // to make your intention to fall back to non-semantic queries clear and
  // establish a stable API contract in the HTML.

  test('should be in document (manual querySelector).', () => {
    const { container } = render(<Button>Click Me</Button>)
    const button = container.querySelector('button') // eslint-disable-line
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click Me')
  })

  /* ======================

  ====================== */

  test('should be in document (manual querySelectorAll).', () => {
    const { container } = render(<Button>Click Me</Button>)
    const buttons = container.querySelectorAll('button') // eslint-disable-line

    ///////////////////////////////////////////////////////////////////////////
    //
    // let button: HTMLButtonElement | null = null
    //
    // for (let i = 0; i < buttons.length; i++) {
    //   const btn = buttons[i]
    //   if (btn && btn.textContent === 'Click Me') {
    //     button = btn
    //     break
    //   }
    // }
    //
    ///////////////////////////////////////////////////////////////////////////

    const button = Array.from(buttons).find(
      (button) => button.textContent === 'Click Me'
    )

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click Me')
  })

  /* ======================

  ====================== */

  test('should have correct text.', () => {
    render(<Button data-testid='my-button'>Click Me</Button>)
    // const button = screen.getByText(/click me/i)
    // const button = screen.getByRole('button', { name: /click me/i  })
    // const button = screen.getByTestId('my-button')
    // const button = screen.getByText('click', { exact: false })

    // screen.debug()
    const button = screen.getByText((content) => {
      return content.startsWith('Click')
    })

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click Me')
  })

  /* ======================

  ====================== */

  test('should have correct title.', () => {
    render(<Button title='A Simple Button'>Click Me</Button>)
    const button = screen.getByTitle('A Simple Button')
    expect(button).toBeInTheDocument()
  })

  /* ======================

  ====================== */

  test('should call mock handleClick when clicked.', async () => {
    // https://testing-library.com/docs/user-event/intro
    const user = userEvent.setup()

    // https://www.youtube.com/watch?v=TuxmnyhPdhA&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=42
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click Me</Button>)

    const button = screen.getByRole('button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /* ======================

  ====================== */
  // An alternative to using vi.fn()

  test('should spy on obj.mock and detect being called when clicked.', async () => {
    const user = userEvent.setup()

    const obj = {
      mock: () => {}
    }
    const spy = vi.spyOn(obj, 'mock')

    render(<Button onClick={obj.mock}>Click Me</Button>)
    const button = screen.getByRole('button')

    await user.click(button)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  // test('should spy on obj.mock and detect being called when clicked.', async () => {
  //   const user = userEvent.setup()

  //   const obj = {
  //     mock() {}
  //   }
  //   const spy = vi.spyOn(obj, 'mock')

  //   render(<Button onClick={obj.mock}>Click Me</Button>)
  //   const button = screen.getByRole('button')

  //   await user.click(button)

  //   expect(spy).toHaveBeenCalledTimes(1)
  // })

  /* ======================

  ====================== */

  test('should be be removed on click.', async () => {
    const RemoveOnClick = () => {
      const [show, setShow] = useState(true)

      return (
        <div>
          {show ? (
            <Button onClick={() => setShow(false)}>Click Me</Button>
          ) : (
            <div>The button has been removed.</div>
          )}
        </div>
      )
    }

    const user = userEvent.setup()

    render(<RemoveOnClick />)

    const button = screen.getByRole('button')
    const message = screen.queryByText('The button has been removed.')
    expect(button).toBeInTheDocument()
    expect(message).not.toBeInTheDocument()

    await user.click(button)
    const message2 = screen.getByText('The button has been removed.')

    expect(button).not.toBeInTheDocument()
    expect(message2).toBeInTheDocument()
  })

  /* ======================

  ====================== */

  test('should show button shortly after mount, then remove on click.', async () => {
    const ShowOnMount = () => {
      const [show, setShow] = useState(false)

      useEffect(() => {
        setTimeout(() => {
          setShow(true)
        }, 500)
      }, [])

      return (
        <div>
          {show && <Button onClick={() => setShow(false)}>Click Me</Button>}
        </div>
      )
    }

    const user = userEvent.setup()

    render(<ShowOnMount />)

    // findBy* has a default timeout of 1000ms.
    // The third arg can be used to specify the timeout.
    // Essentiallly, findBy* is the comination of waitFor with a getBy* query.
    const button = await screen.findByRole(
      'button' /* , undefined, { timeout: 1000 } */
    )
    expect(button).toBeInTheDocument()

    // Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly
    // marked as ignored with the `void` operator.eslint@typescript-eslint/no-floating-promises)
    await user.click(button)
    expect(button).not.toBeInTheDocument()

    ///////////////////////////////////////////////////////////////////////////
    //
    // Alternative Syntax:
    //
    //   let button: HTMLElement | null = null
    //   await waitFor(() => {
    //     button = screen.getByRole('button')
    //     expect(button).toBeInTheDocument()
    //   })
    //
    //   await user.click(button as unknown as HTMLElement)
    //   expect(button).not.toBeInTheDocument()
    //
    ///////////////////////////////////////////////////////////////////////////
  })

  /* ======================

  ====================== */

  test('should be disabled.', () => {
    render(<Button disabled>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    // expect(button).not.toBeEnabled() // eslint-disable-line
    expect(button).toBeDisabled()
  })
})
