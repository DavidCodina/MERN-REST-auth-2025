import React, { useRef, useState, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { useIsomorphicEffect, assignRef } from './hooks'

export interface PortalProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Portal children, for example, custom modal or popover */
  children: React.ReactNode
  /** Element inside which portal should be created, by default a new div element is created and appended to the `document.body` */
  target?: HTMLElement | string
}

// Not supported during server side rendering. All components inside Portal are rendered
// only after the application was mounted to the dom.

function createPortalNode(props: React.ComponentPropsWithoutRef<'div'>) {
  const node = document.createElement('div')
  node.setAttribute('data-portal', 'true')

  // typeof props.className === 'string' &&
  //   node.classList.add(...props.className.split(' '))
  // typeof props.style === 'object' && Object.assign(node.style, props.style)
  // typeof props.id === 'string' && node.setAttribute('id', props.id)

  if (typeof props.className === 'string') {
    node.classList.add(...props.className.split(' '))
  }

  if (typeof props.style === 'object' && props.style !== null) {
    Object.assign(node.style, props.style)
  }

  if (typeof props.id === 'string') {
    node.setAttribute('id', props.id)
  }

  return node
}

/* ========================================================================
                                Portal
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component was taken from : https://mantine.dev/core/portal/
//
// If the target prop is not specified, it will create a <div> for you and append it to
// the bottom of the <body> element. When the components unmount, the portal <div> and
// all elements within it will be removed. This is probably the best option and makes
// creating portals on the fly super easy!
//
// There are two ways of using the target prop. You can create one on the fly:
//
//   const container = document.createElement('div')
//   container.className = 'my-div'
//   document.body.appendChild(container)
//
// Then consume it: <Portat target={container} />
// Note that in this case, the target will not be removed when the
// code unmounts, unless you specifically tell it to in your logic.
//
// The other way that the target prop can be used is by targeting a DOM node
// that already exists in your HTML:
//
//  <Portal target='#modal-root'>
//
// When the components unmount, the <div id="modal-root"> will still remain, but the
// portaled elements will be removed.
//
// Usage:
//
//   <Portal target='#modal-root'>
//     <div className='fixed left-0 top-6 z-[9999] w-full rounded border-2 border-blue-500 bg-white py-6 text-center text-4xl font-black text-blue-500'>
//       I'm inside of a portal
//     </div>
//   </Portal>
//
///////////////////////////////////////////////////////////////////////////

export const Portal = forwardRef<HTMLDivElement, PortalProps>((props, ref) => {
  // In the original Mantine code, the props were destructured from useProps()
  // which got some additional theme props, etc. That said, I think we can
  // get away with just doing this. In this case, 'others' would be anything
  // else that one could conceivably put on a <div>.
  const { children, target, ...others } = props

  const [mounted, setMounted] = useState(false)
  const nodeRef = useRef<HTMLElement | null>(null)

  useIsomorphicEffect(() => {
    setMounted(true)
    nodeRef.current = !target
      ? createPortalNode(others)
      : typeof target === 'string'
        ? document.querySelector(target)
        : target

    assignRef(ref, nodeRef.current)

    if (!target && nodeRef.current) {
      document.body.appendChild(nodeRef.current)
    }

    return () => {
      if (!target && nodeRef.current) {
        document.body.removeChild(nodeRef.current)
      }
    }
  }, [target])

  if (!mounted || !nodeRef.current) {
    return null
  }

  return createPortal(<>{children}</>, nodeRef.current)
})

// Portal.displayName = '@mantine/core/Portal';
