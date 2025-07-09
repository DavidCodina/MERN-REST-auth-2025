import { getAsyncValue } from './index'

describe(`getAsyncValue()...`, () => {
  /* ======================

  ====================== */

  it(`should NOT be typeof 'number'.`, async () => {
    // Arrange
    const value = 'abc123'

    // Act
    const received = await getAsyncValue(value)

    // Assert
    expect(received).not.toBeTypeOf('number')
  })

  /* ======================

  ====================== */

  it(`should be typeof 'string'.`, async () => {
    // Arrange
    const value = 'abc123'

    // Act
    const received = await getAsyncValue(value)

    // Assert
    expect(received).toBeTypeOf('string')
  })

  /* ======================

  ====================== */
  // As an alternative to using async/await you can use resolves.
  // https://vitest.dev/api/expect#resolves
  // https://vitest.dev/api/expect#rejects

  it(`should be typeof 'string' (resolves example).`, () => {
    // Arrange
    const value = 'abc123'

    // Act
    const received = getAsyncValue(value)

    // Assert
    expect(received).resolves.toBeTypeOf('string')
    expect(received).resolves.toBe(value)
  })
})
