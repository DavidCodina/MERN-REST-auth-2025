import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              buttonPlugin
======================================================================== */
//# linkButton: this would be a whole separate function to
//# create all of the link buttons.

export const buttonPlugin = plugin(function (pluginApi) {
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
  createSolidButtonClasses()
  ====================== */

  function createSolidButtonClasses(colors: string[]) {
    return colors.reduce((buttonClasses, color) => {
      const newSolidButtonClass = {
        [`.btn-${color}`]: {
          backgroundColor: `var(--color-${color}-500)`,
          border: `1px solid var(--color-${color}-700)`,
          // Setting borderRadius (and padding) relative to em is much
          // simpler than trying to manage it manually.
          borderRadius: '0.25em',
          boxShadow: '0 2px 2px rgb(0,0,0,0.15)',
          color: 'var(--color-white)',
          cursor: 'pointer',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-bold)',
          outline: 'none',

          textDecoration: 'none',
          transition: 'all 0.05s linear',
          userSelect: 'none',
          verticalAlign: 'middle',
          padding: '0.25em 0.5em',
          // It's better to rely on lineHeight + padding, rather than
          // paddingly only. Why? If your button text wraps, you don't want
          // it to look compressed. That said, the trade-off is that if a user
          // passes in ONLY an <svg>, then the lineHeight will not be applied.

          lineHeight: 'var(--leading-normal)',
          position: 'relative',
          alignItems: 'center',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '0.25em', // So it scales

          '&:hover': {
            // Modern CSS color functions are very flexible and can work with: RGB, Hex, named colors, etc.
            // That said, this still assumes colors that have a full pallete of shades.
            //# Maybe switch to calc(l + 0.025) formula...
            backgroundColor: `oklch(from var(--color-${color}-500) calc(l + (1 - l) * 0.1) c h)`,
            borderColor: `oklch(from var(--color-${color}-700) calc(l + (1 - l) * 0.1) c h)`,
            color: 'var(--color-white)'
          },
          '&:focus-visible': {
            // This still works in v4. For example, this also works:
            //
            //   <div className='[--my-pale-blue:theme(colors.blue.200)]'>
            //     <div className='h-32 w-32 bg-(--my-pale-blue)'></div>
            //   </div>
            boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
          },

          '&:active': {
            boxShadow: 'none',
            transform: 'scale(0.95)'
          },

          '&:active:focus-visible': {
            // This still works in v4
            boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
          },

          '&:disabled': {
            opacity: '0.65',
            pointerEvents: 'none'
          }
        },
        [`.btn-check:focus-visible + .btn-${color}`]: {
          // This still works in v4
          boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
        }
      }

      return { ...buttonClasses, ...newSolidButtonClass }
    }, {})
  }

  /* ======================
  createOutlineButtonClasses()
  ====================== */

  function createOutlineButtonClasses(colors: string[]) {
    return colors.reduce((buttonClasses, color) => {
      const newOutlineButtonClass = {
        [`.btn-outline-${color}`]: {
          backgroundColor: 'transparent',
          border: `1px solid var(--color-${color}-500)`,
          borderRadius: '0.25em',
          boxShadow: '0 2px 2px rgb(0,0,0,0.15)',
          color: `var(--color-${color}-500)`,
          cursor: 'pointer',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-bold)',
          outline: 'none',
          textDecoration: 'none',
          transition: 'all 0.05s linear',
          userSelect: 'none',
          verticalAlign: 'middle',

          padding: '0.25em 0.5em',
          lineHeight: 'var(--leading-normal)',
          position: 'relative',
          alignItems: 'center',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '0.25em', // So it scales

          '&:hover': {
            backgroundColor: `var(--color-${color}-500)`,
            border: `1px solid var(--color-${color}-700)`,
            color: 'var(--color-white)'
          },
          '&:focus-visible': {
            // This still works in v4
            boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
          },

          '&:active': {
            backgroundColor: `var(--color-${color}-500)`,
            border: `1px solid var(--color-${color}-600)`,
            color: theme(`colors.white`),
            boxShadow: 'none',
            transform: 'scale(0.95)'
          },
          '&:active:focus-visible': {
            // This still works in v4
            boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
          },
          '&:disabled, &:disabled:hover': {
            opacity: '0.65',
            pointerEvents: 'none'
          }
        },
        // This must be its own style...
        [`.btn-check:focus-visible + .btn-outline-${color}`]: {
          // This still works in v4
          boxShadow: `0 0 0 0.25rem theme('colors.${color}.500/50%')`
        }
      }

      return { ...buttonClasses, ...newOutlineButtonClass }
    }, {})
  }

  /* ======================
  
  ====================== */

  const solidButtonClasses = createSolidButtonClasses(uniqueColors)
  const outlineButtonClasses = createOutlineButtonClasses(uniqueColors)

  addComponents({
    ...solidButtonClasses,
    ...outlineButtonClasses,

    /* ======================

    ====================== */

    '.btn-is-icon-only': {
      padding: '0.5em 0.5em'
    },

    /* ======================

    ====================== */

    // fontSize.xxs is a custom addition to theme.extend.fontSize in Tailwind config.
    '.btn-xxs': {
      fontSize: 'var(--text-xxs)'
    },

    '.btn-xs': {
      fontSize: 'var(--text-xs)'
    },
    '.btn-sm': {
      fontSize: 'var(--text-sm)'
    },
    '.btn-lg': {
      fontSize: 'var(--text-lg)'
    },
    '.btn-xl': {
      fontSize: 'var(--text-xl)'
    },
    '.btn-2xl': {
      fontSize: 'var(--text-2xl)'
    },
    '.btn-3xl': {
      fontSize: 'var(--text-3xl)'
    },
    '.btn-4xl': {
      fontSize: 'var(--text-4xl)'
    },
    '.btn-5xl': {
      fontSize: 'var(--text-5xl)'
    },
    '.btn-6xl': {
      fontSize: 'var(--text-6xl)'
    },
    '.btn-7xl': {
      fontSize: 'var(--text-7xl)'
    },
    '.btn-8xl': {
      fontSize: 'var(--text-8xl)'
    },
    '.btn-9xl': {
      fontSize: 'var(--text-9xl)'
    },

    /* ======================

    ====================== */

    '.btn-check': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
      pointerEvents: 'none'
    },

    '.btn-check[disabled] + [class^="btn-"], .btn-check:disabled + [class^="btn-"]':
      {
        pointerEvents: 'none',
        filter: 'none',
        opacity: '0.65'
      },

    '.btn-check:checked + [class^="btn-"]': {
      boxShadow: 'none',
      transform: 'scale(0.9)'
    },

    /* ======================

    ====================== */

    '.btn-group, .btn-group-vertical': {
      position: 'relative',
      display: 'inline-flex',
      verticalAalign: 'middle'
    },
    '.btn-group > *, .btn-group-vertical > *': {
      position: 'relative',
      flex: '1 1 auto',
      boxShadow: 'none'
    },

    '.btn-group > .btn-check:checked + *, .btn-group > .btn-check:focus + *, .btn-group > *:hover, .btn-group > *:focus, .btn-group > *:active, .btn-group > *.active, .btn-group-vertical > .btn-check:checked + *, .btn-group-vertical > .btn-check:focus + *, .btn-group-vertical > *:hover, .btn-group-vertical > *:focus, .btn-group-vertical > *:active, .btn-group-vertical > *.active':
      {
        zIndex: '1'
      },
    '.btn-group > *:not(:first-child), .btn-group > .btn-group:not(:first-child)':
      {
        marginLeft: '-1px'
      },

    '.btn-group > *:not(:last-child):not(.dropdown-toggle), .btn-group > .btn-group:not(:last-child) > *':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.btn-group > *:nth-child(n+3), .btn-group > :not(.btn-check) + *, .btn-group > .btn-group:not(:first-child) > *':
      {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },
    '.btn-group-vertical': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    '.btn-group-vertical > *, .btn-group-vertical > .btn-group': {
      width: '100%'
    },
    '.btn-group-vertical > *:not(:first-child), .btn-group-vertical > .btn-group:not(:first-child)':
      {
        marginTop: '-1px'
      },
    '.btn-group-vertical > *:not(:last-child):not(.dropdown-toggle), .btn-group-vertical > .btn-group:not(:last-child) > *':
      {
        borderBottomRightRadius: '0',
        borderBottomLeftRadius: '0'
      },
    '.btn-group-vertical > * ~ *, .btn-group-vertical > .btn-group:not(:first-child) > *':
      {
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0'
      },

    /* ======================

    ====================== */
    // Used by actual Button component. Initially, I used
    // '[class^="btn-"] .btn-inner' as the selector, but that
    // seems like it could potentially lead to specificity issues
    // with utility classes.

    // '.btn-inner': {
    //   alignItems: 'center',
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   justifyContent: 'center',
    //   gap: '0.25em'
    // },

    /* ======================

    ====================== */

    '.btn-close': {
      boxSizing: 'content-box',
      width: '1em',
      height: '1em',
      padding: '0.25em 0.25em',
      color: '#000',
      background: `transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat`,
      border: '0',
      borderRadius: '0.25rem',
      opacity: '0.5', // ???
      '&:hover': {
        color: '#000',
        textDecoration: 'none',
        opacity: '1'
      },
      '&:focus': {
        outline: '0',
        boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
        opacity: '1'
      },
      '&:disabled, &.disabled': {
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: '0.25'
      }
    },
    '.btn-close-white': {
      filter: 'invert(1) grayscale(100%) brightness(200%)'
    }
  })
})

export default buttonPlugin
