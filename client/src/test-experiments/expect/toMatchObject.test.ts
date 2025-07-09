/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (received: object | array) => Awaitable<void>
//
// toMatchObject asserts if an object matches a subset of the properties of an object.
// In other words, everything in subset must be included in obj. However, obj can have
// any number of key/value pairs that are not included in subset. The latter point is
// exemplified by the initial test below.
//
///////////////////////////////////////////////////////////////////////////

describe('toMatchObject...', () => {
  it('should match empty subset.', () => {
    const obj = { name: 'David', age: 45, email: 'david@example.com' }
    const subset = {}
    expect(obj).toMatchObject(subset)
  })

  // In this case everything in subset matches something,
  // in obj so it will pass. The important point here is that
  // obj can have additional  properties, but EVERYTHING in subset
  // MUST be included in obj.

  it('should match the subset. (1)', () => {
    const obj = { name: 'David', age: 45, email: 'david@example.com' }
    const subset = { name: 'David', age: 45 }
    expect(obj).toMatchObject(subset)
  })

  // In this case something in subset DOES NOT match something
  // in obj so it will NOT pass. In particular obj does not have
  // an email property.

  it.fails('should match the subset. (2)', () => {
    const obj = { name: 'David', age: 45 }
    const subset = { name: 'David', age: 45, email: 'david@example.com' }
    expect(obj).toMatchObject(subset)
  })

  // In this case, both obj and subset have the same properties, but
  // the email value in subset does not match the email value in obj.

  it.fails('should match the subset. (3)', () => {
    const obj = { name: 'David', age: 45, email: 'david@example.com' }
    const subset = { name: 'David', age: 45, email: 'daveman@example.com' }
    expect(obj).toMatchObject(subset)
  })

  // You can also pass an array of objects. This is useful if you want to check that
  // two arrays match in their number of elements, as opposed to arrayContaining,
  // which allows for extra elements in the received array. Unlike in the previous examples,
  // result can't have additional elements. However, if the array element is an object,
  // that object can have extra key/value pairs.

  test('the array objects must match.', () => {
    const result = [{ foo: 'bar', extra: true }, { baz: 1 }, 'abc123']
    const expected = [{ foo: 'bar' }, { baz: 1 }, 'abc123']

    expect(result).toMatchObject(expected)
  })

  // At first glance, this seems quite similar to toEqual. However, toEqual prohibits extra:true.
  test.fails('the arrays must match exactly.', () => {
    const result = [{ foo: 'bar', extra: true }, { baz: 1 }, 'abc123']
    const expected = [{ foo: 'bar' }, { baz: 1 }, 'abc123']

    expect(result).toEqual(expected)
  })
})
