class User {
  constructor(
    public name: string,
    public email: string
  ) {
    this.name = name
    this.email = email
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (key: any, received?: any) => Awaitable<void>
//
// toHaveProperty asserts if a property at provided reference key exists for
// an object. You can provide an optional value argument also known as deep equality,
// like the toEqual matcher to compare the received property value.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveProperty...', () => {
  it(`should have a property of 'name'.`, () => {
    const user = new User('DaveMan', 'david@example.com')

    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email', 'david@example.com')
    expect(user).not.toHaveProperty('age')
  })
})
