import { getAsyncValue } from './index'

describe(`getAsyncValue()...`, () => {
  it(`should NOT be typeof 'number'.`, async () => {
    const result = await getAsyncValue('abc123')
    expect(result).not.toBeTypeOf('number')
  })

  it(`should be typeof 'string'.`, async () => {
    const result = await getAsyncValue('abc123')
    expect(result).toBeTypeOf('string')
  })

  // As an alternative to using async/await you can use resolves.
  // https://vitest.dev/api/expect#resolves
  // https://vitest.dev/api/expect#rejects
  it(`should be typeof 'string' (resolves example).`, () => {
    const value = 'abc123'
    const result = getAsyncValue(value)

    expect(result).resolves.toBeTypeOf('string')
    expect(result).resolves.toBe(value)
  })
})
