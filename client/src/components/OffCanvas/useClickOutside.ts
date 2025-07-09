import { useEffect, useRef } from 'react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This hook was originally taken from:
//
//   https://mantine.dev/hooks/use-click-outside/
//   https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-click-outside/use-click-outside.ts
//
// However, this version differs in a couple of ways:
//
//   1. The arg is an options object instead of several args.
//   2. The disabled option was added.
//   3. handlerRef() was created, so handlerRef.current?.() could bypass the useEffect's deps.
//      The only consideration here is that you can't dynamically change the handler, but we're not
//      doing that anyways.
//
// use-click-outside hook accepts 3 arguments:
//
//   - handler : function that is called on outside click
//   - events  : optional list of events that trigger outside click, ['mousedown', 'touchstart'] by default
//   - nodes   : optional list of nodes that should not trigger outside click event
//
// The hook returns a ref object that must be passed to the element based on which outside clicks should be captured.
//
///////////////////////////////////////////////////////////////////////////

const DEFAULT_EVENTS = ['mousedown', 'touchstart']

export function useClickOutside<T extends HTMLElement = any>({
  handler,
  events,
  nodes,
  disabled = false
}: {
  handler: () => void
  events?: string[] | null
  nodes?: (HTMLElement | null)[]
  disabled?: boolean
}) {
  const ref = useRef<T>(undefined)
  const handlerRef = useRef(handler)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (disabled) {
      return
    }
    const listener = (event: any) => {
      const { target } = event ?? {}

      // useClickOutside has two different implementation styles.
      // When you pass nodes, you MUST include a ref to the primary HTMLElement
      // as well as any other elements to ignore.
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML')

        const shouldTrigger = nodes.every((node) => {
          return !!node && !event.composedPath().includes(node)
        })

        if (shouldTrigger && !shouldIgnore) {
          handlerRef.current?.()
        }

        // Conversely, when not using nodes the return will be a
        // ref that you can assign to the primary HTMLElement.
      } else if (ref.current && !ref.current.contains(target)) {
        handlerRef.current?.()
      }
    }

    ;(events || DEFAULT_EVENTS).forEach((fn) =>
      document.addEventListener(fn, listener)
    )

    return () => {
      ;(events || DEFAULT_EVENTS).forEach((fn) =>
        document.removeEventListener(fn, listener)
      )
    }
  }, [disabled, nodes, ref]) // eslint-disable-line

  /* ======================
          return
  ====================== */

  return ref
}
