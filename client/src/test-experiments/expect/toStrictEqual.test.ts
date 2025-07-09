/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: any) => Awaitable<void>
//
// toStrictEqual asserts if the actual value is equal to the received one or
// has the same structure if it is an object (compares them recursively),
// and of the same type. Differences from .toEqual:
//
//   - Keys with undefined properties are checked. e.g. {a: undefined, b: 2} does not match {b: 2} when using .toStrictEqual.
//
//   - Array sparseness is checked. e.g. [, 1] does not match [undefined, 1] when using .toStrictEqual.
//
//   - Object types are checked to be equal. e.g. A class instance with fields a and b will not equal a literal object with fields a and b.
//
///////////////////////////////////////////////////////////////////////////

describe('toStrictEqual...', () => {
  it('should have the same structure.', () => {
    const v1 = { name: 'David', age: undefined }
    const v2 = { name: 'David' }

    expect(v1).not.toStrictEqual(v2)
  })
})
