'use client'

import { ComponentProps } from 'react'
import { useThemeContext } from 'contexts'
import { twMerge } from 'tailwind-merge'
import { PageContainer } from './PageContainer'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

type PageProps = ComponentProps<'main'>

/* ========================================================================
                                  Page
======================================================================== */
// Todo: Make polymorphic.

///////////////////////////////////////////////////////////////////////////
//
// Gotcha 'use client' can potentially break the ability to consume compound
// components with <Parent.Child> syntax:
//
//   https://github.com/vercel/next.js/issues/44030
//
// Suppose we have the following Outer.tsx file:
//
//   "use client"
//   export const Outer = ({ children }: any) => { return <div>{children}</div> }
//   export const Inner = ({ children }: any) => { return <div>{children}</div> }
//   Outer.Inner = Inner
//
// Thus, <Outer.Inner> will work if you wrap it in another client component.
// For example:
//
//   export const OuterDemo = () => {
//     return (<Outer><Outer.Inner>Hello</Outer.Inner></Outer>)
//   }
//
// However, if you try to use <Outer.Inner> directly within a server component,
// it won't work:
//
//   Error: Could not find the module "Outer/index.tsx#Outer#Inner" in the React Client Manifest.
//   This is probably a bug in the React Server Components bundler.
//
// Thus, it's not that compound component implementations don't work, but that
// consuming them with the <Parent.Child> syntax directly within a server component
// is prohibited.
//
// In the issue it's explained as follows:
//
//   This behavior is intentional. 'use client' creates a boundary in the module graph. When you import
//   from a client module into a server module, what you're actually importing is a special, opaque client
//   reference that the RSC runtime knows how to send down to the browser. You can't actually access the
//   export itself — it's only useful for passing to the client.
//
//   To make this work, we rely on the client exports being statically known at build time, using JavaScript export syntax.
//
//   Keep in mind that assigning to an export alone actually works fine. It's probably not a great idea for other reasons,
//   because module side effects complicate your bundle graph and make it harder to perform optimizations like tree shaking.
//   The error only happens when you attempt to access it on the server. (If you import the same thing into a client module,
//   and access it there, it works fine.)
//
//
///////////////////////////////////////////////////////////////////////////

const Page = ({ children, className, style, ...otherProps }: PageProps) => {
  const { mode } = useThemeContext()

  return (
    <main
      className={twMerge(`mx-auto flex w-full flex-1 flex-wrap`, className)}
      style={{
        backgroundImage:
          mode === 'dark' ? darkBackgroundImage : backgroundImage,
        ...style
      }}
      {...otherProps}
    >
      {children}
    </main>
  )
}

export { PageContainer }

// Again, <Page.Container> will not work directly within a server component,
// but will work when wrapped in another client component.
const CompoundComponent = Object.assign(Page, {
  Container: PageContainer
})

export { CompoundComponent as Page }
