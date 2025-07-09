import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              placeholderPlugin
======================================================================== */

export const placeholderPlugin = plugin(function (pluginApi) {
  const { addComponents /*, theme */ } = pluginApi

  addComponents({
    /* ======================
          keyframes
    ====================== */
    //# Be more specific with the name of the keyframes...

    '@keyframes glow': {
      '50%': {
        opacity: '0.2'
      }
    },

    '@keyframes wave': {
      '100%': {
        maskPosition: '-200% 0%'
      }
    },

    '@keyframes whiteWave': {
      '100%': {
        backgroundPosition: '-200% 0'
      }
    },

    /* Taken from Steam Games... */
    '@keyframes shine': {
      '0%': {
        backgroundPosition: '100% 100%'
      },
      '30%': {
        backgroundPosition: '0% 0%'
      },
      '100%': {
        backgroundPosition: '0% 0%'
      }
    },

    /* ======================
          .placeholder
    ====================== */

    '.placeholder': {
      // Bootstrap uses background-color: currentcolor. It makes sense to the extent
      // that placeholders are generally mocking text lines. However, it becomes a
      // bad idea as soon as one switches to dark mode. For that reason the fallback
      // has been hardcoded as #212529 (i.e., --bs-body-color), but it's somewhat arbitrary.
      // You could do #333, etc.
      backgroundColor: 'var(--placeholder-bg, #212529)',
      borderRadius: '4px',
      cursor: 'wait',
      display: 'block' /* Bootstrap uses inline-block. */,
      lineHeight: '1',
      marginBottom: '7.5px',
      minHeight: 'var(--placeholder-min-height, 15px)',
      opacity: 'var(--placeholder-opacity, 0.35)',
      width: '100%',
      position: 'relative'
    },

    '.dark .placeholder': {
      backgroundColor: 'var(--placeholder-bg, #888)' // ???
    },

    /* ======================
            sizes
    ====================== */

    '.placeholder-xs': {
      minHeight: '5px' /* Consider reducing margin-bottom */
    },

    '.placeholder-sm': {
      minHeight: '10px' /* Consider reducing margin-bottom */
    },

    '.placeholder-lg': {
      minHeight: '20px' /* Consider increasing margin-bottom */
    },

    '.placeholder-xl': {
      minHeight: '25px' /* Consider increasing margin-bottom */
    },

    /* ======================
          animations
    ====================== */

    '.placeholder-glow': {
      animation:
        'glow var(--placeholder-animation-duration, 1.5s) ease-in-out infinite'
    },

    /* With the alpha channel, the closer to 0.0, the brighter the shimmer. */
    '.placeholder-wave': {
      maskImage:
        'linear-gradient(135deg, black 33%, rgba(0, 0, 0, 0.5), black 66%)',

      maskSize: '200% 100%',
      animation:
        'wave var(--placeholder-animation-duration, 1s) linear infinite'
    },

    '.placeholder-white-wave': {
      backgroundImage:
        'linear-gradient(135deg, transparent 33%, rgba(255, 255, 255, 0.5), transparent 66%)',
      backgroundSize: '200% 100%',
      animation:
        'whiteWave var(--placeholder-animation-duration, 1s) linear infinite'
    },

    /* This animation was originally taken from Steam Games, but
    had to be modified because it originally effected the actual
    background color. In the new version, a ::after overlay is
    created, and it works on that instead. Additionally, the 
    linear gradient was made more transparent on the outsides, and 
    more shiney on the inside.

    @keyframes shine {
      0%   { background-position: 100% 100%; }
      30%  { background-position: 0% 0%; }
      100% { background-position: 0% 0%; }
    }

    .shine-animation {
      background: linear-gradient(
        to bottom right,
        rgba(255, 255, 255, 0.1) 40%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 60%
      );

      background-size: 400% 400%;
      border-radius: 5px;
      animation: shine;
      animation-duration: 3.2s;
      animation-timing-function: ease;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-fill-mode: none;
      animation-play-state: running;
      animation-name: shine;
      animation-iteration-count: infinite;
    }
    */

    '.placeholder-shine::after': {
      content: "''",
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      borderRadius: 'inherit',
      zIndex: '1',

      background:
        'linear-gradient(to bottom right,transparent 40%,rgba(255, 255, 255, 0.3) 50%,transparent 60%)',

      backgroundSize: '400% 400%',
      animation: 'shine',
      animationDuration: 'var(--placeholder-animation-duration, 3.2s)',
      animationTimingFunction: 'ease',
      animationDelay: '0s',
      animationIterationCount: 'infinite',
      animationDirection: 'normal',
      animationFillMode: 'none',
      animationPlayState: 'running'
    }
  })
})

export default placeholderPlugin

////////////////////////////////////////////////////////////////////////////////
//
// This is the original CSS from which the plugin was derived. It's probably
// okay to delete this, but I thought I'd leave it in for now...
//
// @keyframes glow {
//   50% {
//     opacity: 0.2;
//   }
// }
//
// @keyframes wave {
//   100% {
//     mask-position: -200% 0%;
//   }
// }
//
// @keyframes whiteWave {
//   100% {
//     background-position: -200% 0;
//   }
// }
//
// @keyframes shine {
//   0% {
//     background-position: 100% 100%;
//   }
//   30% {
//     background-position: 0% 0%;
//   }
//   100% {
//     background-position: 0% 0%;
//   }
// }
//
// .placeholder {
//   background-color: var(--placeholder-bg, currentcolor);
//   border-radius: 4px;
//   cursor: wait;
//   display: block;
//   line-height: 1;
//   margin-bottom: 7.5px;
//   min-height: var(--placeholder-min-height, 15px);
//   opacity: var(--placeholder-opacity, 0.35);
//   width: 100%;
//   position: relative;
// }
//
// .placeholder-xs {
//   min-height: 5px;
// }
//
// .placeholder-sm {
//   min-height: 10px;
// }
//
// .placeholder-lg {
//   min-height: 20px;
// }
//
// .placeholder-xl {
//   min-height: 25px;
// }
//
// .placeholder-glow {
//   animation: glow var(--placeholder-animation-duration, 1.5s) ease-in-out
//     infinite;
// }
//
// .placeholder-wave {
//   mask-image: linear-gradient(135deg, black 33%, rgba(0, 0, 0, 0.5), black 66%);
//
//   mask-size: 200% 100%;
//   animation: wave var(--placeholder-animation-duration, 1s) linear infinite;
// }
//
// .placeholder-white-wave {
//   background-image: linear-gradient(
//     135deg,
//     transparent 33%,
//     rgba(255, 255, 255, 0.5),
//     transparent 66%
//   );
//
//   background-size: 200% 100%;
//   animation: whiteWave var(--placeholder-animation-duration, 1s) linear infinite;
// }
//
// .placeholder-shine::after {
//   content: '';
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: inherit;
//   z-index: 1;
//
//   background: linear-gradient(
//     to bottom right,
//     transparent 40%,
//     rgba(255, 255, 255, 0.3) 50%,
//     transparent 60%
//   );
//
//   background-size: 400% 400%;
//   animation: shine;
//   animation-duration: var(--placeholder-animation-duration, 3.2s);
//   animation-timing-function: ease;
//   animation-delay: 0s;
//   animation-iteration-count: infinite;
//   animation-direction: normal;
//   animation-fill-mode: none;
//   animation-play-state: running;
//   animation-iteration-count: infinite;
// }
//
////////////////////////////////////////////////////////////////////////////////
