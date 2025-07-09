import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              tabsPlugin
======================================================================== */

export const tabsPlugin = plugin(function (pluginApi) {
  const { addComponents } = pluginApi

  addComponents({
    /* ======================
          .tabs
    ====================== */

    '.tabs': {
      '--tabs-bg-color': '#fafafa',
      '--tabs-border-color': '#ccc',
      '--tabs-border-radius': '5px'
    },

    /* ======================
          .nav-tabs
    ====================== */

    '.nav-tabs': {
      boxSizing: 'border-box',
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '12px',
      listStyle: 'none',
      marginBottom: '-1px',
      marginLeft: '10px',
      marginRight: '10px',
      position: 'relative'
    },

    /* ======================
      .nav-tabs-vertical
    ====================== */
    /* Gotcha: With the vertical orientation it is possible to have a column
    of tabs buttons that exceed the overall height of the Tab's content.
    For this reason, it's often important to set a consistent min-height
    across all Tab components.

    A similar issue exists whereby one can have only a few tab buttons,
    but if the text is sufficiently verbose it will wrap and again
    push the tab button column height down further than the Tab's content.
    This becomes more likely the less horizontal room is allowed for tab buttons.
    In this case (below), the max-width tops out  at out 200px, and shrinks
    to 150px below 576px screen width.

    That said, the counterforce here is the fact that the narrower the
    screen width becomes, the more likely that content will wrap, and
    consequently increase the height of Tab column. */
    '.nav-tabs-vertical': {
      boxSizing: 'border-box',
      display: 'flex',
      flexFlow: 'column wrap',
      fontSize: '12px',
      listStyle: 'none',
      marginBottom: '10px',
      marginRight: '-1px',
      marginTop: '10px',
      maxWidth: '200px', // ???
      position: 'relative',

      '@media (max-width: 575px)': {
        maxWidth: '150px'
      },

      '@media (max-width: 500px)': {
        maxWidth: '125px'
      },

      '@media (max-width: 450px)': {
        maxWidth: '100px'
      },

      '@media (max-width: 350px)': {
        fontSize: '10px'
      }
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha! In Tailwind v4 the approach to adding media query-based utilities has been modified.
    // This no longer works on its own
    //
    //   '@media (max-width: 575px)': {
    //     '.nav-tabs-vertical': {
    //       maxWidth: '150px'
    //     }
    //   },
    //
    //   '@media (max-width: 500px)': {
    //     '.nav-tabs-vertical': {
    //       maxWidth: '125px'
    //     }
    //   },
    //
    //   '@media (max-width: 450px)': {
    //     '.nav-tabs-vertical': {
    //       maxWidth: '100px'
    //     }
    //   },
    //
    //   '@media (max-width: 350px)': {
    //     '.nav-tabs-vertical': {
    //       fontSize: '10px'
    //     }
    //   },
    //
    // Key differences:
    //
    //  1. The media query is now nested inside the class definition
    //  2. The class selector comes first, followed by the media query
    //  3. The syntax follows a more nested object structure
    //
    ///////////////////////////////////////////////////////////////////////////

    /* ======================
      .nav-tabs-button 
    ====================== */

    '.nav-tabs-button': {
      alignItems: 'center',
      backgroundColor: '#ddd',
      border: '1px solid var(--tabs-border-color)',
      borderRadius: 'var(--tabs-border-radius) var(--tabs-border-radius) 0 0', // ???
      boxSizing: 'border-box',
      color: '#222',
      cursor: 'pointer',
      display: 'flex',
      fontFamily: 'inherit',
      fontSize: '12px',
      justifyContent: 'center',
      lineHeight: '1.5',
      marginRight: '5px',
      padding: '0.5rem 1rem',
      position: 'relative',
      textAlign: 'center',
      textDecoration: 'none',
      textTransform: 'none',
      userSelect: 'none'
    },

    '.nav-tabs-button:last-child': {
      marginRight: '0'
    },

    '.nav-tabs-button.tab-active': {
      backgroundColor: 'var(--tabs-bg-color)',
      borderBottomColor: 'var(--tabs-bg-color)',
      fontWeight: '600'
    },

    '.nav-tabs-button.nav-fill': {
      flex: '1 1 auto',
      textAlign: 'center'
    },

    '.nav-tabs-button.nav-justified': {
      flexBasis: '0',
      flexGrow: '1',
      textAlign: 'center'
    },

    /* ======================
    .nav-tabs-button-vertical
    ====================== */

    '.nav-tabs-button-vertical': {
      backgroundColor: '#ddd',
      border: '1px solid var(--tabs-border-color)',
      borderRadius: 'var(--tabs-border-radius) 0 0 var(--tabs-border-radius)', // ???
      boxSizing: 'border-box',
      color: '#222',
      cursor: 'pointer',
      display: 'block',
      fontFamily: 'inherit',
      lineHeight: '1.5',
      marginBottom: '5px',
      padding: '0.5rem 1rem',
      position: 'relative',
      textAlign: 'center',
      textDecoration: 'none',
      textTransform: 'none',
      userSelect: 'none'
    },

    '.nav-tabs-button-vertical.tab-active': {
      backgroundColor: 'var(--tabs-bg-color)',
      borderRightColor: 'var(--tabs-bg-color)',
      fontWeight: '600'
    },

    /* ======================
            .tab
    ====================== */

    '.tab': {
      backgroundColor: 'var(--tabs-bg-color)',
      borderColor: 'var(--tabs-border-color)',
      borderRadius: 'var(--tabs-border-radius)', // ???
      borderStyle: 'solid',
      borderWidth: '1px',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      minHeight: '100%',
      /* overflow: scroll; was removed because it obscured select menus.
      The user could still scroll, but because there was no visible scrollbar, it
      wasn't immediately evident. The removal of overflow: scroll should not affect
      preexisting implementations since there is currently no way of limiting the height
      of a tab directly. For Tab components that need height min-height, or max-height set,
      one should instead apply those styles to a child div of Tab component. */
      padding: '25px',
      '-ms-overflow-style': 'none', // IE and Edge
      scrollbarWidth: 'none' // Firefox
    },

    '.tab::-webkit-scrollbar': {
      display: 'none'
    }
  })
})

export default tabsPlugin
