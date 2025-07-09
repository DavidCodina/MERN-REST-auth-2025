import { render, screen } from '@testing-library/react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: string) => Awaitable<void>
//
// toContain asserts if the actual value is in an array. toContain can also check whether
// a string is a substring of another string. If you are running tests in a browser-like environment,
// this assertion can also check if class is contained in a classList, or an element is inside another one.
//
///////////////////////////////////////////////////////////////////////////

describe('toContain...', () => {
  it(`should contain "Muffy".`, () => {
    const received = ['Muffy', 'Gingerbread', 'Punkin']
    const expected = 'Muffy'

    expect(received).toContain(expected)
    expect(received).not.toContain('Fluffy')
  })

  // toContain can also check whether a string is a substring of another string.
  it(`should contain "Man".`, () => {
    const result = 'DaveMan'
    const expected = 'Man'

    expect(result).toContain(expected)
    expect(result).not.toContain('man')
  })

  // Since Vitest 1.0, if you are running tests in a browser-like environment, this assertion can
  // also check if class is contained in a classList, or an element is inside another one.
  it('should have class & is inside other element', () => {
    render(
      <section data-testid='my-section'>
        <div data-testid='my-div' className='flex'>
          abc123
        </div>
      </section>
    )

    const section = screen.getByTestId('my-section')
    const element = screen.getByTestId('my-div')

    // element has a class
    expect(element.classList).toContain('flex') // eslint-disable-line
    // expect(element).toHaveClass('flex')

    // element is inside another one
    expect(section).toContain(element)
  })
})
