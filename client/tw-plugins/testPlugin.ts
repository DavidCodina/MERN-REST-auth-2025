import plugin from 'tailwindcss/plugin'

// In Tailwind v3 we used to be able to do this:
// import type { PluginAPI } from 'tailwindcss/types/config'
// That seems to no longer work in v4, but we can still derive PluginAPI manually.
type PluginFn = Parameters<typeof plugin>[0]
type PluginAPI = Parameters<PluginFn>[0]

/* ========================================================================
                                testPlugin
======================================================================== */

const testPluginFunction = (pluginApi: PluginAPI) => {
  const { addComponents /* , theme */ } = pluginApi
  addComponents({
    '.my-circle': {
      backgroundColor: 'var(--color-sky-500)',
      borderRadius: '50%',
      border: '1px solid var(--color-sky-700)',
      height: '100px',
      width: '100px'
    }
  })
}

export const testPlugin = plugin(function (pluginApi) {
  testPluginFunction(pluginApi)
})

// If you're using the new v4 @plugin "./testPlugin.ts"; syntax, then
// you need to make this a default export.
export default testPlugin
