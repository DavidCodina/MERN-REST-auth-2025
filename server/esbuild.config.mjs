///////////////////////////////////////////////////////////////////////////
//
// Note: esbuild does not natively perform type checking or linting; it is primarily a bundler and optimizer.
// This means that it will not exit the build process if there are errors within the code.
// In order to prevent the build when there are Typescript errors we can do the following:
//
//   "build": "npm run typescript && node esbuild.config.mjs",
//   "typescript": "tsc --noEmit",
//
///////////////////////////////////////////////////////////////////////////
import fs from 'fs'
import { execSync } from 'child_process'
import * as esbuild from 'esbuild'
import copyStaticFiles from 'esbuild-copy-static-files'
import dotenv from 'dotenv'

dotenv.config()

// Gotcha: The newish --env-file=.env won't work here.
// Solution: use the good old dotenv package.
const isDev = process.env.NODE_ENV === 'development'

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  // logLevel: 'error',
  platform: 'node',
  minify: true,
  // format: 'esm',
  // Defines global variables to be available during the build process (optional).
  // define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  sourcemap: isDev,
  // watch: false, // Optional for development

  plugins: [
    copyStaticFiles({
      src: './src/public',
      dest: './dist/public',
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true
      // filter: (file) => {
      //   return (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.jpg') || file.endsWith('.png'))
      // }
    })

    // copyStaticFiles({
    //   src: './node_modules/swagger-ui-dist',
    //   dest: './dist',
    //   dereference: true,
    //   errorOnExist: false,
    //   preserveTimestamps: true,
    //   recursive: true,

    //   filter: function (src /*, dest */) {
    //     // The Swagger UI HTML file also has a <script src="./swagger-ui-init.js">.
    //     // However, that seeems to be generated internally.
    //     const needed = [
    //       // Gotcha: you need to include the top-level folder.
    //       './node_modules/swagger-ui-dist',
    //       'node_modules/swagger-ui-dist/favicon-16x16.png',
    //       'node_modules/swagger-ui-dist/favicon-32x32.png',
    //       'node_modules/swagger-ui-dist/swagger-ui-bundle.js',
    //       'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
    //       'node_modules/swagger-ui-dist/swagger-ui.css'
    //     ]
    //     if (needed.indexOf(src) === -1) {
    //       return false
    //     }
    //     return true
    //   }
    // })

    // Or create a custom plugin to copy files over.
    // {
    //   name: 'custom-plugin',
    //   setup(build) {
    //     build.
    //     build.onEnd(async (_result) => {
    //       // Access build results here
    //       // const outputFiles = result.outputFiles
    //       // console.log('Build completed! Output files:', outputFiles);
    //       // Perform post-build actions:
    //       // const cpy = (await import('cpy')).default
    //       // await cpy(
    //       //   [
    //       //     // 'src/**/*.html', // Copy all .html files
    //       //     // 'src/**/*.css', // Copy all .css files
    //       //     'src/**',
    //       //     '!src/**/*.{tsx,ts,js,jsx}' // Ignore already built files
    //       //   ],
    //       //   'dist'
    //       // )
    //     })
    //   }
    // }

    // {
    //   name: 'fix-cloudinary',
    //   setup(build) {
    //     build.onLoad(
    //       {
    //         filter:
    //           /node_modules\/cloudinary\/lib\/utils\/analytics\/getSDKVersions\.js$/
    //       },
    //       async (args) => {
    //         let contents = await fs.promises.readFile(args.path, 'utf8')

    //         ///////////////////////////////////////////////////////////////////////////
    //         //
    //         // Originally I merely replaced this line:
    //         //
    //         //   contents = contents.replace(
    //         //     /const pkgJSONFile = fs\.readFileSync\(path\.join\(__dirname, '\.\.\/\.\.\/\.\.\/package\.json'\), 'utf-8'\);/,
    //         //     `const pkgJSONFile = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8");`
    //         //   )
    //         //
    //         // However, that still makes it dependent on the package.json, which sits outside of
    //         // the dist/. A better approach is to simply pass the package.json version directly from
    //         // here as a interpolated value:
    //         //
    //         ///////////////////////////////////////////////////////////////////////////

    //         const pkgJSONFile = fs.readFileSync(
    //           path.join(process.cwd(), 'package.json'),
    //           'utf-8'
    //         )

    //         const version = JSON.parse(pkgJSONFile).version
    //         // console.log({ type: typeof version, version }) // => { type: 'string', version: '0.0.1' }

    //         contents = contents.replace(
    //           /const pkgJSONFile = fs\.readFileSync\(path\.join\(__dirname, '\.\.\/\.\.\/\.\.\/package\.json'\), 'utf-8'\);/,
    //           ''
    //         )

    //         // It's important that we look for 'default' with single quotes here.
    //         contents = contents.replace(
    //           /const sdkSemver = useSDKVersion === 'default' \? JSON\.parse\(pkgJSONFile\)\.version : useSDKVersion;/,
    //           `const sdkSemver = useSDKVersion === 'default' ? '${version}' : useSDKVersion;`
    //         )

    //         // console.log('After Contents:', contents)
    //         return {
    //           contents,
    //           loader: 'default'
    //         }
    //       }
    //     )
    //   }
    // }
  ]
})

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// This assumes that you do something like this:
//
//   CREATE_ZIP=true npm run build
//
// However, it's still easier to just use something like bestzip:
// "zip": "bestzip upload.zip dist/* package.json", which seems like
// it also does a better job of compressing the files.
//
///////////////////////////////////////////////////////////////////////////

const shouldCreateZip = process.env.CREATE_ZIP === 'true'

if (shouldCreateZip) {
  const temp = 'temp'

  // Create temp folder.
  if (!fs.existsSync(temp)) {
    fs.mkdirSync(temp)
  }

  const commands = [
    //! `mkdir -p ${temp}`,
    `cp -r ../dist ./dist`,
    `cp ../package.json ./package.json`,
    `zip -r ../upload.zip *`,
    `cd .. && rm -rf ${temp}`
  ].join(' && ')

  execSync(commands, { cwd: temp })
}
