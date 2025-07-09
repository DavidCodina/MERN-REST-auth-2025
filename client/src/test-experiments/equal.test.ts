describe('toBe() vs toEqual', () => {
  test('should return 0 with no numbers.', () => {
    const value1 = { name: 'David' }
    const value2 = { name: 'David' }

    // Even though value1 and value2 have the same shape and same
    // property values, they are not the same. In other words, they
    // don't have referential equality. Thus expect(value1).toBe(value2)
    // would fail. Conversely, toEqual() asserts if actual value is equal
    //to received one or has the same structure, if it is an object
    // (compares them recursively).

    expect(value1).not.toBe(value2)
    expect(value1).toEqual(value2)
  })
})
