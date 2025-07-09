/* ======================
       Tests
====================== */
// For this to work we need to update vitest.configt.ts such that:
// includeSource: ['src/**/*.{js,ts}']
// tsconfig.json also nees to have a "module" value of
// 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.

if (import.meta.vitest) {
  describe('getData()', () => {
    it('should work', () => {
      expect(true).toBe(true)
    })
  })
}
