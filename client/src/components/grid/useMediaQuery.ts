import { useEffect, useState } from 'react'

/* ======================
      getMatches()
====================== */

const getMatches = (query: string): boolean => {
  // Prevents SSR issues
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches
  }
  return false
}

/* ========================================================================
                                useMediaQuery
======================================================================== */
// https://usehooks-ts.com/react-hook/use-media-query
// This version makes a few modifications to the original.
// getMatches() is defined outside of the hook to avoid instance regeneration.
// handleChange() is defined within the useEffect() to avoid the need for
// the eslint-disable-next-line to silence the dependency array.

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(getMatches(query))

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const handleChange = () => {
      setMatches(getMatches(query))
    }

    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handleChange()

    // addListener and removeListener are deprecated, but checking for them is
    // intentional, whch makes this hook backward compatible with older implementations.
    if (matchMedia?.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia?.addEventListener('change', handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia?.removeListener(handleChange)
      } else {
        matchMedia?.removeEventListener('change', handleChange)
      }
    }
  }, [query])

  /* ======================
          return
  ====================== */

  return matches
}

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   export const breakpoints = {
//     xs: '0px',
//     sm: '576px',
//     md: '768px',
//     lg: '992px',
//     xl: '1200px',
//     xxl: '1400px'
//   } as const
//
//   export const MyComponent = ({ xsStyle, smStyle, mdStyle, lgStyle, xlStyle, xxlStyle }: any) => {
//     const xsBreakpoint  = useMediaQuery(`(min-width: ${breakpoints.xs})`)
//     const smBreakpoint  = useMediaQuery(`(min-width: ${breakpoints.sm})`)
//     const mdBreakpoint  = useMediaQuery(`(min-width: ${breakpoints.md})`)
//     const lgBreakpoint  = useMediaQuery(`(min-width: ${breakpoints.lg})`)
//     const xlBreakpoint  = useMediaQuery(`(min-width: ${breakpoints.xl})`)
//     const xxlBreakpoint = useMediaQuery(`(min-width: ${breakpoints.xxl})`)
//
//     const responsiveStyle = {
//       ...(xsBreakpoint ? xsStyle : {}),
//       ...(smBreakpoint ? smStyle : {}),
//       ...(mdBreakpoint ? mdStyle : {}),
//       ...(lgBreakpoint ? lgStyle : {}),
//       ...(xlBreakpoint ? xlStyle : {}),
//       ...(xxlBreakpoint ? xxlStyle : {})
//     }
//
//     ...
//
//   }
//
///////////////////////////////////////////////////////////////////////////
