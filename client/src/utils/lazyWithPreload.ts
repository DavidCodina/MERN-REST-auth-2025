import { ComponentType, createElement, forwardRef, lazy, useRef } from 'react'

/* ======================
react-lazy-with-preload
====================== */
// https://github.com/ianschmitz/react-lazy-with-preload/blob/master/src/index.ts
// See here for another possible solution: https://loadable-components.com/
// Further reading:
//   https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
//   https://www.robinwieruch.de/react-router-lazy-loading/

export type PreloadableComponent<T extends ComponentType<any>> = T & {
  preload: () => Promise<T>
}

export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }> // e.g., () => import('pages/PageRandom')
): PreloadableComponent<T> {
  const ReactLazyComponent = lazy(factory)
  let PreloadedComponent: T | undefined
  let factoryPromise: Promise<T> | undefined

  const Component = forwardRef(function LazyWithPreload(props, ref) {
    // Once one of these is chosen, we must ensure that it continues to be
    // used for all subsequent renders, otherwise it can cause the
    // underlying component to be unmounted and remounted.
    const ComponentToRender = useRef(PreloadedComponent ?? ReactLazyComponent)

    return createElement(
      ComponentToRender.current,
      Object.assign(ref ? { ref } : {}, props) as any
    )
  })

  const LazyWithPreload = Component as any as PreloadableComponent<T>

  LazyWithPreload.preload = () => {
    if (!factoryPromise) {
      factoryPromise = factory().then((module) => {
        PreloadedComponent = module.default
        return PreloadedComponent
      })
    }

    return factoryPromise
  }

  return LazyWithPreload
}
