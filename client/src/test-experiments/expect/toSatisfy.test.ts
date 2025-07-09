/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Type: (predicate: (value: any) => boolean) => Awaitable<void>
//
// This assertion checks if a value satisfies a certain predicate. A predicate
// is a function that returns a boolean value. The function takes one argument
// and performs a test on it. If the test passes, the function returns true;
// if the test fails, it returns false.
//
// The toSatsify assertion in Vitest is used to check if a certain value satisfies
// a predicate function. In other words, it checks if the value, when passed as an
// argument to the predicate function, returns true.
//
///////////////////////////////////////////////////////////////////////////

describe('toSatisfy...', () => {
  describe('Part 1', () => {
    const isOdd = (value: number) => value % 2 !== 0

    it('pass with 0', () => {
      expect(1).toSatisfy(isOdd)
    })

    it('pass with negation', () => {
      expect(2).not.toSatisfy(isOdd)
    })
  })

  // In the above example, isOdd is a predicate function that checks if a number is odd.
  // The toSatisfy assertion is used to check if the number 1 satisfies the isOdd predicate
  // (i.e., if 1 is an odd number). Since 1 is an odd number, isOdd(1) returns true, so the test passes.
  //
  // In the second test, the .not negates the assertion, so it checks that 2 does not satisfy the isOdd
  // predicate. Since 2 is not an odd number, isOdd(2) returns false, so the test also passes.
  //
  // This is kind of like the Typescript typeguard function equivalent in testing. In the following
  // example we're using an actual typeguard to check the value of a string array. The goal is to test
  // the value, but we're also implicitly testing typeguard.

  describe('Part 2', () => {
    const isStringArray = (array: unknown[]): array is string[] => {
      if (!Array.isArray(array)) {
        return false
      }
      return array.every((item) => typeof item === 'string')
    }

    it('should satisfy isStringArray()', () => {
      expect([]).toSatisfy(isStringArray)
      expect(['1', '2', '3']).toSatisfy(isStringArray)
      expect(['a', 'b', true]).not.toSatisfy(isStringArray)
    })
  })

  // Here's a super basic example:
  describe('Part 3', () => {
    const isPositive = (value: number) => value > 0

    it('should satisfy isPositive()', () => {
      expect(3).toSatisfy(isPositive)
      expect(-1).not.toSatisfy(isPositive)
    })
  })
})
