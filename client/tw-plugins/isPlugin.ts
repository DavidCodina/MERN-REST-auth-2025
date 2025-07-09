import plugin from 'tailwindcss/plugin'

export const isPlugin = plugin(function (pluginApi) {
  const { matchVariant } = pluginApi

  // Example of emulating not-hover: selector:
  // <div className='is-[:not(:hover)]:bg-green-500 h-32 w-32 bg-neutral-400' />
  matchVariant(
    'is',
    (value, _extra) => {
      return `&:is(${value})`
    },
    {
      values: {}
    }
  )

  // I couldn't get the `is` variant above to work with Tailwind's `*:` or `[&]:` nested selectors. This
  // is likely because the Tailwind nested selector syntax does not directly support custom variants,
  // which is why I had to create the '*is'. 😡

  matchVariant(
    '*is',
    (value, _extra) => {
      return `& :is(${value})`
    },
    {
      values: {}
    }
  )
})
