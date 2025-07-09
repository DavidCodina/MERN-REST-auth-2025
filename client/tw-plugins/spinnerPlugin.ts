import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              spinnerPlugin
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// <div
//   className='spinner-border mx-auto text-violet-800 [--spinner-animation-speed:1.25s] [--spinner-border-width:10px] [--spinner-size:6rem]'
//   role='status'
//   style={{
//     display: 'table'
//   }}
// />
//
///////////////////////////////////////////////////////////////////////////

export const spinnerPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    '@keyframes spinner-border': {
      to: {
        transform: 'rotate(360deg)'
      }
    },

    '.spinner-border': {
      '--spinner-border-width': '0.25em',
      '--spinner-size': '2rem',
      '--spinner-vertical-align': '-0.125em',
      '--spinner-animation-speed': '0.75s',
      '--spinner-animation-name': 'spinner-border',

      border: 'var(--spinner-border-width) solid currentcolor',
      borderRightColor: 'transparent',
      display: 'inline-block',
      width: 'var(--spinner-size)',
      height: 'var(--spinner-size)',
      verticalAlign: 'var(--spinner-vertical-align)',
      borderRadius: '50%',
      animation:
        'var(--spinner-animation-speed) linear infinite var(--spinner-animation-name)'
    },

    '.dark .spinner-border': {
      color: 'var(--dark-primary-color)'
    },

    '.spinner-border-sm': {
      '--spinner-size': '1rem',
      '--spinner-border-width': '0.2em'
    },
    '.spinner-border-lg': {
      '--spinner-size': '4rem',
      '--spinner-border-width': '0.4em'
    },
    '.spinner-border-dynamic': {
      '--spinner-size': '0.75em',
      '--spinner-border-width': '0.15em',
      '--spinner-vertical-align': '-0.0375em' // (0.75/2) * -1
    }
  })
})

export default spinnerPlugin
