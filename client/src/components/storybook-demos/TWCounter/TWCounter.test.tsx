import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TWCounter } from './index'

describe('TWCounter', () => {
  test('should render an element with role of button', () => {
    render(<TWCounter />)
    // // screen.debug()
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  test("should update button text to 'Count: 1' when clicked", async () => {
    const user = userEvent.setup()

    render(<TWCounter />)
    const button = screen.getByRole('button')

    expect(button).toHaveTextContent('Count: 0')
    await user.click(button)
    // screen.debug()
    expect(button).toHaveTextContent('Count: 1')

    // Test that eslint-plugin-jest-dom is set up correctly.
    // expect(button.textContent).toBe('Count: 1')
  })
})
