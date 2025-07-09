import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              startingStylePlugin
======================================================================== */
// https://github.com/tailwindlabs/tailwindcss/discussions/12039
// Frontend FYI: https://www.youtube.com/watch?v=jCqtngrL2pA
// https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
// https://caniuse.com/mdn-css_at-rules_starting-style //❗️ 86% Global Support as of Dec 2024.CSS

export const startingStylePlugin = plugin(function (pluginApi) {
  const { addVariant } = pluginApi
  addVariant('starting', '@starting-style')
})
