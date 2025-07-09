import {
  useState,
  PropsWithChildren,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef
} from 'react'
import { useLocation, useHref } from 'react-router'
import { createContext, useContextSelector } from 'use-context-selector'
import { useThrottle } from 'hooks'

export interface AppContextValue {
  setShowMenu: Dispatch<SetStateAction<boolean>>
  showMenu: boolean
  count: number
  setCount: Dispatch<SetStateAction<number>>
  prevPath: string
  currentPath: string
  // [key: string]: any
}

const throttleDuration = 200

/* ========================================================================

======================================================================== */

export const AppContext = createContext({} as AppContextValue)

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [_showMenu, setShowMenu] = useState(false)
  const showMenu = useThrottle(_showMenu, throttleDuration) as boolean

  const location = useLocation()
  const href = useHref(location)
  const [count, setCount] = useState(0) // Used to test rerender behavior.

  const prevPathRef = useRef('/')
  const currentPathRef = useRef('/')
  const [prevPath, setPrevPath] = useState('/')
  const [currentPath, setCurrentPath] = useState('/')

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    prevPathRef.current = currentPathRef.current
    currentPathRef.current = href
    setPrevPath(prevPathRef.current)
    setCurrentPath(currentPathRef.current)

    // console.log(
    //   `\n${JSON.stringify(
    //     {
    //       currentPath: currentPathRef.current,
    //       prevPath: prevPathRef.current
    //     },
    //     null,
    //     2
    //   )}\n`
    // )
  }, [href])

  /* ======================
          return
  ====================== */

  return (
    <AppContext.Provider
      value={{
        showMenu,
        setShowMenu,
        count,
        setCount,
        prevPath,
        currentPath
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

///////////////////////////////////////////////////////////////////////////
//
// In simple apps, we might to this:
//
//   export function useAppContext() {
//     const value = useContext(AppContext)
//     return value
//   }
//
// There is an issue with this:
// https://github.com/reactjs/rfcs/pull/119
// Basically, two sibling components that both use the same context, but
// different parts of it will still be affected by changes to that context
// and thus rerender unnecessarily. Solution: use-context-selector:
//
// Usage:
//
//   ❌ const { showMenu, setShowMenu} = useAppContext()
//
//  ✅ const showMenu    = useAppContextSelector('showMenu')
//  ✅ const setShowMenu = useAppContextSelector('setShowMenu')
//
///////////////////////////////////////////////////////////////////////////
export const useAppContextSelector = <T extends keyof AppContextValue>(
  key: T
) => {
  const value = useContextSelector(AppContext, (state) => state[key])
  return value
}

/* ======================
    Don't Do This!
====================== */

///////////////////////////////////////////////////////////////////////////
//
// The above version of useAppContextSelector() only allows the consumer to select
// one piece of context at a time.
//
// What I really want is to be able to pass in a key (string) or an array of keys, and then
// get back an object that contains all of the selected key/value pairs. The challenge
// is getting Typescript to come along for the ride and be completely aware.
//
// Initially, I was doing this:
//
//   const partialAppContext: Partial<AppContextValue> = {}
//
// The problem here is that it will make the typed values
// xxx | undefined. This is actually correct, but I don't
// want to deal with the type checking that this will entail.
// Then I did this:
//
//   type PartialAppContext = { [K in keyof AppContextValue]: AppContextValue[K] }
//
// Then typecast it to partialAppContext:
//
// const partialAppContext = {} as PartialAppContext
//
// But really that's just the same as doing:
//
//   const partialAppContext = {} as AppContextValue
//
// So the issue is that I want Typescript to complain if
// we try to destructure a property that was not actually requested.
//
//   const { count, setCount, test } = useAppContextSelector2(['count', 'setCount'])
//   // => Property 'test' does not exist on type 'Pick<AppContextValue, "count" | "setCount">'.
//
// We can actually accomplish this through using Typescript's Pick Utility in conjunction
// with a PartialKeys type that changes dynamically based on what is passed in.
//
// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6#:~:text=First%20way%20to%20create%20a%20union%20from%20an%20array&text=It%20turns%20out%20that%20using,us%20the%20union%20we%20need.
//
// Thus we can now do this in the consuming component:
//
//  const { count, setCount } = useAppContextSelector(['count', 'setCount'])
//
//! The problem is that we've succeeded at recreating the exact problem that
//! we were trying to avoid with unnecessary rerenders.
// Thus, if create a <Child1 /> component that does this:
//
//   const { test } = useAppContextSelector('test')
//
// It will now rerender every time <ClickCounter /> updates. Whoops!
//
// Moral of the story, you are only allowed to select one piece of state
// at a time for a reason
//
///////////////////////////////////////////////////////////////////////////

/*
export const useBadAppContextSelector = <T extends keyof AppContextValue>(
  key: T | T[]
) => {
  const keys = typeof key === 'string' ? [key] : key

  const value = useContextSelector(AppContext, (state) => {
    type PartialKeys = (typeof keys)[number]
    type PartialAppContext = Pick<AppContextValue, PartialKeys>
    const partialAppContext = {} as PartialAppContext

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]
      partialAppContext[currentKey] = state[currentKey]
    }
    return partialAppContext
  })

  return value
}
*/
