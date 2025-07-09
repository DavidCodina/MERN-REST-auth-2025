/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: any) => Awaitable<void>
//
// toEqual asserts if actual value is equal to received one or has the same structure, if it is an object (compares them recursively).
//
///////////////////////////////////////////////////////////////////////////

describe('toEqual...', () => {
  // You can see the difference between toEqual and toBe in this example:
  it('should have the same structure.', () => {
    const v1 = { name: 'David', age: undefined }
    const v2 = { name: 'David' }

    expect(v1).toEqual(v2)
  })

  // Note: Just like in Jest, toEqual ignores object keys with undefined properties,
  // undefined array items, array sparseness, or object type mismatch. To take these
  // into account use .toStrictEqual instead.
  it.fails('should have the same structure.', () => {
    const v1 = { name: 'David', age: undefined }
    const v2 = { name: 'David' }

    expect(v1).toStrictEqual(v2) // => ❌
  })
})
