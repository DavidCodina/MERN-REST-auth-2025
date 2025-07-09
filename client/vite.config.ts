///////////////////////////////////////////////////////////////////////////
//
// https://vitest.dev/guide/coverage.html#coverage-providers
// When using vitest, it seems you need to also use
//
//   import { defineConfig } from 'vitest/config'
//
// instead of:
//
//  import { defineConfig } from 'vite'
//
// Otherwise, the 'test' property seems not to be recognized.
// Web Dev Simplified video at 7:05: https://www.youtube.com/watch?v=7f-71kYhK00
// statest that vitest adds additional config operations/properties on top of
// a normal vite project.
//
// That said, by default c8 will be used, and in that case we don't actually
// need to swtiched to 'vitest.config'
//
///////////////////////////////////////////////////////////////////////////

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

///////////////////////////////////////////////////////////////////////////
//
// In order to get absolute paths working, I did this in tsconfig.json: "baseUrl": "src",
// I also installed vite-tsconfig-paths and implemented the plugin here.
// The absolute paths setup that I'm using allows us to do this kind of thing:
// import { Title } from 'components'
//
// I'm not interested in the '@/components' path alias syntax.
// In any case, there's different approaches. What helped the most was just looking
// at the vite-tsconfig-paths docs:
//
//   https://www.npmjs.com/package/vite-tsconfig-paths
//   https://stackoverflow.com/questions/68241263/absolute-path-not-working-in-vite-project-react-ts
//   https://dev.to/avxkim/setup-path-aliases-w-react-vite-ts-poa
//
///////////////////////////////////////////////////////////////////////////

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ///////////////////////////////////////////////////////////////////////////
    //
    // This used to work for styled-components css={``} prop to work.
    // However, it no longer seems to do the trick.
    // https://github.com/vitejs/vite/discussions/4098
    //
    // import macrosPlugin from 'vite-plugin-babel-macros'
    // macrosPlugin(),
    //
    // Instead, I removed vite-plugin-babel-macros, but still have babel-plugin-styled-components.
    // Then I do this:
    //
    ///////////////////////////////////////////////////////////////////////////

    react({
      babel: {
        plugins: ['styled-components'],
        babelrc: false,
        configFile: false
      }
    }),
    tailwindcss(),
    tsconfigPaths() // For path aliases or absolute paths to work.
  ],

  test: {
    // https://vitest.dev/config/ :  Allows global access to describe(), test(), it(), etc.
    // The docs indicate to also add this to tsconfig.json  "compilerOptions": { "types": ["vitest/globals"] }
    // However, that seems problematic because of the way types work. If you define
    // it explicitly, it will ONLY include those items included in types, rather than
    // everything in node_modules/@types. For example, specifying the above type will cause
    // the following error: Property 'toHaveTextContent' does not exist on type 'Assertion<HTMLElement>'.
    // Conversely, removing  "types": ["vitest/globals"] doesn't seem to cause any issues, so
    // for now I'm NOT doing that step. Alternatively, we'd have to look at our node_modules/@types and
    // manually add in every singe thing.
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true, // https://vitest.dev/config/#css

    // https://vitest.dev/guide/in-source.html
    // If you're going to use in-source testing, you need to tell vitest
    // to also look inside of normal files (i.e., non .spec. .test. files).
    includeSource: ['src/**/*.{js,jsx,ts,tsx}']
    // coverage: { provider: 'c8' // No need for this if using 'c8'
  },
  //# What is this?
  // define: { 'import.meta.vitest': false },
  server: {
    port: 3000,

    // The proxy is only applied during development, so
    // we don't necessarily need to worry about modifying it for production.
    // Of course, this assumes that your production server is running on the same
    // domain and not a subdomain.

    //# If this works then add a variable to .env for the SERVER_BASE_URL.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '')
        rewrite: (path) => {
          console.log(path)
          return path
        }
      },

      // '/static' should be reserved for the server, so DO NOT
      // create a client side public/static folder.
      '/static': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log(path)
          return path
        }
      }
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // This resolve configuration is part of the Vite solution for fixing the following error.
  // Uncaught ReferenceError: global is not defined
  // This is a known error that results from using aws-amplify.
  // It also happened when using amazon-cognito-identity-js.
  // The idea is that this will resolve the potential build/deployment issue.
  //
  // The docs don't have a solution specificaly for Vite, but do have a Vue/Vite solution
  // that works the same for React/Vite
  // https://docs.amplify.aws/lib/project-setup/create-application/q/platform/js/#vue-vite-config
  //
  ///////////////////////////////////////////////////////////////////////////

  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser'
      }
    ]
  }
})
