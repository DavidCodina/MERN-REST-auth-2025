import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,ts}']
    // clearMocks: true, //* This is probably a really good idea, but for now I have it commented out.
    // environment: 'node' // defaults to 'node'
    // setupFiles: './src/setupTests.ts'
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: when using in-source testing: https://vitest.dev/guide/in-source#production-build
  //
  //   "For the production build, you will need to set the define options in your config file,
  //   letting the bundler do the dead code elimination."
  //
  // Adding the define option for development in your vitest.config.ts is generally okay. The primary purpose of setting
  //
  //   define: { 'import.meta.vitest': 'undefined' }
  //
  // is to ensure that the bundler can perform dead code elimination for production builds. This helps to remove any code
  // related to Vitest that is not needed in the production environment. Including this setting in development should not
  // cause any issues, as it simply defines import.meta.vitest as undefined. This can help maintain consistency between your
  // development and production environments, ensuring that any code relying on import.meta.vitest is handled the same way
  // in both cases.
  //
  ///////////////////////////////////////////////////////////////////////////
  define: {
    'import.meta.vitest': 'undefined'
  }
})
