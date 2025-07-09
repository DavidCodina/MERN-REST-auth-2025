import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              offCanvasPlugin
======================================================================== */

export const offCanvasPlugin = plugin(function (pluginApi) {
  const { addComponents /*, theme */ } = pluginApi

  addComponents({
    /* ======================
          keyframes
    ====================== */

    '@keyframes offcanvas-darken-background': {
      '0%': {
        backgroundColor: 'transparent'
      },
      '100%': {
        backgroundColor: 'var(--offcanvas-overlay-bg, rgba(0, 0, 0, 0.5))'
      }
    },

    '@keyframes offcanvas-lighten-background': {
      '0%': {
        backgroundColor: 'var(--offcanvas-overlay-bg, rgba(0, 0, 0, 0.5))'
      },

      '100%': {
        backgroundColor: 'transparent'
      }
    },

    /* ======================
          .close-button
    ====================== */

    '.offcanvas-close-button': {
      '-webkit-appearance': 'button',
      background: `transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/16px auto no-repeat`,
      border: '0',
      borderRadius: '6px',
      boxSizing: 'content-box',
      color: '#000',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      height: '16px',
      lineHeight: 'inherit',
      margin: '0',
      opacity: '0.5',
      padding: '4px 4px',
      textTransform: 'none',
      width: '16px'
    },

    '.offcanvas-close-button:not(:disabled)': {
      cursor: 'pointer'
    },

    '.offcanvas-close-button:focus:not(:focus-visible)': {
      outline: '0'
    },

    '.offcanvas-close-button:hover': {
      color: '#000',
      opacity: '1',
      textDecoration: 'none'
    },

    '.offcanvas-close-button:focus': {
      boxShadow: '0 0 0 4px rgba(13, 110, 253, 0.25)', // ???
      opacity: '1',
      outline: '0'
    },

    '.offcanvas-close-button:disabled, .offcanvas-close-button.disabled': {
      opacity: '0.25',
      pointerEvents: 'none',
      userSelect: 'none'
    },

    /* ======================
          .offcanvas
    ====================== */

    '.offcanvas': {
      '--offcanvas-width': '250px',
      '--offcanvas-height': '25vh',
      // '--offcanvas-color': ,
      '--offcanvas-bg': '#fff',
      '--offcanvas-border-width': '1px',
      '--offcanvas-border-color': 'rgba(0, 0, 0, 0.175)',

      backgroundClip:
        'padding-box' /*  This slightly changes the way the border looks. */,
      backgroundColor: 'var(--offcanvas-bg)',
      bottom: '0px',
      boxSizing: 'border-box',
      color: 'var(--offcanvas-color)', //^ We might want a fallback.
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      outline: '0px',
      position: 'fixed',
      transition: 'transform 0.3s ease-in-out',
      visibility: 'hidden',
      // Bootstrap uses 1045. Ultimately, we want it to be below
      // toast notifications (9999) and above the Navicon (9997).
      zIndex: '9998',

      /* ======================
              start
      ====================== */

      '&.offcanvas-start': {
        borderRight:
          'var(--offcanvas-border-width) solid var(--offcanvas-border-color)',
        left: '0px',
        top: '0px',
        transform: 'translateX(-100%)',
        width: 'var(--offcanvas-width)'
      },

      /* ======================
                end
      ====================== */

      '&.offcanvas-end': {
        borderLeft:
          'var(--offcanvas-border-width) solid var(--offcanvas-border-color)',
        right: '0',
        top: '0',
        transform: 'translateX(100%)',
        width: 'var(--offcanvas-width)'
      },

      /* ======================
                top
      ====================== */

      '&.offcanvas-top': {
        borderBottom:
          'var(--offcanvas-border-width) solid var(--offcanvas-border-color)',
        height: 'var(--offcanvas-height)',
        left: '0',
        maxHeight: '100%',
        right: '0',
        top: '0',
        transform: 'translateY(-100%)'
      },

      /* ======================
              bottom
      ====================== */

      '&.offcanvas-bottom': {
        borderTop:
          'var(--offcanvas-border-width) solid var(--offcanvas-border-color)',
        height: 'var(--offcanvas-height)',
        left: '0',
        maxHeight: '100%',
        right: '0',
        transform: 'translateY(100%)'
      },

      /* ======================

      ====================== */

      '&.offcanvas-showing, &.offcanvas-show:not(.offcanvas-hiding)': {
        transform: 'none'
      },

      '&.offcanvas-showing, &.offcanvas-hiding, &.offcanvas-show': {
        visibility: 'visible'
      },

      /* ======================

      ====================== */

      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    /* ======================

    ====================== */

    '.offcanvas-bg-darken': {
      animation: 'offcanvas-darken-background 0.75s forwards'
    },

    '.offcanvas-bg-lighten': {
      animation: 'offcanvas-lighten-background 0.75s forwards'
    }
  })
})

export default offCanvasPlugin
