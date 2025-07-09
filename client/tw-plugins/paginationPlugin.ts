import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              paginationPlugin
======================================================================== */
// Based off of bootstrap@5.2.3

export const paginationPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    '.pagination': {
      '--bs-pagination-padding-x': '0.75rem',
      '--bs-pagination-padding-y': '0.375rem',
      '--bs-pagination-font-size': '1rem',
      '--bs-pagination-color': 'var(--bs-link-color)', // ???
      '--bs-pagination-bg': '#fff',
      '--bs-pagination-border-width': '1px',
      '--bs-pagination-border-color': '#dee2e6',
      '--bs-pagination-border-radius': '0.375rem',
      '--bs-pagination-hover-color': 'var(--bs-link-hover-color)',
      '--bs-pagination-hover-bg': '#e9ecef',
      '--bs-pagination-hover-border-color': '#dee2e6',
      '--bs-pagination-focus-color': 'var(--bs-link-hover-color)',
      '--bs-pagination-focus-bg': '#e9ecef',
      '--bs-pagination-focus-box-shadow':
        '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
      '--bs-pagination-active-color': '#fff',
      '--bs-pagination-active-bg': '#0d6efd',
      '--bs-pagination-active-border-color': '#0d6efd',
      '--bs-pagination-disabled-color': '#6c757d',
      '--bs-pagination-disabled-bg': '#fff',
      '--bs-pagination-disabled-border-color': '#dee2e6',
      display: 'flex',
      paddingLeft: '0px',
      listStyle: 'none'
    },
    '.page-link': {
      position: 'relative',
      display: 'block',
      padding: 'var(--bs-pagination-padding-y) var(--bs-pagination-padding-x)',
      fontSize: 'var(--bs-pagination-font-size)',
      color: 'var(--bs-pagination-color)',
      textDecoration: 'none',
      backgroundColor: 'var(--bs-pagination-bg)',
      border:
        'var(--bs-pagination-border-width) solid var(--bs-pagination-border-color)',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    //# @media (prefers-reduced-motion: reduce) {
    //#   .page-link {
    //#     transition: none;
    //#   }
    //# }

    '.page-link:hover': {
      zIndex: '2',
      color: 'var(--bs-pagination-hover-color)',
      backgroundColor: 'var(--bs-pagination-hover-bg)',
      borderColor: 'var(--bs-pagination-hover-border-color)'
    },

    '.page-link:focus': {
      zIndex: '3',
      color: 'var(--bs-pagination-focus-color)',
      backgroundColor: 'var(--bs-pagination-focus-bg)',
      outline: '0px',
      boxShadow: 'var(--bs-pagination-focus-box-shadow)'
    },

    '.page-link.active, .active > .page-link': {
      zIndex: '3',
      color: 'var(--bs-pagination-active-color)',
      backgroundColor: 'var(--bs-pagination-active-bg)',
      borderColor: 'var(--bs-pagination-active-border-color)'
    },

    '.page-link.disabled, .disabled > .page-link': {
      color: 'var(--bs-pagination-disabled-color)',
      pointerEvents: 'none',
      backgroundColor: 'var(--bs-pagination-disabled-bg)',
      borderColor: 'var(--bs-pagination-disabled-border-color)'
    },

    '.page-item:not(:first-child) .page-link': {
      marginLeft: '-1px'
    },

    '.page-item:first-child .page-link': {
      borderTopLeftRadius: 'var(--bs-pagination-border-radius)',
      borderBottomLeftRadius: 'var(--bs-pagination-border-radius)'
    },

    '.page-item:last-child .page-link': {
      borderTopRightRadius: 'var(--bs-pagination-border-radius)',
      borderBottomRightRadius: 'var(--bs-pagination-border-radius)'
    },

    '.pagination-lg': {
      ' --bs-pagination-padding-x': '1.5rem',
      '--bs-pagination-padding-y': '0.75rem',
      '--bs-pagination-font-size': '1.25rem',
      '--bs-pagination-border-radius': '0.5rem'
    },
    '.pagination-sm': {
      '--bs-pagination-padding-x': '0.5rem',
      '--bs-pagination-padding-y': '0.25rem',
      '--bs-pagination-font-size': '0.875rem',
      '--bs-pagination-border-radius': '0.25rem'
    }
  })
})

export default paginationPlugin
