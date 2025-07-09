class User {
  constructor(
    public name: string,
    public email: string
  ) {
    this.name = name
    this.email = email
  }
}

class Car {
  constructor(
    public make: string,
    public model: string
  ) {
    this.make = make
    this.model = model
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (c: any) => Awaitable<void>
//
// toBeInstanceOf asserts if an actual value is instance of received class.
//
///////////////////////////////////////////////////////////////////////////

describe('toBeInstanceOf...', () => {
  it('should be an instanceof User.', () => {
    const user = new User('DaveMan', 'david@example.com')
    expect(user).toBeInstanceOf(User)
    expect(user).not.toBeInstanceOf(Car)
  })
})
