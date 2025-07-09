// https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/src/test/setup.ts
// The actual vitest example ONLY does this, and it works.
// What Robin Wieruch does in his tutorial also works, but is unnecessary.

// Done in Mosh tutorial instead of '@testing-library/jest-dom'.
// However, it seems you need to also do npm i -D @vitest/expect
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest'

import ResizeObserver from 'resize-observer-polyfill'

import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from 'mocks/server'

import { VirtualConsole } from 'jsdom'

/* ======================
  Suppress JSDOM Error
====================== */
// @starting-style is an experimental feature that jsdom is unable to parse.
// This feature is used in the CSS stylesheet for NativeDialog.
// The parser detects it even if you're not explicitly running tests on this
// component or components that use it. It doesn't break any tests, but the
// standard jsdom error adds a bunch of noise to the test output, so I've
// suppressed it here. Update: seems to have been fixed by jsdom": "^24.1.0

const virtualConsole = new VirtualConsole()
virtualConsole.sendTo(console)
const originalConsoleError = console.error

console.error = (...args: any[]) => {
  const errorMessage = args.join(' ')

  const errorToSuppress = 'Could not parse CSS stylesheet'

  if (errorMessage.includes(errorToSuppress)) {
    // It may still be important to know that the error occurred.
    // But I don't want it to output as verbose as it had previously.

    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nJSDom error manually suppressed within setupTests.ts: '${errorToSuppress}'\nThis could happen when using experimental CSS that jsdom is unfamiliar with.`
    )

    return
  }

  // Log other errors
  originalConsoleError(...args)
}

/* ======================
    matchMedia (mock)
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha when using createMiniRouter() :
//
// Error: Uncaught [TypeError: window.matchMedia is not a function]
// This happens because ThemeProvider uses window.matchMedia and ThemeProvider
// is used in is used in RootLayout. For Jest, the official solution to this
// is found here:
//
//   https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
//
//   Object.defineProperty(window, 'matchMedia', {
//     writable: true,
//     // enumerable: true,
//     value: vi.fn().mockImplementation((query) => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: vi.fn(), // Deprecated
//       removeListener: vi.fn(), // Deprecated
//       addEventListener: vi.fn(),
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn()
//     }))
//   })
//
// The Object.defineProperty() static method defines a new property directly on an object,
// or modifies an existing property on an object, and returns the object.
//
// Normally, you'd need to have created an object beforehand. However, the actual window
// object is globally available. However, in this case, the file is not being run in the
// browser. Presumably, the window object here is the one created in memory by JSDOM.
//
// The above solution seems to also work in Vitest, but the official Vitest solution
// looks a little different: https://vitest.dev/guide/mocking.html#globals
//
// Curiously, it doesn't seem like we even need to import matchMedia at all.
// I think it just works because we are accessing this file wherever we do
//
//   import { createMiniRouter } from 'utils'
//
// Update: This issue is also mentioned in a Mosh tutorial 21 of:
// Testing React Apps with React Testing Library. He then goes to
// https://github.com/vitest-dev/vitest/issues/821 to get a solution,
// which is essentially what I'm doing below (more or less).
//
// However, what Mosh actually does is add it directly to this file:
//
//   Object.defineProperty(window, 'matchMedia', {
//     writable: true,
//     value: vi.fn().mockImplementation(query => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: vi.fn(), // deprecated
//       removeListener: vi.fn(), // deprecated
//       addEventListener: vi.fn(),
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn(),
//     })),
//   })
//
// In other words, no vi.stubGlobal, etc.
//
///////////////////////////////////////////////////////////////////////////

const matchMedia = vi.fn((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated
  removeListener: vi.fn(), // Deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('matchMedia', matchMedia) // Now you can access it as `matchMedia` or `window.matchMedia`

/* ======================
   ResizeObserver (mock)
====================== */
// Testing React Apps with React Testing Library video 22.
// ResizeObserver is also not provided by jsom.
// To fix this use https://www.npmjs.com/package/resize-observer-polyfill

global.ResizeObserver = ResizeObserver

/* ======================
  hasPointerCapture (mock)
====================== */
// Testing React Apps with React Testing Library video 22.
// "TypeError: target.hasPointerCapture is not a function" on userEvent click
// https://github.com/testing-library/user-event/discussions/1087

// window.PointerEvent = MockPointerEvent as any; // Not needed.
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()

/* ======================

====================== */

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen()
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

/* =============================================================================

============================================================================= */

// The The Robin Wieruch tutorial does this
// import { expect, afterEach  } from 'vitest'
// import { cleanup } from '@testing-library/react'
// import matchers from '@testing-library/jest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers)

///////////////////////////////////////////////////////////////////////////
//
// The Robin Wieruch tutorial: https://www.robinwieruch.de/vitest-react-testing-library/
// adds in the logic for running a cleanup function after each test  (e.g. clearing jsdom).
// However, KCD lists this as a common mistake:
// https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-cleanup
// "For a long time now cleanup happens automatically (supported for most major testing frameworks)
// and you no longer need to worry about it."
//
// Moreover, the official example in vitest docs doesn't do this.
// For now, I'm omitting this.
//
///////////////////////////////////////////////////////////////////////////
// afterEach(() => { cleanup() })
