import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              tablePlugin
======================================================================== */

export const tablePlugin = plugin(function (pluginApi) {
  const { addComponents, addBase /*, theme */ } = pluginApi

  const borderColor = 'var(--color-neutral-400)'

  // Gotcha: In Tailwind v4, :root styles can't be applied from within addComponents(),
  // but they can be applied from within addBase().
  addBase({
    ':root': {
      '--table-bg': 'transparent',
      '--table-border-color': `${borderColor}`,
      '--table-striped-bg': 'var(--color-violet-50)', // Was: 'rgba(0,0,0,0.04)'
      '--table-striped-color': '#333',
      '--table-hover-bg': 'var(--color-violet-200)', // Was: 'rgba(0,0,0,0.075)',
      '--table-hover-color': '#333',
      '--table-active-bg': 'var(--color-green-300)', // Was: '--table-active-bg': 'rgba(0,0,0, 0.1)',
      '--table-active-color': '#333', // ???
      '--table-group-divider-color': 'var(--table-border-color)' // ???
    }
  })

  addComponents({
    //! Gotcha: .table conflicts with Tailwind's .table
    //! This needs fixing................................................................................
    '.table': {
      backgroundColor: 'var(--table-bg)',
      borderCollapse: 'collapse',
      boxSizing: 'border-box',
      captionSide: 'bottom',
      fontSize: 'var(--text-base)',
      width: '100%',
      margin: '0',
      verticalAlign: 'top',
      borderColor: 'var(--table-border-color)',
      position: 'relative'
    },

    '.table > :not(caption) > * > *': {
      padding: 'calc(var(--spacing)*2)',
      borderBottomWidth: '1px'
    },

    /* ======================
      .table-group-divider
    ====================== */

    '.table-group-divider': {
      borderTop: '1.5px solid var(--table-group-divider-color)'
    },

    /* ======================
          .caption-top
    ====================== */

    '.caption-top': {
      captionSide: 'top'
    },

    /* ======================
      .table-xs, .table-sm
    ====================== */

    '.table-xs > :not(caption) > * > *': {
      fontSize: 'var(--text-xs)',
      padding: 'calc(var(--spacing)*0.5)'
    },

    '.table-sm > :not(caption) > * > *': {
      fontSize: 'var(--text-sm)',
      padding: 'var(--spacing)'
    },

    /* ======================
          .table-bordered
    ====================== */
    // Adds vertical column borders and a border around the entire table.

    '.table-bordered > :not(caption) > *': {
      borderWidth: '1px 0px'
    },

    '.table-bordered > :not(caption) > * > *': {
      borderWidth: '0px 1px'
    },

    /* ======================
        .table-borderless
    ====================== */
    // Removes horizontal bottom border for each row.

    '.table-borderless > :not(caption) > * > *': {
      borderBottomWidth: '0px'
    },

    '.table-borderless > :not(:first-child)': {
      borderTopWidth: '0px'
    },

    /* ======================
          .table-striped
    ====================== */

    '.table-striped > tbody > tr:nth-of-type(even) > *': {
      backgroundColor: 'var(--table-striped-bg)',
      color: 'var(--table-striped-color)'
    },

    '.table-striped-data > tbody > tr:nth-of-type(even) > td': {
      backgroundColor: 'var(--table-striped-bg)',
      color: 'var(--table-striped-color)'
    },

    '.table-striped-columns > :not(caption) > tr > :nth-child(even)': {
      color: 'var(--table-striped-color)',
      backgroundColor: 'var(--table-striped-bg)'
    },

    //# Todo: table-striped-data-columns

    /* ======================
          .table-active
    ====================== */

    '.table-active, .table-active> th, .table-active > td': {
      color: 'var(--table-active-color) !important',
      backgroundColor: 'var(--table-active-bg) !important'
    },

    '.table-active-data, .table-active-data > td': {
      color: 'var(--table-active-color) !important',
      backgroundColor: 'var(--table-active-bg) !important'
    },

    /* ======================
          .table-hover
    ====================== */
    // This was just '.table-hover > tbody > tr:hover > *', but we now
    // need a higher specificity to override '.table-striped-data'.
    // Also, !important is used here to override .table-active.
    // Hover styles should always have the highest precedence.
    // After that, .table-active and .table-active-data should
    // have precedence over striping

    '.table-hover > tbody > tr:hover > *': {
      backgroundColor: 'var(--table-hover-bg) !important',
      color: 'var(--table-hover-color) !important'
    },

    '.table-hover-data > tbody > tr:hover > td': {
      backgroundColor: 'var(--table-hover-bg) !important',
      color: 'var(--table-hover-color) !important'
    },

    /* ======================
      .header-footer-accent
    ====================== */

    '.header-footer-accent > thead, .header-footer-accent > tfoot': {
      backgroundColor: 'var(--color-blue-50)'
    },

    /* ======================
        .table-flush
    ====================== */

    '.table-flush': {
      // Recently updated from 'thead > tr' to 'thead > tr:first-child
      'thead > tr:first-child': {
        borderTop: 'none'
      },

      'thead > tr > th:first-child, thead > tr > td:first-child': {
        borderLeft: 'none'
      },

      'thead > tr > th:last-child, thead > tr > td:last-child': {
        borderRight: 'none'
      },

      'tbody > tr > td:first-child, tbody > tr > th:first-child': {
        borderLeft: 'none'
      },

      'tbody > tr > td:last-child, tbody > tr > th:last-child': {
        borderRight: 'none'
      },

      'tbody > tr:first-child': {
        borderTop: 'none'
      },

      'tbody > tr:last-child': {
        borderBottom: 'none'
      },

      'tbody > tr:last-child td, tbody > tr:last-child th': {
        borderBottom: 'none'
      },

      'tfoot > tr': {
        borderBottom: 'none'
      },

      'tfoot > tr:last-child th, tfoot > tr:last-child td': {
        borderBottom: 'none'
      },

      'tfoot > tr > th:first-child, tfoot > tr > td:first-child': {
        borderLeft: 'none'
      },

      'tfoot > tr > th:last-child, tfoot > tr > td:last-child': {
        borderRight: 'none'
      }
    },

    /* ======================
        .table-container
    ====================== */

    // For SimpleTable component implementation.
    '.overlay-scrollbars-table-container': {
      // This shoudl still work in v4.
      '--table-container-srollbar-color': 'theme(colors.violet.800/40%)',

      '--table-container-srollbar-hover-color': 'var(--color-violet-800)',
      '--table-container-border-color': `${borderColor}`,
      borderColor: 'var(--table-container-border-color)',
      borderStyle: 'solid',
      position: 'relative',

      // Styles for OverlayScrollbars, which is much nicer than using ::-webkit-scrollbar
      // https://kingsora.github.io/OverlayScrollbars/
      // https://www.npmjs.com/package/overlayscrollbars-react
      '.os-scrollbar': {
        '--os-size': '7px',
        '--o-pading-axis': '2px',
        '--os-handle-bg': 'var(--table-container-srollbar-color)'
      },

      '.os-scrollbar-horizontal': {
        bottom: '-1.5px'
      },

      '.os-scrollbar-vertical': {
        right: '-1.5px'
      },

      '&:hover': {
        '.os-scrollbar': {
          '--os-handle-bg': 'var(--table-container-srollbar-hover-color)'
        }
      }
    },

    // For JSX implementation.
    '.table-container': {
      '--table-container-srollbar-color': 'var(--color-neutral-500)',
      '--table-container-scrollbar-bg': 'transparent',
      '--table-container-border-color': `${borderColor}`,
      '-webkit-overflow-scrolling': 'touch',

      borderColor: 'var(--table-container-border-color)',
      borderStyle: 'solid',
      position: 'relative',
      overflowX: 'auto',

      // https://css-tricks.com/almanac/properties/s/scrollbar/
      '&::-webkit-scrollbar': {
        background: 'var(--table-container-scrollbar-bg)',
        boxShadow: 'none',
        height: '5px',
        width: '2.5px',
        zIndex: '9999'
      },

      '&::-webkit-scrollbar-track': {
        display: 'none'
      },

      '&::-webkit-scrollbar-track-piece': {
        boxShadow: 'none'
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--table-container-srollbar-color)',
        borderRadius: '100px',
        boxShadow: 'none'
      },

      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'var(--table-container-srollbar-color)',
        boxShadow: 'none'
      }
    }
  })
})

export default tablePlugin
