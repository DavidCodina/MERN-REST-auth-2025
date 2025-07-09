import * as React from 'react'
import { composeRefs } from './composeRefs'

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

interface SlotCloneProps {
  children: React.ReactNode
}

type AnyProps = Record<string, any>

/* ========================================================================
                                 Slot
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.radix-ui.com/primitives/docs/utilities/slot
// https://www.radix-ui.com/primitives/docs/guides/composition
// https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx
//
// The actual documentation is very minimal for what <Slot /> is.
// However, there is a bit more information in the Composition section.
// Seems like this component was added on Jan 29, 2021, and likely replaces
// the now deprecated Polymorphic.
//
// At it's core, the 'asChild' prop is a new pattern in React that seems to
// drastically simplify designing/typing polymorphic components. It exists
// as an alternative to the 'as' prop pattern.
//
// Other resources on this topic:
//
//   - https://www.youtube.com/watch?v=r0I-pzcE8dg
//   - https://medium.com/@bryanmylee/aschild-in-react-svelte-vue-and-solid-for-render-delegation-645c73650ced
//   - https://blog.makerx.com.au/polymorphic-typesafe-react-components/
//   - https://sandroroth.com/blog/react-polymorphic-components
//   - https://krzysztofzuraw.com/blog/2023/polymorphic-components-in-react/
//   - https://buildui.com/videos/do-your-react-components-compose
//   - https://brightinventions.pl/blog/embracing-polymorphism-for-flexible-components/
//
// Essentially, <Slot /> gives us a Componentized version of React.cloneElement().
//
//   export const MyButton = ({ asChild, ...props }: any) => {
//     const Comp = asChild ? Slot : 'button'
//     return <Comp {...props} />
//   }
//
// Then consume as follows:
//
//   <MyButton
//     asChild
//     disabled // !!!
//     className='rounded-lg border-green-600 bg-green-500 px-4 py-2 text-sm font-bold text-white no-underline hover:text-white'
//     onClick={(e: any) => {
//       if (e.defaultPrevented) {
//         console.log('MyButton onClick returning early because e.preventDefault() in child onClick.')
//         return
//       }
//       console.log('MyButton clicked.')
//     }}
//   >
//     <a
//       href='https://www.google.com'
//       target='_blank'
//       onClick={(e) => {
//         e.preventDefault()
//         console.log('<a> tag clicked.')
//       }}
//     >google.com</a>
//   </MyButton>
//
// Gotcha: <Slot /> is not smart enough to know what props to exclude when they are pased in
// from the consuming environment. Thus, in the above example if you pass in disabled, it will
// add it directly on the HTML <a> tag, even though <a> tags don't use a disabled attribute.
// The same is true if you baked disabled into the MyButton internals: <Comp {...props} disabled />
//
// Conversely, using a traditional polymorphic 'as' prop gives you a bit more type safety.
// Thus, with certain React elements (e.g., JSX or Components), you may want to check what you're
// receiving before applying certain props internally. However, even then the information is
// a little tricky to pull out.
//
//   export const MyButton = ({ asChild, ...props }: any) => {
//     const Comp = asChild ? Slot : 'button'
//
//     if (asChild === true) {
//       const children = props?.children
//       const childrenArray = React.Children.toArray(children) as any
//       const firstChildType = childrenArray?.[0].type
//       console.log('Type of first child:', firstChildType) // => 'Type of first child: a'
//     }
//     console.log('Comp', Comp) // Doesn't really tell you much...
//     return <Comp {...props} />
//   }
//
/////////////////////////
//
// What if we accidentally pass an HTML attribute to an JSX element that doesn't know how to use it?
//
// Thus, while Slot is super convenient, you do have to be mindful of what's
// getting passed to it. That said, I'm not sure if passing an invalid or
// incorrect attribute to an HTML element is capable of causing a fatal error.
//
//   https://stackoverflow.com/questions/15037149/what-happens-if-an-invalid-nonstandard-html-attribute-is-used-for-data
//   The HTML 4.01 specification recommends, in its Notes on invalid documents, that if a browser “encounters an attribute
//   it does not recognize, it should ignore the entire attribute specification (i.e., the attribute and its value)” and
//   “provide[s] support for notifying the user of such errors”. In practice, browsers ignore unknown attributes as far
//   as HTML alone is considered.
//
// Presumably, browsers would then also ignore incorrectly applied attributes.
//
//   See also: https://stackoverflow.com/questions/29420386/what-happens-when-we-include-wrong-attributes-in-html-tags
//   You can technically have any sort of attribute you want... For HTML, a browser just doesn't do anything 'special'
//   with them, effectively ignoring unknown attributes.
//
// Thus, I can do this in a notes.html file and absolutely nothing bad happens.
//
//   <p
//     class="text-danger fw-bold"
//     disabled
//     placeholder="Testing 123..."
//   >This paragraph has invalid attributes!</p>
//
///////////////////////////////////////////////////////////////////////////

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props
  const childrenArray = React.Children.toArray(children)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Reminder:
  //
  // isSlottable is a utility function defined below.
  //
  //   function isSlottable(child: React.ReactNode): child is React.ReactElement {
  //     return React.isValidElement(child) && child.type === Slottable
  //   }
  //
  // So here we're checking all the children to see if React.isValidElement(child)
  // and if child.type === Slottable. I'm  not really sure what that is...
  //
  ///////////////////////////////////////////////////////////////////////////
  const slottable = childrenArray.find(isSlottable)

  //* Path 1: If it is a valid element and is slottable then do this.
  if (slottable) {
    // the new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as React.ReactNode

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // in grabbing its children (`newElement.props.children`)
        if (React.Children.count(newElement) > 1)
          return React.Children.only(null)
        return React.isValidElement(newElement)
          ? ((newElement.props as any).children as React.ReactNode)
          : null
      } else {
        return child
      }
    })

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    )
  }

  //* Path 2: Otherwise if it's not slottable do this.
  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  )
})

Slot.displayName = 'Slot'

/* ========================================================================
                                SlotClone
======================================================================== */
// Used internally by Slot.

const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props as any),

        // Typescript is complaing about ref. No clue why this
        // is happening, but it's straight from the source code.
        // I tacked on 'as any' to quiet it.
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref
      } as any)
    }

    return React.Children.count(children) > 1 ? React.Children.only(null) : null
  }
)

SlotClone.displayName = 'SlotClone'

/* ========================================================================
                              Slottable
======================================================================== */

const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

/* ========================================================================
                            isSlottable()
======================================================================== */
// A utility to check if the a child is a valid element.
// https://react.dev/reference/react/isValidElement
// For example, numbers and object literals are not valid elements.
// Some strings are valid elements like 'p', but not 'pizza'.

function isSlottable(
  child: React.ReactNode
): child is React.ReactElement<{ children: React.ReactNode }> {
  return React.isValidElement(child) && child.type === Slottable
}

/* ========================================================================
                            mergeProps()
======================================================================== */
// Used internally by SlotClone

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    if (Object.hasOwnProperty(propName)) {
      const slotPropValue = slotProps[propName]
      const childPropValue = childProps[propName]

      const isHandler = /^on[A-Z]/.test(propName)
      if (isHandler) {
        // if the handler exists on both, we compose them
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args: unknown[]) => {
            childPropValue(...args)
            slotPropValue(...args)
          }
        }
        // but if it exists only on the slot, we use only this one
        else if (slotPropValue) {
          overrideProps[propName] = slotPropValue
        }
      }
      // if it's `style`, we merge them
      else if (propName === 'style') {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue }
      } else if (propName === 'className') {
        overrideProps[propName] = [slotPropValue, childPropValue]
          .filter(Boolean)
          .join(' ')
      }
    }
  }

  return { ...slotProps, ...overrideProps }
}

/* ========================================================================

======================================================================== */

const Root = Slot

export {
  Slot,
  Slottable,
  //
  Root // Alias for Slot
}

// What benefit does using type keyword give?
export type { SlotProps }
