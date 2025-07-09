import plugin from 'tailwindcss/plugin'

/* ========================================================================
                             accordionPlugin
======================================================================== */

export const accordionPlugin = plugin(function (pluginApi) {
  const { addComponents /*, theme */ } = pluginApi

  /* ======================
      borderRadiusFix
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Setting overflow:hidden on '.radix-accordion-item' would prevent corner bleed
  // from the background color set on '.radix-accordion-trigger'. However, it could
  // also obscure anything that pops out of '.radix-accordion-content' (e.g., <select>, dropdown, etc).
  // For this reason,  it's preferable to use an alternate solution. We could use 'inherit' here,
  // but using 'calc(var(--radix-accordion-border-radius) - 1px)' is slightly more accurate.
  //
  // In any case, the trade-off is that trying to set borderRadius through the top-level
  // accordion className will inevitably fail. The correct solution is to always use
  // somethign like [--radix-accordion-border-radius:25px].
  //
  ///////////////////////////////////////////////////////////////////////////

  const borderRadiusFix = {
    '.radix-accordion-item:first-child .radix-accordion-header': {
      borderTopLeftRadius: 'calc(var(--radix-accordion-border-radius) - 1px)',
      borderTopRightRadius: 'calc(var(--radix-accordion-border-radius) - 1px)'
    },

    '.radix-accordion-item:last-child .radix-accordion-header': {
      '&[data-state=closed]': {
        transition:
          'border-radius 0s linear var(--radix-accordion-animation-duration)',
        borderBottomLeftRadius:
          'calc(var(--radix-accordion-border-radius) - 1px)',
        borderBottomRightRadius:
          'calc(var(--radix-accordion-border-radius) - 1px)'
      }
    },

    '.radix-accordion-item:first-child .radix-accordion-trigger': {
      borderTopLeftRadius: 'calc(var(--radix-accordion-border-radius) - 1px)',
      borderTopRightRadius: 'calc(var(--radix-accordion-border-radius) - 1px)'
    },

    '.radix-accordion-item:last-child .radix-accordion-trigger': {
      '&[data-state=closed]': {
        transition:
          'border-radius 0s linear var(--radix-accordion-animation-duration)',
        borderBottomLeftRadius:
          'calc(var(--radix-accordion-border-radius) - 1px)',
        borderBottomRightRadius:
          'calc(var(--radix-accordion-border-radius) - 1px)'
      }
    },

    '.radix-accordion-item:last-child .radix-accordion-content': {
      borderBottomLeftRadius:
        'calc(var(--radix-accordion-border-radius) - 1px)',
      borderBottomRightRadius:
        'calc(var(--radix-accordion-border-radius) - 1px)'
    }
  }

  /* ======================

  ====================== */

  addComponents({
    '@keyframes radixAccordionSlideDown': {
      '0%': {
        height: '0px',
        // overflow is technically not animatable, but this will still work in regular CSS.
        // Conversely, Framer Motion would likely not allow this.
        overflow: 'hidden'
      },

      '99.5%': {
        overflow: 'hidden'
      },
      '100%': {
        // This custom property is exposed by Radix.
        height: 'var(--radix-accordion-content-height)',
        overflow: 'visible'
      }
    },

    '@keyframes radixAccordionSlideUp': {
      '0%': {
        // This custom property is exposed by Radix.
        height: 'var(--radix-accordion-content-height)',
        overflow: 'hidden'
      },
      '100%': {
        height: '0px',
        overflow: 'hidden'
      }
    },

    '.radix-accordion-root': {
      '--radix-accordion-border-color': 'var(--color-stone-300)',
      '--radix-accordion-border-radius': 'var(--radius-lg)',
      '--radix-accordion-trigger-color': 'var(--color-neutral-700)',
      '--radix-accordion-trigger-hover-color': 'var(--color-neutral-700)',
      '--radix-accordion-trigger-active-color':
        'var(--radix-accordion-trigger-color)',
      '--radix-accordion-trigger-bg': '#fff',
      '--radix-accordion-trigger-hover-bg': 'var(--color-stone-100)',

      '--radix-accordion-trigger-active-bg':
        'var(--radix-accordion-trigger-bg)',
      '--radix-accordion-trigger-font-size': 'var(--text-base)',
      '--radix-accordion-trigger-outline-color': 'var(--color-blue-500)',

      '--radix-accordion-chevron-size': '1.5em',
      '--radix-accordion-chevron-color': 'currentColor',

      '--radix-accordion-content-bg': '#fff',
      '--radix-accordion-animation-duration': '300ms',

      border: '1px solid var(--radix-accordion-border-color)',
      // This is not intended as to be used like an actual backgroundColor.
      // Instead it actually sets the color of the lines BETWEEN item triggers.
      // In practice, this  means we must explicitly set a backgroundColor on
      // the Header and Content.
      backgroundColor: 'var(--radix-accordion-border-color)',
      borderRadius: 'var(--radix-accordion-border-radius)'
    },

    '.radix-accordion-item': {
      marginTop: '1px',
      // overflow:'hidden' helps prevent the borders of <AccordionTrigger> &
      // <AccordionContent> from edging out. However, it's possible that this
      // could lead to issues if/when an AccordionItem has dropdown, dropdown select, etc.
      // For this reason, the borderRadiusFix is used instead.
      position: 'relative',

      '&:focus-within': {
        // ❌ Doing this will actually obscure overhangin content in content higher up.
        // But not doing it can cause the bottom part of the :focus-within outline to be
        // obscured. The fix is to actually give the outline an offset of -1px.
        // zIndex: '1'
      },

      '&:first-child': {
        marginTop: '0px',
        borderTopRightRadius: 'inherit',
        borderTopLeftRadius: 'inherit'
      },

      '&:last-child': {
        borderBottomRightRadius: 'inherit',
        borderBottomLeftRadius: 'inherit'
      }
    },

    '.radix-accordion-header': {
      display: 'flex',
      lineHeight: '1',
      margin: '0px'
    },

    '.radix-accordion-trigger': {
      alignItems: 'center',
      backgroundColor: 'var(--radix-accordion-trigger-bg)',
      color: 'var(--radix-accordion-trigger-color)',
      display: 'flex',
      flex: '1 1 0%',
      // Accordion.Header is an <h3> by default, so we definitely want to constrain the fontSize.
      fontSize: 'var(--radix-accordion-trigger-font-size)',
      fontWeight: 'bold',
      justifyContent: 'space-between',
      lineHeight: '1',
      padding: 'calc(var(--spacing)*3) calc(var(--spacing)*4)',
      position: 'relative',
      // Target specific properties to avoid interferting with
      // the transition in the borderRadiusFix.
      transition: 'color 100ms linear, background-color 100ms linear',
      width: '100%',

      '&:hover': {
        backgroundColor: 'var(--radix-accordion-trigger-hover-bg)',
        color: 'var(--radix-accordion-trigger-hover-color)'
      },
      '&:focus-within': {
        outlineOffset: '-1px',
        outline: '2px solid var(--radix-accordion-trigger-outline-color)'
      },

      '&[data-state=open]:not(:hover)': {
        color: 'var(--radix-accordion-trigger-active-color)',
        backgroundColor: 'var(--radix-accordion-trigger-active-bg)'
      },

      '&[data-state=open] .radix-accordion-chevron': {
        transform: 'rotate(180deg)'
      }
    },

    '.radix-accordion-chevron': {
      color: 'var(--radix-accordion-chevron-color)',
      transition: 'transform var(--radix-accordion-animation-duration) linear',
      height: 'var(--radix-accordion-chevron-size)',
      // This will have no effect when chevron is smaller, but
      // when chevron is larger, it will prevent it from pushing
      // out the trigger height.
      margin: '-25px 0px'
    },

    '.radix-accordion-content': {
      backgroundColor: 'var(--radix-accordion-content-bg)',
      // Create a quasi top border line that matches the rest of the borders.
      boxShadow: 'inset 0px 1px 0px var(--radix-accordion-border-color)',

      fontSize: 'var(--text-base)', // ??? Do I want to hardcode this?
      // ❌ padding: ...
      '&[data-state=closed]': {
        animation:
          'radixAccordionSlideUp var(--radix-accordion-animation-duration) linear'
      },

      '&[data-state=open]': {
        animation:
          'radixAccordionSlideDown var(--radix-accordion-animation-duration) linear'
      }
    },
    ...borderRadiusFix
  })
})

export default accordionPlugin
