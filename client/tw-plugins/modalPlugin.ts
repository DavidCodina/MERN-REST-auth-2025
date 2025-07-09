import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              modalPlugin
======================================================================== */

export const modalPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    // No need for Framer Motion, just add a couple of simple keyframes.
    '@keyframes modal-content-open': {
      from: {
        opacity: '0',
        transform: 'scale(0.9)'
      },
      to: {
        opacity: '1',
        transform: 'scale(1)'
      }
    },

    '@keyframes modal-content-closed': {
      from: {
        opacity: '1',
        transform: 'scale(1)'
      },
      to: {
        opacity: '0',
        transform: 'scale(0.9)'
      }
    },

    '@keyframes modal-overlay-open': {
      from: {
        opacity: '0'
      },
      to: {
        opacity: '1'
      }
    },
    '@keyframes modal-overlay-closed': {
      from: {
        opacity: '1'
      },
      to: {
        opacity: '0'
      }
    },
    // In this Radix implementation the overlay also serves as the top-level
    // modal container. Thus if you were comparing this to Bootstrap's .modal,
    // you will see many of the same CSS properties.
    '.radix-modal-overlay': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: '100%',
      inset: '0px', // Or use top:0, left:0
      outline: '0',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'fixed',
      width: '100%',
      // By default the Radix Dialog doesn't even have a zIndex.
      // Instead, it relies entirely on the Portal to put it on top
      // of other content. For the most part that works, but in some
      // cases it needs a little extra help. Bootstrap sets the zIndex
      // of it's modals at 1055. However, the hamburger icon is set at
      // 9998, so we want to use 9999 here.
      zIndex: '9999',
      '&[data-state=closed]': {
        animation: 'modal-overlay-closed 300ms both'
      },
      '&[data-state=open]': {
        animation: 'modal-overlay-open 300ms both'
      }
    },

    '.radix-modal-dialog': {
      // The easiest way to adjust the horizontal/vertical spacing around
      // the dialog is to reset the custom property from within Tailwind,
      // using an arbitrary property. For example:
      // dialogClassName='w-[800px] [--radix-modal-rem-spacing:1.5625rem]'
      '--radix-modal-rem-spacing': '1rem',
      '--radix-modal-border-radius': 'var(--radius-lg)',
      '--radix-modal-border-color': 'var(--color-neutral-500)',

      margin: 'var(--radix-modal-rem-spacing)',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 'calc(100% - var(--radix-modal-rem-spacing) * 2)',
      pointerEvents: 'none',
      position: 'relative',
      // Unless a width is set by the component instance, it will default
      // to whatever 'auto' which will only be constrained by maxWidth.
      width: 'auto'
    },
    // The scrollable styles change the implementation such that the .radix-modal-content
    // container becomes scrollable, rather than relying on the .radix-modal-dialog.
    '.radix-modal-dialog-scrollable': {
      height: 'calc(100% - var(--radix-modal-rem-spacing) * 2)'
    },
    // The only gotcha here is that if you're using dropdowns, selects, etc, that
    // jump out of the modal then you don't want to use this because they will be obscured.
    '.radix-modal-dialog-scrollable .radix-modal-content': {
      maxHeight: '100%',
      overflow: 'hidden'
    },

    '.radix-modal-dialog-scrollable .radix-modal-body': {
      overflowY: 'auto'
    },

    '.radix-modal-dialog-centered': {
      alignItems: 'center',
      display: 'flex',
      minHeight: 'calc(100% - var(--radix-modal-rem-spacing) * 2)'
    },

    '.radix-modal-content': {
      // Bootstrap does this. Do we need it? // ??? ....
      // background-clip: padding-box;
      backgroundColor: '#fff',
      border: '1px solid var(--radix-modal-border-color)',
      borderRadius: 'var(--radix-modal-border-radius)',
      // Do not put padding on content. Instead put it on header, body, and footer.
      boxShadow: 'var(--shadow-lg)',
      // Flex styles are important here so that the following styles work correctly:
      // '.radix-modal-dialog-scrollable .radix-modal-body'
      display: 'flex',
      flexDirection: 'column',
      fontSize: 'var(--text-base)', // ???
      pointerEvents: 'auto',
      position: 'relative',
      // i.e., 100% of whatever the parent .radix-modal-dialog is.
      // The important takeaway here is that width and maxWidth should
      // ALWAYS BE SET ON THE DIALOG! (i.e., dialogClassName/dialogStyle props).
      width: '100%',
      '&:focus': {
        outline: 'none'
      },
      '&[data-state=closed]': {
        animation: 'modal-content-closed 300ms both'
      },

      '&[data-state=open]': {
        animation: 'modal-content-open 300ms both'
      }
    },

    '.radix-modal-header': {
      borderBottom: '1px solid var(--radix-modal-border-color)',
      // The calculation works better than 'inherit', but requires the
      // consumer to be know that they can use --radix-modal-border-radius.
      borderTopRightRadius: 'calc(var(--radix-modal-border-radius) - 1px)',
      borderTopLeftRadius: 'calc(var(--radix-modal-border-radius) - 1px)',
      flexShrink: '0',
      padding: `calc(var(--spacing)*2) calc(var(--spacing)*4)`
    },

    '.radix-modal-title': {
      fontSize: 'var(--text-xl)',
      fontWeight: 'bold',
      margin: '0px'
    },

    '.radix-modal-description': {},

    '.radix-modal-body': {
      borderRadius: 'calc(var(--radix-modal-border-radius) - 1px)',
      flex: '1 1 auto',
      padding: 'calc(var(--spacing)*4)',
      position: 'relative'
    },

    '.radix-modal-footer': {
      alignItems: 'center', // ???
      borderTop: '1px solid var(--radix-modal-border-color)',
      borderBottomRightRadius: 'calc(var(--radix-modal-border-radius) - 1px)',
      borderBottomLeftRadius: 'calc(var(--radix-modal-border-radius) - 1px)',
      display: 'flex',
      flexShrink: '0',
      flexWrap: 'wrap',
      justifyContent: 'center', // ???
      padding: `calc(var(--spacing)*2) calc(var(--spacing)*4)`
    },

    '.radix-modal-close-button': {
      alignItems: 'center',
      appearance: 'none',
      borderRadius: '9999px',
      color: 'var(--color-neutral-500)',
      display: 'inline-flex',
      fontSize: '1rem',
      justifyContent: 'center',
      position: 'absolute',
      right: '10px',
      top: '10px',
      '&:hover': {
        backgroundColor: 'var(--color-neutral-200)'
      },
      '&:focus-visible': {
        boxShadow: '0px 0px 0px 1px var(--color-neutral-500)',
        outline: 'none'
      }
    },

    '.radix-modal-fullscreen': {
      width: '100vw',
      maxWidth: 'none',
      height: '100%',
      margin: '0'
    },
    '.radix-modal-fullscreen .radix-modal-content': {
      height: '100%',
      border: '0',
      borderRadius: '0'
    },
    '.radix-modal-fullscreen .radix-modal-header, .radix-modal-fullscreen .radix-modal-footer':
      {
        borderRadius: '0'
      },
    '.radix-modal-fullscreen .radix-modal-body': {
      overflowY: 'auto'
    }
  })
})

export default modalPlugin
