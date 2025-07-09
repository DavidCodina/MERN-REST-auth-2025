import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              breadcrumbPlugin
======================================================================== */

export const breadcrumbPlugin = plugin(function (pluginApi) {
  const { addComponents, theme } = pluginApi

  addComponents({
    '.breadcrumb': {
      '--breadcrumb-link-color': 'var(--color-blue-500)',
      '--breadcrumb-link-hover-color': 'var(--color-blue-600)',
      '--breadcrumb-separator-color': 'var(--color-neutral-500)',
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      margin: '0px',
      fontSize: theme('fontSize.base'),
      listStyle: 'none'
    },

    '.breadcrumb-item.breadcrumb-active': {
      color: 'var(--color-neutral-600)'
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // The <a> tags are still blue based on the default styling for links.
    // To modify the color and hover color, set Tailwind arbitrary properties
    //
    //   <Breadcrumb
    //     className={`[--breadcrumb-link-color:theme(colors.green.500)] [--breadcrumb-link-hover-color:theme(colors.sky.500)]`}
    //   >
    //
    // But actually, if we assign color and hover color here to CSS custom properties
    // that are not defined, then the colors will NOT fallback to the default styling
    // for links, and will instead fall back to the body color. Thus, I've explicitly
    // set them here to the same as the default <a> colors set in basePlugin.ts.
    //
    ///////////////////////////////////////////////////////////////////////////

    'a.breadcrumb-link': {
      color: 'var(--breadcrumb-link-color)',
      '&:hover': {
        color: 'var(--breadcrumb-link-hover-color)'
      }
    },

    '.breadcrumb-link-underline': {
      textDecoration: 'underline'
    },
    '.breadcrumb-link-no-underline': {
      textDecoration: 'none'
    },
    '.breadcrumb-link-hover-underline': {
      '&:hover': {
        textDecoration: 'underline'
      }
    },

    '.breadcrumb-separator': {
      alignItems: 'center',
      color: 'var(--breadcrumb-separator-color)',
      display: 'flex',
      padding: '0px 8px',
      userSelect: 'none'
    }
  })
})

export default breadcrumbPlugin
