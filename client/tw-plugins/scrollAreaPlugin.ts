import plugin from 'tailwindcss/plugin'

/* ========================================================================
                             scrollAreaPlugin
======================================================================== */

export const scrollAreaPlugin = plugin(function (pluginApi) {
  const { addComponents /*, theme */ } = pluginApi

  addComponents({
    // The class applied to ScrollArea.Root does not have any styles applied to it.
    '.radix-scrollarea-root': {
      '--radix-scrollarea-scrollbar-bg': 'transparent',
      '--radix-scrollarea-scrollbar-hover-bg': 'theme(colors.neutral.500/20%)',
      '--radix-scrollarea-scrollbar-size': 'var(--spacing)',
      '--radix-scrollarea-scrollbar-padding': '0px',
      '--radix-scrollarea-thumb-bg': 'var(--color-neutral-500)',
      '--radix-scrollarea-corner-bg': 'transparent'
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // borderRadius:'inherit' will make the borderRadius conform to
    // whatever ScrollArea.Root has on it. However, the scrollbars
    // will still bleed out unless one puts overflow-hidden (overflow:hidden)
    // on the ScrollArea.Root. That said, you probably don't want to do
    // that as a default because you want content to be able to
    // pop out of the container (e.g., dropdowns etc).
    //
    // However, if you're rendering your dropdowns/select menus through
    // portals this won't be an issue anyways.
    //
    // In any case, a happy medium is to omit overflow-hidden on the root,
    // while also defaulting the scrollbar background color to transparent.
    //
    ///////////////////////////////////////////////////////////////////////////
    '.radix-scrollarea-viewport': {
      borderRadius: 'inherit',
      height: '100%',
      width: '100%'
    },

    '.radix-scrollarea-scrollbar': {
      backgroundColor: 'var(--radix-scrollarea-scrollbar-bg)',
      display: 'flex',
      touchAction: 'none', // ???
      userSelect: 'none',
      padding: 'var(--radix-scrollarea-scrollbar-padding)',

      '&:hover': {
        backgroundColor: 'var(--radix-scrollarea-scrollbar-hover-bg)'
      },

      '&[data-orientation=horizontal]': {
        flexDirection: 'column',
        height: 'var(--radix-scrollarea-scrollbar-size)'
      },

      '&[data-orientation=vertical]': {
        width: 'var(--radix-scrollarea-scrollbar-size)'
      }
    },

    '.radix-scrollarea-thumb': {
      backgroundColor: 'var(--radix-scrollarea-thumb-bg)',
      borderRadius: 'var(--radius-xl)',
      flex: '1 1 0%',
      position: 'relative',

      // This is where the magic happens. I think this is what makes it
      // an overlay scrollbar implementation. This may actually work with
      // just standard webkit scrollbars as well (???). That said, the
      // docs say, "Scrollbar sits on top of the scrollable content, taking up no space",
      // so this may be something else entirely.
      '&:before': {
        content: "''",
        height: '100%',
        left: '50%',
        minHeight: 'calc(var(--spacing)*10)',
        minWidth: 'calc(var(--spacing)*10)',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: '100%'
      }
    },
    '.radix-scrollarea-corner': {
      backgroundColor: 'var(--radix-scrollarea-corner-bg)'
    }
  })
})

export default scrollAreaPlugin
