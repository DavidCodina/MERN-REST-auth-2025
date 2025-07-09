import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              dropdownPlugin
======================================================================== */

export const dropdownPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    '.radix-dropdown-content': {
      // There is no colors.DEFAULT : console.log('\n\nDefault color:', theme('colors'))
      // Because the dropdown menu renders in a portal, 'inherit' will generally be from
      // the <body> element.
      '--radix-dropdown-color': 'inherit',
      '--radix-dropdown-bg': '#fff',
      '--radix-dropdown-font-size': 'var(--text-sm)',
      '--radix-dropdown-border-color': 'var(--color-neutral-500)',
      '--radix-dropdown-border-radius': 'var(--radius-md)',
      '--radix-dropdown-min-width': '220px',
      '--radix-dropdown-padding': 'cacl(var(--spacing)*2)',
      '--radix-dropdown-highlighted-color': 'inherit',
      '--radix-dropdown-highlighted-bg': 'var(--color-neutral-200)',
      '--radix-dropdown-open-color': 'var(--radix-dropdown-highlighted-color)',
      '--radix-dropdown-open-bg': 'var(--radix-dropdown-highlighted-bg)',
      '--radix-dropdown-disabled-color': 'var(--color-neutral-400)',
      '--radix-dropdown-separator-bg': 'var(--color-neutral-300)',
      '--radix-dropdown-boxshadow': 'var(--shadow-lg)',
      backgroundColor: 'var(--radix-dropdown-bg)',
      border: '1px solid var(--radix-dropdown-border-color)',
      borderRadius: 'var(--radix-dropdown-border-radius)',
      boxShadow: 'var(--radix-dropdown-boxshadow)',
      fontSize: 'var(--radix-dropdown-font-size)',
      minWidth: 'var(--radix-dropdown-min-width)',
      padding: 'calc(var(--spacing)*2)'
    },

    '.radix-dropdown-arrow': {
      fill: 'var(--radix-dropdown-bg)',
      filter: `drop-shadow(0px 1.5px 0px var(--radix-dropdown-border-color))`
    },

    // Applied manually by consumer.
    '.radix-dropdown-item': {
      alignItems: 'center',
      borderRadius: 'var(--radix-dropdown-border-radius)',
      color: 'var(--radix-dropdown-color)',
      display: 'flex',
      height: 'calc(var(--spacing)*6)',
      lineHeight: 'none',
      outline: 'none',
      padding: 'var(--radix-dropdown-padding)',
      position: 'relative',
      userSelect: 'none',
      '&[data-disabled]': {
        color: 'var(--radix-dropdown-disabled-color)',
        pointerEvents: 'none'
      },
      '&[data-highlighted]': {
        backgroundColor: 'var(--radix-dropdown-highlighted-bg)',
        color: 'var(--radix-dropdown-highlighted-color)'
      }
    },

    // Applied manually by consumer.
    '.radix-dropdown-item-indicator': {
      alignItems: 'center',
      display: 'inline-flex',
      height: '100%',
      justifyContent: 'center',
      left: '0px',
      position: 'absolute',
      width: 'calc(var(--spacing)*6)'
    },

    // Applied manually by consumer.
    '.radix-dropdown-subtrigger': {
      alignItems: 'center',
      borderRadius: 'var(--radix-dropdown-border-radius)',
      color: 'var(--radix-dropdown-color)',
      display: 'flex',
      height: 'calc(var(--spacing)*6)',
      lineHeight: 'none',
      outline: 'none',
      padding: 'calc(var(--spacing)*0) calc(var(--spacing)*2)',
      position: 'relative',
      userSelect: 'none',
      '&[data-highlighted]': {
        backgroundColor: 'var(--radix-dropdown-highlighted-bg)',
        color: 'var(--radix-dropdown-highlighted-color)'
      },
      '&[data-state=open]': {
        backgroundColor: 'var(--radix-dropdown-open-bg)',
        color: 'var(--radix-dropdown-open-color)'
      },
      '&[data-disabled]': {
        color: 'var(--radix-dropdown-disabled-color)',
        pointerEvents: 'none'
      },
      svg: {
        color: 'currentColor',
        height: '1em',
        marginLeft: 'auto'
      }
    },

    // Applied manually by consumer.
    '.radix-dropdown-separator': {
      backgroundColor: 'var(--radix-dropdown-separator-bg)',
      height: '1px',
      margin: '5px'
    }
  })
})

export default dropdownPlugin
