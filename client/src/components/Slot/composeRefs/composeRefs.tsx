// https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx

import * as React from 'react'
type PossibleRef<T> = React.Ref<T> | undefined

/* ========================================================================
                                setRef()                 
======================================================================== */
// Used internally by composeRefs()
//  Set a given ref to a given value
// This utility takes care of different types of refs: callback refs and RefObject(s)

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    // Was originally this, but prettier seems to want to add this ;
    // (ref as React.MutableRefObject<T>).current = value
    // You could prevent this by returing the statement, but I think
    // it's okay.
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

/* ========================================================================
                               composeRefs()              
======================================================================== */
// A utility to compose multiple refs together
// Accepts callback refs and RefObject(s)

function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node))
}

/* ========================================================================
                              useComposedRefs()                
======================================================================== */
// A custom hook that composes multiple refs
// Accepts callback refs and RefObject(s)

// function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   return React.useCallback(composeRefs(...refs), refs)
// }

export { composeRefs /*, useComposedRefs */ }
