import { useState, useEffect } from 'react'
import userEvent from '@testing-library/user-event'
import {
  render,
  screen
  //, logRoles
} from '@testing-library/react'

const ClickCounter = ({ dataTestId }: { dataTestId?: string }) => {
  const [count, setCount] = useState(0)
  return (
    <button data-testid={dataTestId} onClick={() => setCount((v) => v + 1)}>
      Count: {count}
    </button>
  )
}

const Amount = () => {
  const [value, setValue] = useState('0')
  const [amount, setAmount] = useState(0)

  return (
    <>
      <input
        name='amount'
        onChange={(e) => setValue(e.target.value)}
        type='number'
        value={value}
      />

      <button
        onClick={() => {
          setAmount(parseFloat(value))
        }}
      >
        Set Amount
      </button>

      <div data-testid='amount'>Amount: {amount}</div>
    </>
  )
}

/* ========================================================================

======================================================================== */
// https://testing-library.com/docs/user-event/intro
// https://www.youtube.com/watch?v=pyKS3H2i7gk&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=36
// https://www.youtube.com/watch?v=kqX14UyjhDM&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=37

describe('RTL Interactions...', () => {
  /* ======================

  ====================== */

  test('ClickCounter', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<ClickCounter dataTestId={'click-counter'} />)
    const button = screen.getByTestId('click-counter')

    // Assert
    expect(button).toHaveTextContent('Count: 0')

    // Act
    await user.click(button)
    await user.click(button)

    // Assert
    expect(button).toHaveTextContent('Count: 2')
  })

  /* ======================

  ====================== */

  test('should call mock handleClick when clicked.', async () => {
    const user = userEvent.setup()

    // Mocking Functions: https://www.youtube.com/watch?v=TuxmnyhPdhA&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=42
    const handleClick = vi.fn()

    render(<button onClick={handleClick}>Click Me</button>)

    const button = screen.getByRole('button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /* ======================

  ====================== */

  test('should spy on obj.mock and detect being called when clicked.', async () => {
    const user = userEvent.setup()

    const obj = {
      mockHandler: () => {}
    }
    const spy = vi.spyOn(obj, 'mockHandler')

    render(<button onClick={obj.mockHandler}>Click Me</button>)
    const button = screen.getByRole('button')

    await user.click(button)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  /* ======================

  ====================== */

  test('should be be removed on click.', async () => {
    const RemoveOnClick = () => {
      const [show, setShow] = useState(true)

      return (
        <div>
          {show ? (
            <button onClick={() => setShow(false)}>Click Me</button>
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
          {show && <button onClick={() => setShow(false)}>Click Me</button>}
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
  // Keyboard Interactions: https://www.youtube.com/watch?v=kqX14UyjhDM&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=37

  test('<Amount /> typing...', async () => {
    const user = userEvent.setup()
    render(<Amount />)
    const spinButton = screen.getByRole('spinbutton') as HTMLInputElement
    const button = screen.getByRole('button')
    const amount = screen.getByTestId('amount')

    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha:
    //
    // When you type '10' into the spinButton (i.e., input type="number"), the value is set to the numeric representation of that string,
    // which is 10 (a number). Therefore, when you check the value of the input using expect(input).toHaveValue('10'), it fails because
    // you're comparing a string to a number. This is super confusing because in actual practice, the `value` state is a string.
    //
    //   console.log({ value: spinButton.value, type: typeof spinButton.value })
    //   stdout: { value: '10', type: 'string' }
    //
    // Since the input field is of type number, the browser interprets this string as a numeric value.
    // In practice, the value is returned as a string when accessed via JavaScript, but the internal
    // representation for an input of type number is numeric.
    //
    // Ultimately, what we probably want 99% of the time is toHaveDisplayValue() and NOT toHaveValue().
    // toHaveDisplayValue() is actually what the end user sees.
    //
    //   https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavevalue
    //   https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavedisplayvalue
    //
    ///////////////////////////////////////////////////////////////////////////
    await user.type(spinButton, '10')
    expect(spinButton).toHaveValue(10)
    expect(spinButton).toHaveDisplayValue('10')

    expect(amount).toHaveTextContent('0')
    await user.click(button)
    expect(amount).toHaveTextContent('10')

    await user.clear(spinButton)
    expect(spinButton).toHaveValue(null)
    expect(spinButton).toHaveDisplayValue('')
  })

  /* ======================

  ====================== */

  test('<Amount /> Tabbing...', async () => {
    const user = userEvent.setup()
    render(<Amount />)
    const spinButton = screen.getByRole('spinbutton') as HTMLInputElement
    const button = screen.getByRole('button')

    await user.tab()
    expect(spinButton).toHaveFocus()

    await user.tab()
    expect(button).toHaveFocus()
  })

  /* ======================

  ====================== */

  test('upload file', async () => {
    render(
      <div>
        <label htmlFor='file-uploader'>Upload file:</label>
        <input id='file-uploader' type='file' />
      </div>
    )

    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement
    await userEvent.upload(input, file)

    expect(input.files?.[0]).toBe(file)
    expect(input.files?.item(0)).toBe(file)
    expect(input.files).toHaveLength(1)
  })

  /* ======================

  ====================== */
  // Keyboard API - See here at 8:45:
  // https://www.youtube.com/watch?v=kqX14UyjhDM&list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd&index=38
})
