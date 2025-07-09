import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              formPlugin
======================================================================== */
//# The goal is to create a formPlugin that matches the general styles of buttonPlugin.
//# Create a .btn-form (probably in the buttonPlugin section).

//# Manual test all instances where theme is interpolated.

export const formPlugin = plugin(function (pluginApi) {
  const { addComponents, addBase, theme } = pluginApi

  addBase({
    ':root': {
      '--form-color': '#212529', // ???
      '--form-color-rgb': '33, 37, 41', // ???
      '--form-bg': '#fff', // i.e., form control bg
      // Used for '.form-text', '.form-control::placeholder' and the disabled slider thumb.
      '--form-secondary-color': 'rgba(33, 37, 41, 0.75)',
      // Used below for '--form-disabled-bg'.
      // Also used for the hover background of the file upload button.
      // Also used for '.form-range::-webkit-slider-runnable-track'
      '--form-secondary-bg': '#e9ecef',
      // Used for default bg of file upload button.
      // Also used for '.input-group-text'
      '--form-tertiary-bg': '#f8f9fa',

      '--form-border-width': '1px',
      // Used internally by ReactSelect
      '--form-border-color': 'var(--color-neutral-400)',

      '--form-border-radius': '0.375rem',
      '--form-border-radius-sm': '0.25rem',
      '--form-border-radius-lg': '0.5rem',

      // In Bootstrap .form-control, .form-select & .form-check-input focus border color is hardcoded.
      // I think it would be better to create a --form-focus-border-color & --form-focus-shadow-rgb
      // We would also want to apply it to checks, radios, textareas, switches, and form ranges.
      // Note: If this changes, also update '.form-switch .form-check-input:focus'.
      '--form-focus-border-color': 'var(--color-blue-300)',
      // Used internally by ReactSelect
      //! Using an RGB string like this is a mistake. There's no reason to necessarily do this
      //! since there are multiple ways to dynamically generate a color with Alpha:
      //! https://www.linkedin.com/posts/david-codina-b7b015230_tailwind-one-off-sub-shades-tailwind-v4-activity-7266957759445635072-ojSD
      // v3 blue-400: #60a5fa | rgb(96 165 250)
      '--form-focus-shadow-rgb': '96, 165, 250',
      // Bootstrap doesn't really have a disabled color, or disabled border color.
      // That said, we may want to create them for certain things like the react-select (???).
      // This is used by <label> in various React form components.
      '--form-disabled-color': 'var(--color-neutral-500)',
      '--form-disabled-bg': 'var(--form-secondary-bg)',
      // Used internally by ReactSelect
      '--form-valid-color': 'var(--color-green-500)',
      // Used internally by ReactSelect
      // v3 green-500: #22c55e | rgb(34 197 94)
      '--form-valid-rgb': '34, 197, 94',
      // Used internally by ReactSelect
      '--form-valid-border-color': 'var(--color-green-500)',
      // Used internally by ReactSelect
      '--form-invalid-color': 'var(--color-red-500)',
      // Used internally by ReactSelect
      // v3 red-500: #ef4444 | rgb(239 68 68)
      '--form-invalid-rgb': '239, 68, 68',
      // Used internally by ReactSelect
      '--form-invalid-border-color': 'var(--color-red-500)'
    }
  })

  addComponents({
    /* ======================
        Form Base Styles
    ====================== */

    //# ...

    /* ======================
          .form-label
    ====================== */

    '.form-label': {
      marginBottom: 'var(--spacing)'
    },

    /* ======================
          .form-text
    ====================== */

    '.form-text': {
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--form-secondary-color)'
    },

    /* ======================
          .form-control
    ====================== */

    '.form-control': {
      display: 'block',
      width: '100%',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--form-color)',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--form-bg)',
      backgroundClip: 'padding-box',
      border: 'var(--form-border-width) solid var(--form-border-color)',
      borderRadius: 'var(--form-border-radius)',
      transition:
        'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    '.form-control[type=file]': {
      overflow: 'hidden'
    },

    '.form-control[type=file]:not(:disabled):not([readonly])': {
      cursor: 'pointer'
    },

    '.form-control:focus': {
      color: 'var(--form-color)',
      backgroundColor: 'var(--form-bg)',
      borderColor: 'var(--form-focus-border-color)',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    //# What is this even for?
    '.form-control::-webkit-date-and-time-value': {
      minWidth: '85px',
      height: '1.5em',
      margin: '0px'
    },

    '.form-control::-webkit-datetime-edit': {
      display: 'block',
      padding: '0px'
    },

    '.form-control::-moz-placeholder': {
      color: 'var(--form-secondary-color)',
      opacity: '1'
    },

    '.form-control::placeholder': {
      color: 'var(--form-secondary-color)',
      opacity: '1'
    },

    '.form-control:disabled': {
      backgroundColor: 'var(--form-disabled-bg)',
      opacity: '1'
    },

    // This seems like a fallback for the next style.
    '.form-control::-webkit-file-upload-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      '-webkit-margin-end': '0.75rem',
      'margin-inline-end': '0.75rem',
      color: 'var(--form-color)',
      backgroundVolor: 'var(--form-tertiary-bg)',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px',
      'border-inline-end-width': 'var(--form-border-width)',
      borderRadius: '0px',
      '-webkit-transition':
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

      '@media (prefers-reduced-motion: reduce)': {
        '-webkit-transition': 'none',
        transition: 'none'
      }
    },

    '.form-control::file-selector-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      '-webkit-margin-end': '0.75rem',
      'margin-inline-end': '0.75rem',
      color: 'var(--form-color)',
      backgroundColor: 'var(--form-tertiary-bg)',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px',
      'border-inline-end-width': 'var(--form-border-width)',
      borderRadius: '0px',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    '.form-control:hover:not(:disabled):not([readonly])::-webkit-file-upload-button':
      {
        backgroundColor: 'var(--form-secondary-bg)'
      },

    '.form-control:hover:not(:disabled):not([readonly])::file-selector-button':
      {
        backgroundColor: 'var(--form-secondary-bg)'
      },

    /* ======================
          .dropzone
    ====================== */
    //* New.............................................
    //* See also the validation sections for additional dropzone validation styles.

    '.dropzone': {
      '--dropzone-default-theme-color': 'var(--color-violet-800)',
      '--dropzone-disabled-color': '#ccc', // Too dark: 'var(--form-disabled-color)'
      '--dropzone-preview-size': '100px',
      alignItems: 'center',
      backgroundColor: '#fff',
      // Since there is no definition for --dropzone-theme-color, it will start by using the default.
      // However, when consuming we can do this kind of thing: className='[--dropzone-theme-color:orange]'
      border: `1px dashed var(--dropzone-theme-color, var(--dropzone-default-theme-color))`,
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 'calc(var(--spacing)*6)',
      position: 'relative',
      width: '100%',

      '&:focus': {
        border: '1px solid var(--form-focus-border-color)',
        boxShadow: `0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)`,
        outline: 'none'
      }
    },

    '.dropzone.disabled': {
      border: `1px dashed var(--dropzone-disabled-color)`,
      /* Setting pointerEvents:'none' is important. Otherwise when disabled if
      one drops a file it will open a new tab with that file. */
      pointerEvents: 'none'
    },

    '.dropzone.drag-active, .dropzone.drag-active.is-invalid, .dropzone.drag-active.is-valid':
      {
        borderColor: 'var(--color-green-500)',

        '&:focus': {
          borderColor: 'var(--color-green-500)',
          boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
        }
      },

    /* =================== */

    '.dropzone-p1': {
      fontSize: 'var(--text-lg)',
      fontWeight: 'bold',
      marginBottom: 'var(--spacing)',
      userSelect: 'none'
    },

    '.dropzone-p1-span': {
      color: 'var(--dropzone-theme-color, var(--dropzone-default-theme-color))'
    },

    '.dropzone.disabled .dropzone-p1, .dropzone.disabled .dropzone-p1-span': {
      color: 'var(--dropzone-disabled-color)'
    },

    '.drag-active .dropzone-p1': {
      color: 'var(--color-green-500)'
    },

    /* =================== */

    '.dropzone-p2': {
      color: 'var(--color-gray-600)',
      fontSize: 'var(--text-sm)',
      paddingTop: 'calc(var(--spacing)*2)',
      userSelect: 'none'
    },

    '.dropzone.disabled .dropzone-p2': {
      color: 'var(--dropzone-disabled-color)'
    },

    '.drag-active .dropzone-p2': {
      color: 'var(--color-green-500)'
    },

    '.dropzone-p2-btn': {
      color: 'var(--dropzone-theme-color, var(--dropzone-default-theme-color))',
      fontFamily: 'var(--font-mono)',

      '&:hover': {
        color: 'var(--color-red-500)'
      }
    },

    '.dropzone.disabled .dropzone-p2-btn': {
      color: 'var(--dropzone-disabled-color)'
    },

    '.drag-active .dropzone-p2-btn': {
      color: 'var(--color-green-500)',
      '&:hover': {
        color: 'var(--color-green-500)'
      }
    },

    /* =================== */

    '.dropzone-btn-delete': {
      color: 'var(--dropzone-theme-color, var(--dropzone-default-theme-color))',
      padding: 'calc(var(--spacing)*2)',
      position: 'absolute',
      right: 'calc(var(--spacing)*2)',
      top: 'calc(var(--spacing)*2)',
      zIndex: '1',

      '&:hover': {
        color: 'var(--color-red-500)'
      }
    },

    '.dropzone.disabled .dropzone-btn-delete': {
      color: 'var(--dropzone-disabled-color)'
    },

    '.drag-active .dropzone-btn-delete': {
      color: 'var(--color-green-500)',
      '&:hover': {
        color: 'var(--color-green-500)'
      }
    },

    /* =================== */

    '.dropzone-previews-container': {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'calc(var(--spacing)*4)',
      justifyContent: 'center'
    },

    '.dropzone-preview': {
      display: 'block',
      height: 'var(--dropzone-preview-size)',
      position: 'relative',
      width: 'var(--dropzone-preview-size)'
    },

    '.dropzone-preview-with-img': {
      backgroundColor: '#333',
      border: '1px solid #000',
      borderRadius: 'var(--radius-lg)',
      height: '100%',
      objectFit: 'contain',
      userSelect: 'none',
      width: '100%'
    },

    '.dropzone.disabled .dropzone-preview-with-img': {
      filter: 'grayscale(100%)'
    },

    '.dropzone-preview-without-img': {
      backgroundColor: '#333',
      border: '1px solid #000',
      borderRadius: 'var(--radius-lg)',
      color: '#fff',
      height: '100%',
      fontSize: '10px',
      fontWeight: 'bold',
      padding: 'calc(var(--spacing)*2)',
      width: '100%',
      wordBreak: 'break-all'
    },

    '.dropzone-preview-delete-btn': {
      '--size': '24px',
      alignItems: 'center',
      backgroundColor:
        'var(--dropzone-theme-color, var(--dropzone-default-theme-color))',
      border: `1px solid #fff`,
      borderRadius: 'var(--size)',
      boxShadow: '0px 1px 2px rgba(0,0,0,0.25)',
      color: '#fff',
      display: 'flex',
      fontSize: 'var(--size)',
      height: 'var(--size)',
      justifyContent: 'center',
      position: 'absolute',
      right: '-8px',
      top: '-8px',
      width: 'var(--size)', //! Not great. Needs to be more specific...
      '&:hover': {
        backgroundColor: 'var(--color-red-500)'
      }
    },

    '.dropzone.disabled .dropzone-preview-delete-btn': {
      backgroundColor: 'var(--dropzone-disabled-color)'
    },

    '.dropzone-svg': {
      color: 'var(--dropzone-theme-color, var(--dropzone-default-theme-color))'
    },

    '.dropzone.disabled .dropzone-svg': {
      color: 'var(--dropzone-disabled-color)'
    },

    '.drag-active .dropzone-svg': {
      color: 'var(--color-green-500)'
    },

    /* ======================
      .form-control-plaintext
    ====================== */

    '.form-control-plaintext': {
      display: 'block',
      width: '100%',
      padding: '0.375rem 0',
      marginBottom: '0',
      lineHeight: '1.5',
      color: 'var(--form-color)',
      backgroundColor: 'transparent',
      border: 'solid transparent',
      borderWidth: 'var(--form-border-width) 0'
    },

    '.form-control-plaintext:focus': {
      outline: '0'
    },

    '.form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg':
      {
        paddingRight: '0',
        paddingLeft: '0'
      },

    /* ======================
        .form-control-sm
    ====================== */

    '.form-control-sm': {
      minHeight: 'calc(1.5em + 0.5rem + calc(var(--form-border-width) * 2))',
      padding: '0.25rem 0.5rem',
      fontSize: '0.875rem',
      borderRadius: 'var(--form-border-radius-sm)'
    },

    '.form-control-sm::-webkit-file-upload-button': {
      padding: '0.25rem 0.5rem',
      margin: '-0.25rem -0.5rem',
      '-webkit-margin-end': '0.5rem',
      'margin-inline-end': '0.5rem'
    },

    '.form-control-sm::file-selector-button': {
      padding: '0.25rem 0.5rem',
      margin: '-0.25rem -0.5rem',
      '-webkit-margin-end': '0.5rem',
      'margin-inline-end': '0.5rem'
    },

    /* ======================
        .form-control-lg
    ====================== */

    '.form-control-lg': {
      minHeight: 'calc(1.5em + 1rem + calc(var(--form-border-width) * 2))',
      padding: '0.5rem 1rem',
      fontSize: '1.25rem',
      borderRadius: 'var(--form-border-radius-lg)'
    },

    '.form-control-lg::-webkit-file-upload-button': {
      padding: '0.5rem 1rem',
      margin: '-0.5rem -1rem',
      '-webkit-margin-end': '1rem',
      'margin-inline-end': '1rem'
    },

    '.form-control-lg::file-selector-button': {
      padding: '0.5rem 1rem',
      margin: '-0.5rem -1rem',
      '-webkit-margin-end': '1rem',
      'margin-inline-end': '1rem'
    },

    /* ======================
            textarea
    ====================== */

    'textarea.form-control': {
      minHeight: 'calc(1.5em + 0.75rem + calc(var(--form-border-width) * 2))'
    },

    'textarea.form-control-sm': {
      minHeight: 'calc(1.5em + 0.5rem + calc(var(--form-border-width) * 2))'
    },

    'textarea.form-control-lg': {
      minHeight: 'calc(1.5em + 1rem + calc(var(--form-border-width) * 2))'
    },

    /* ======================
       .form-control-color
    ====================== */
    //# Test that this all works...

    '.form-control-color': {
      width: '3rem',
      height: 'calc(1.5em + 0.75rem + calc(var(--form-border-width) * 2))',
      padding: '0.375rem'
    },

    '.form-control-color:not(:disabled):not([readonly])': {
      cursor: 'pointer'
    },

    '.form-control-color::-moz-color-swatch': {
      border: '0 !important', // ???
      borderRadius: 'var(--form-border-radius)'
    },

    '.form-control-color::-webkit-color-swatch': {
      border: '0 !important',
      borderRadius: 'var(--form-border-radius)'
    },

    '.form-control-color.form-control-sm': {
      height: 'calc(1.5em + 0.5rem + calc(var(--form-border-width) * 2))'
    },

    '.form-control-color.form-control-lg': {
      height: 'calc(1.5em + 1rem + calc(var(--form-border-width) * 2))'
    },

    /* ======================
          .form-select
    ====================== */

    '.form-select': {
      '--form-select-bg-img': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
      display: 'block',
      width: '100%',
      padding: '0.375rem 2.25rem 0.375rem 0.75rem',
      '-moz-padding-start': 'calc(0.75rem - 3px)',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--form-color)',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--form-bg)',
      backgroundImage: `var(--form-select-bg-img), var(--form-select-bg-icon, none)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '16px 12px',
      border: 'var(--form-border-width) solid var(--form-border-color)',
      borderRadius: 'var(--form-border-radius)',
      transition:
        'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    '.form-select:focus': {
      borderColor: 'var(--form-focus-border-color)',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    ".form-select[multiple], .form-select[size]:not([size='1'])": {
      paddingRight: '0.75rem',
      backgroundImage: 'none'
    },

    '.form-select:disabled': {
      backgroundColor: 'var(--form-disabled-bg)'
    },

    '.form-select:-moz-focusring': {
      color: 'transparent',
      textShadow: '0 0 0 var(--form-color)'
    },

    '.form-select-sm': {
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
      paddingLeft: '0.5rem',
      fontSize: '0.875rem',
      borderRadius: 'var(--form-border-radius-sm)'
    },

    '.form-select-lg': {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      paddingLeft: '1rem',
      fontSize: '1.25rem',
      borderRadius: 'var(--form-border-radius-lg)'
    },

    // '[data-bs-theme=dark] .form-select': {
    //   '--form-select-bg-img': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23dee2e6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`
    // },

    /* ======================
          .form-check 
    ====================== */

    // Wraps <input> & <label>

    '.form-check': {
      display: 'block',
      minHeight: '1.5rem',
      paddingLeft: '1.5em',
      marginBottom: '0.125rem'
    },

    '.form-check .form-check-input': {
      float: 'left',
      marginLeft: '-1.5em'
    },

    '.form-check-reverse': {
      paddingRight: '1.5em',
      paddingLeft: '0',
      textAlign: 'right'
    },

    '.form-check-reverse .form-check-input': {
      float: 'right',
      marginRight: '-1.5em',
      marginLeft: '0'
    },

    '.form-check-input': {
      '--form-check-bg': 'var(--form-bg)',
      flexShrink: '0',
      width: '1em',
      height: '1em',
      marginTop: '0.25em',
      verticalAlign: 'top',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--form-check-bg)',
      backgroundImage: 'var(--form-check-bg-image)', //? Where is this defined?
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      border: 'var(--form-border-width) solid var(--form-border-color)',
      '-webkit-print-color-adjust': 'exact',
      colorAdjust: 'exact',
      'print-color-adjust': 'exact'
    },

    '.form-check-input[type=checkbox]': {
      borderRadius: '0.25em'
    },

    '.form-check-input[type=radio]': {
      borderRadius: '50%'
    },

    '.form-check-input:active': {
      filter: 'brightness(90%)'
    },

    '.form-check-input:focus': {
      borderColor: 'var(--form-focus-border-color)',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    '.form-check-input:checked': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd'
    },

    '.form-check-input:checked[type=checkbox]': {
      '--form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e")`
    },

    '.form-check-input:checked[type=radio]': {
      '--form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e")`
    },

    '.form-check-input[type=checkbox]:indeterminate': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      '--form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/%3e%3c/svg%3e")`
    },

    '.form-check-input:disabled': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: '0.5'
    },

    '.form-check-input[disabled] ~ .form-check-label, .form-check-input:disabled ~ .form-check-label':
      {
        cursor: 'default',
        opacity: '0.5'
      },

    /* ======================
          .form-switch
    ====================== */

    '.form-switch': {
      paddingLeft: '2.5em'
    },

    '.form-switch .form-check-input': {
      '--form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e")`,
      width: '2em',
      marginLeft: '-2.5em',
      backgroundImage: 'var(--form-switch-bg)',
      backgroundPosition: 'left center',
      borderRadius: '2em',
      transition: 'background-position 0.15s ease-in-out',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    // This changes the color of the switch's inner circle when focused, but not checked.
    // Originally, it was hardcoded as: 86b7fe (i.e., fill='%2386b7fe').
    // Ideially, we want it to be derived from '--form-focus-border-color',
    // but that's not actually possible. What is possible is interpolating
    // the same color that is currently being used by '--form-focus-border-color'

    '.form-switch .form-check-input:focus': {
      '--form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='${theme('colors.blue-300')}'/%3e%3c/svg%3e")`
    },

    '.form-switch .form-check-input:checked': {
      backgroundPosition: 'right center',
      '--form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e")`
    },

    '.form-switch.form-check-reverse': {
      paddingRight: '2.5em',
      paddingLeft: '0'
    },

    '.form-switch.form-check-reverse .form-check-input': {
      marginRight: '-2.5em',
      marginLeft: '0'
    },

    /* ======================
        .form-check-inline
    ====================== */

    '.form-check-inline': {
      display: 'inline-block',
      marginRight: '1rem'
    },

    /* ======================
          .btn-check
    ====================== */
    //# Why is this here? Is it redundant?
    //# Is it conflicting with what's in buttonPlugin?

    //` .btn ???
    '.btn-check': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
      pointerEvents: 'none'
    },

    //` .btn ???
    '.btn-check[disabled] + .btn, .btn-check:disabled + .btn': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: '0.65'
    },

    // '[data-bs-theme=dark] .form-switch .form-check-input:not(:checked):not(:focus)':
    //   {
    //     '--form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%28255, 255, 255, 0.25%29'/%3e%3c/svg%3e")`
    //   },

    /* ======================
          .form-range
    ====================== */

    '.form-range': {
      width: '100%',
      height: '1.5rem',
      padding: '0',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'transparent'
    },

    '.form-range:focus': {
      outline: '0'
    },

    '.form-range:focus::-webkit-slider-thumb': {
      boxShadow:
        '0 0 0 1px #fff, 0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    '.form-range:focus::-moz-range-thumb': {
      boxShadow:
        '0 0 0 1px #fff, 0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    '.form-range::-moz-focus-outer': {
      border: '0'
    },

    '.form-range::-webkit-slider-thumb': {
      width: '1rem',
      height: '1rem',
      marginTop: '-0.25rem',
      '-webkit-appearance': 'none',
      appearance: 'none',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      '-webkit-transition':
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      '@media (prefers-reduced-motion: reduce)': {
        '-webkit-transition': 'none',
        transition: 'none'
      }
    },

    '.form-range::-webkit-slider-thumb:active': {
      backgroundColor: '#b6d4fe'
    },

    '.form-range::-webkit-slider-runnable-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: 'var(--form-secondary-bg)',
      borderColor: 'transparent',
      borderRadius: '1rem'
    },

    '.form-range::-moz-range-thumb': {
      width: '1rem',
      height: '1rem',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      '-moz-transition':
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',

      '@media (prefers-reduced-motion: reduce)': {
        '-moz-transition': 'none',
        transition: 'none'
      }
    },

    '.form-range::-moz-range-thumb:active': {
      backgroundColor: '#b6d4fe'
    },

    '.form-range::-moz-range-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: 'var(--form-secondary-bg)',
      borderColor: 'transparent',
      borderRadius: '1rem'
    },

    '.form-range:disabled': {
      pointerEvents: 'none'
    },

    '.form-range:disabled::-webkit-slider-thumb': {
      backgroundColor: 'var(--form-secondary-color)'
    },

    '.form-range:disabled::-moz-range-thumb': {
      backgroundColor: 'var(--form-secondary-color)'
    },

    /* ======================
          .form-floating
    ====================== */

    '.form-floating': {
      position: 'relative'
    },

    '.form-floating > .form-control, .form-floating > .form-control-plaintext, .form-floating > .form-select':
      {
        height: 'calc(3.5rem + calc(var(--form-border-width) * 2))',
        minHeight: 'calc(3.5rem + calc(var(--form-border-width) * 2))',
        lineHeight: '1.25'
      },

    '.form-floating > label': {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      height: '100%',
      padding: '1rem 0.75rem',
      overflow: 'hidden',
      textAlign: 'start',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      border: 'var(--form-border-width) solid transparent',
      transformOrigin: '0 0',
      transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-in-out',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none'
      }
    },

    '.form-floating > .form-control, .form-floating > .form-control-plaintext':
      {
        padding: '1rem 0.75rem'
      },

    '.form-floating > .form-control::-moz-placeholder, .form-floating > .form-control-plaintext::-moz-placeholder':
      {
        color: 'transparent'
      },

    '.form-floating > .form-control::placeholder, .form-floating > .form-control-plaintext::placeholder':
      {
        color: 'transparent'
      },

    '.form-floating > .form-control:not(:-moz-placeholder-shown), .form-floating > .form-control-plaintext:not(:-moz-placeholder-shown)':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-control:focus, .form-floating > .form-control:not(:placeholder-shown), .form-floating > .form-control-plaintext:focus, .form-floating > .form-control-plaintext:not(:placeholder-shown)':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-control:-webkit-autofill, .form-floating > .form-control-plaintext:-webkit-autofill':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-select': {
      paddingTop: '1.625rem',
      paddingBottom: '0.625rem'
    },

    '.form-floating > .form-control:not(:-moz-placeholder-shown) ~ label': {
      color: 'rgba(var(--form-color-rgb), 0.65)',
      transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
    },

    '.form-floating > .form-control:focus ~ label, .form-floating > .form-control:not(:placeholder-shown) ~ label, .form-floating > .form-control-plaintext ~ label, .form-floating > .form-select ~ label':
      {
        color: 'rgba(var(--form-color-rgb), 0.65)',
        transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
      },

    '.form-floating > .form-control:not(:-moz-placeholder-shown) ~ label::after':
      {
        position: 'absolute',
        inset: '1rem 0.375rem',
        zIndex: '-1',
        height: '1.5em',
        content: "''",
        backgroundColor: 'var(--form-bg)',
        borderRadius: 'var(--form-border-radius)'
      },

    '.form-floating > .form-control:focus ~ label::after, .form-floating > .form-control:not(:placeholder-shown) ~ label::after, .form-floating > .form-control-plaintext ~ label::after, .form-floating > .form-select ~ label::after':
      {
        position: 'absolute',
        inset: '1rem 0.375rem',
        zIndex: '-1',
        height: '1.5em',
        content: "''",
        backgroundColor: 'var(--form-bg)',
        borderRadius: 'var(--form-border-radius)'
      },

    '.form-floating > .form-control:-webkit-autofill ~ label': {
      color: 'rgba(var(--form-color-rgb), 0.65)',
      transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
    },

    '.form-floating > .form-control-plaintext ~ label': {
      borderWidth: 'var(--form-border-width) 0'
    },

    '.form-floating > :disabled ~ label, .form-floating > .form-control:disabled ~ label':
      {
        color: '#6c757d'
      },

    '.form-floating > :disabled ~ label::after, .form-floating > .form-control:disabled ~ label::after':
      {
        backgroundColor: 'var(--form-secondary-bg)'
      },

    /* ======================
          .input-group
    ====================== */

    '.input-group': {
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      width: '100%'
    },

    '.input-group > .form-control, .input-group > .form-select, .input-group > .form-floating':
      {
        position: 'relative',
        flex: '1 1 auto',
        width: '1%',
        minWidth: '0'
      },

    '.input-group > .form-control:focus, .input-group > .form-select:focus, .input-group > .form-floating:focus-within':
      {
        zIndex: '5'
      },

    // Was '.input-group .btn'
    '.input-group [class^="btn-"]': {
      position: 'relative',
      transform: 'none', // Added to prevent scaling down when active.
      zIndex: '2'
    },

    // Was '.input-group .btn:focus
    '.input-group [class^="btn-"]:focus': {
      zIndex: '5'
    },

    '.input-group-text': {
      display: 'flex',
      alignItems: 'center',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--form-color)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: 'var(--form-tertiary-bg)',
      border: 'var(--form-border-width) solid var(--form-border-color)',
      borderRadius: 'var(--form-border-radius)'
    },

    // Was .input-group-lg > .btn
    '.input-group-lg > .form-control, .input-group-lg > .form-select, .input-group-lg > .input-group-text, .input-group-lg > [class^="btn-"]':
      {
        padding: '0.5rem 1rem',
        fontSize: '1.25rem',
        borderRadius: 'var(--form-border-radius-lg)'
      },

    // Was .input-group-sm > .btn
    '.input-group-sm > .form-control, .input-group-sm > .form-select, .input-group-sm > .input-group-text, .input-group-sm > [class^="btn-"]':
      {
        padding: '0.25rem 0.5rem',
        fontSize: '0.875rem',
        borderRadius: 'var(--form-border-radius-sm)'
      },

    '.input-group-lg > .form-select, .input-group-sm > .form-select': {
      paddingRight: '3rem'
    },

    '.input-group:not(.has-validation) > :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating), .input-group:not(.has-validation) > .dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-control, .input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-select':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.input-group.has-validation > :nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating), .input-group.has-validation > .dropdown-toggle:nth-last-child(n+4), .input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-control, .input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-select':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback)':
      {
        marginLeft: 'calc(var(--form-border-width) * -1)',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },

    '.input-group > .form-floating:not(:first-child) > .form-control, .input-group > .form-floating:not(:first-child) > .form-select':
      {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },

    /* ======================
      Validation (Valid)
    ====================== */

    '.valid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--form-valid-color)'
    },

    '.was-validated :valid ~ .valid-feedback, .was-validated :valid ~ .valid-tooltip, .is-valid ~ .valid-feedback, .is-valid ~ .valid-tooltip':
      {
        display: 'block'
      },

    '.was-validated .form-control:valid, .form-control.is-valid': {
      borderColor: 'var(--form-valid-border-color)',
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='${theme('colors.green-500')}' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`,

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
    },

    //* New................................................................
    '.dropzone.is-valid': {
      borderColor: 'var(--form-valid-border-color)'
    },

    '.dropzone.is-valid.disabled': {
      borderColor: 'var(--dropzone-disabled-color)'
    },

    '.was-validated .form-control:valid:focus, .form-control.is-valid:focus': {
      borderColor: 'var(--form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
    },

    //* New................................................................
    '.dropzone.is-valid:focus': {
      borderColor: 'var(--form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
    },

    '.was-validated textarea.form-control:valid, textarea.form-control.is-valid':
      {
        paddingRight: 'calc(1.5em + 0.75rem)',
        backgroundPosition:
          'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)'
      },

    '.was-validated .form-select:valid, .form-select.is-valid': {
      borderColor: 'var(--form-valid-border-color)'
    },

    '.was-validated .form-select:valid:not([multiple]):not([size]), .was-validated .form-select:valid:not([multiple])[size="1"], .form-select.is-valid:not([multiple]):not([size]), .form-select.is-valid:not([multiple])[size="1"]':
      {
        '--form-select-bg-icon': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='${theme('colors.green-500')}' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`,
        paddingRight: '4.125rem',
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize:
          '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
      },

    '.was-validated .form-select:valid:focus, .form-select.is-valid:focus': {
      borderColor: 'var(--form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
    },

    '.was-validated .form-control-color:valid, .form-control-color.is-valid': {
      width: 'calc(3rem + calc(1.5em + 0.75rem))'
    },

    '.was-validated .form-check-input:valid, .form-check-input.is-valid': {
      borderColor: 'var(--form-valid-border-color)'
    },

    '.was-validated .form-check-input:valid:checked, .form-check-input.is-valid:checked':
      {
        backgroundColor: 'var(--form-valid-color)'
      },

    '.was-validated .form-check-input:valid:focus, .form-check-input.is-valid:focus':
      {
        boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
      },

    '.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label':
      {
        color: 'var(--form-valid-color)'
      },

    '.form-check-inline .form-check-input ~ .valid-feedback': {
      marginLeft: '0.5em'
    },

    '.was-validated .input-group > .form-control:not(:focus):valid, .input-group > .form-control:not(:focus).is-valid, .was-validated .input-group > .form-select:not(:focus):valid, .input-group > .form-select:not(:focus).is-valid, .was-validated .input-group > .form-floating:not(:focus-within):valid, .input-group > .form-floating:not(:focus-within).is-valid':
      {
        zIndex: '3'
      },

    /* ======================
      Validation (Invalid)
    ====================== */

    '.invalid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--form-invalid-color)'
    },

    '.was-validated :invalid ~ .invalid-feedback, .was-validated :invalid ~ .invalid-tooltip, .is-invalid ~ .invalid-feedback, .is-invalid ~ .invalid-tooltip':
      {
        display: 'block'
      },

    '.was-validated .form-control:invalid, .form-control.is-invalid': {
      borderColor: 'var(--form-invalid-border-color)',
      paddingRight: 'calc(1.5em + 0.75rem)',

      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='${theme('colors.red-500')}'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='${theme('colors.red-500')}' stroke='none'/%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
    },

    //* New................................................................
    '.dropzone.is-invalid': {
      borderColor: 'var(--form-invalid-border-color)'
    },

    '.dropzone.is-invalid.disabled': {
      borderColor: 'var(--dropzone-disabled-color)'
    },

    '.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus':
      {
        borderColor: 'var(--form-invalid-border-color)',
        boxShadow: '0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)'
      },

    //* New................................................................
    '.dropzone.is-invalid:focus': {
      borderColor: 'var(--form-invalid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)'
    },

    '.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid':
      {
        paddingRight: 'calc(1.5em + 0.75rem)',
        backgroundPosition:
          'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)'
      },

    '.was-validated .form-select:invalid, .form-select.is-invalid': {
      borderColor: 'var(--form-invalid-border-color)'
    },

    '.was-validated .form-select:invalid:not([multiple]):not([size]), .was-validated .form-select:invalid:not([multiple])[size="1"], .form-select.is-invalid:not([multiple]):not([size]), .form-select.is-invalid:not([multiple])[size="1"]':
      {
        '--form-select-bg-icon': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='${theme('colors.red-500')}'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='${theme('colors.red-500')}' stroke='none'/%3e%3c/svg%3e")`,
        paddingRight: '4.125rem',
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize:
          '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
      },

    '.was-validated .form-select:invalid:focus, .form-select.is-invalid:focus':
      {
        borderColor: 'var(--form-invalid-border-color)',
        boxShadow: '0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)'
      },

    '.was-validated .form-control-color:invalid, .form-control-color.is-invalid':
      {
        width: 'calc(3rem + calc(1.5em + 0.75rem))'
      },

    '.was-validated .form-check-input:invalid, .form-check-input.is-invalid': {
      borderColor: 'var(--form-invalid-border-color)'
    },

    '.was-validated .form-check-input:invalid:checked, .form-check-input.is-invalid:checked':
      {
        backgroundColor: 'var(--form-invalid-color)'
      },

    '.was-validated .form-check-input:invalid:focus, .form-check-input.is-invalid:focus':
      {
        boxShadow: '0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)'
      },

    '.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label':
      {
        color: 'var(--form-invalid-color)'
      },

    '.form-check-inline .form-check-input ~ .invalid-feedback': {
      marginLeft: '0.5em'
    },

    '.was-validated .input-group > .form-control:not(:focus):invalid, .input-group > .form-control:not(:focus).is-invalid, .was-validated .input-group > .form-select:not(:focus):invalid, .input-group > .form-select:not(:focus).is-invalid, .was-validated .input-group > .form-floating:not(:focus-within):invalid, .input-group > .form-floating:not(:focus-within).is-invalid':
      {
        zIndex: '4'
      },

    /* ======================
         helper classes
    ====================== */

    '.focus-within:focus-within': {
      color: 'var(--form-color)',
      backgroundColor: 'var(--form-bg)',
      borderColor: 'var(--form-focus-border-color)',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-focus-shadow-rgb), 0.25)'
    },

    '.focus-within-valid:focus-within': {
      borderColor: 'var(--form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-valid-rgb), 0.25)'
    },

    '.focus-within-invalid:focus-within': {
      borderColor: 'var(--form-invalid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--form-invalid-rgb), 0.25)'
    }
  })
})

export default formPlugin
