import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              badgePlugin
======================================================================== */
// Could have a filled version in addition to outline version - like Mantine.
// At present these are sort of a outline/filled hybrid.

///////////////////////////////////////////////////////////////////////////
//
// Usage: Go to your tailwind.config.js and do:
//
//   plugins: [badgePlugin, ... ]
//
// Test with:
//
// <div className='flex flex-wrap items-center justify-center gap-2'>
//   <span className='badge-red hover:badge-green'>Red Badge</span>
//   <span className='badge-orange'>Orange Badge</span>
//   <span className='badge-amber'>Amber Badge</span>
//   <span className='badge-yellow'>Yellow Badge</span>
//   <span className='badge-lime'>Lime Badge</span>
//   <span className='badge-green'>Green Badge</span>
//   <span className='badge-emerald'>Emerald Badge</span>
//   <span className='badge-teal'>Teal Badge</span>
//   <span className='badge-cyan'>Cyan Badge</span>
//   <span className='badge-sky'>Sky Badge</span>
//   <span className='badge-blue'>Blue Badge</span>
//   <span className='badge-indigo'>Indigo Badge</span>
//   <span className='badge-violet'>Violet Badge</span>
//   <span className='badge-purple'>Purple Badge</span>
//   <span className='badge-fuchsia'>Fuchsia Badge</span>
//   <span className='badge-pink'>Pink Badge</span>
//   <span className='badge-rose'>Rose Badge</span>
//   <span className='badge-brown'>Brown Badge</span>
//   <span className='badge-slate'>Slate Badge</span>
//   <span className='badge-gray'>Gray Badge</span>
//   <span className='badge-zinc'>Zinc Badge</span>
//   <span className='badge-neutral'>Neutral Badge</span>
//   <span className='badge-stone'>Stone Badge</span>
// </div>
//
///////////////////////////////////////////////////////////////////////////

export const badgePlugin = plugin(function (pluginApi) {
  // Here we can create a plugin using addBase, addComponents, or addUtilities.
  const { addComponents, theme } = pluginApi

  const colors = theme('colors')

  const colorsArray = Object.keys(colors)
    .map((key) => key.split('-')[0])
    .filter((v) => {
      if (
        typeof v !== 'string' ||
        v === '__CSS_VALUES__' ||
        v === 'black' ||
        v === 'white'
      ) {
        return false
      }
      return true
    })

  const uniqueColors = [...new Set(colorsArray)] as string[] //! Added  on Jan 2025

  /* ======================
      createBadgeClasses()
  ====================== */

  function createBadgeClasses(colors: string[]) {
    return colors.reduce((badgeClasses, color) => {
      // If the typeof value is an object, then we know it's a color with
      // shades (i.e., not inherit, currentColor, transparent, black, white)
      // In that case, dynamically generate a newBadgeClass.
      const newBadgeClass = {
        [`.badge-${color}`]: {
          lineHeight: 'var(--leading-normal)',
          padding: 'calc(var(--spacing)*0.5) var(--spacing)',
          backgroundColor: `var(--color-${color}-200)`,
          color: `var(--color-${color}-700)`,
          borderRadius: 'var(--radius-lg)',
          border: `1px solid var(--color-${color}-700)`,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-bold)'
        }
      }

      return { ...badgeClasses, ...newBadgeClass }
    }, {})
  }

  const badgeClasses = createBadgeClasses(uniqueColors)

  // Will log to terminal not browser: console.log(badgeClasses)
  // Because this is being added as a comonent, we can still overwrite it with utility classes.
  addComponents({ ...badgeClasses })
})

export default badgePlugin
