import { useState, useEffect } from 'react'
import { IWithUnmounter } from './types'

/* =============================================================================
                              withUnmounter()
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// Initially, withUnmounter() required that the component being wrapped had a 'show' prop.
// Typescript would then complain when the 'show' prop was not a boolean or omitted
// ONLY IF that component had sufficient type information:
//
//   interface IMessager {
//     message: string
//     show: string <-- Typescript will complain
//   }
//
//   const Messager = ({ message }: IMessager) => {
//     return <div>{message}</div>
//   }
//
//   const MessagerWithUnmounter = withUnmounter(Messager, 350)
//
// This is still the case. However, in order to make withUnmounter()
// maximally flexible, it allows for ONE of several different props:
//
//   show, isOpen, open, visible, or isVisible
//
// The wrapped component can possess any ONE of these and withUnmounter()
// will still work.
//
/////////////////////////
//
// Usage:
//
// const MyModal = () => { ... }
// const MyModalWithUnmounter = withUnmounter(MyModal, 350, true)
// export { MyModalWithUnmounter as MyModal }
//
////////////////////////////////////////////////////////////////////////////////

export function withUnmounter<P extends IWithUnmounter>(
  Component: React.ComponentType<P>,
  delay = 0,
  shouldRemount = false
): React.ComponentType<P> {
  // Before this was return (props: P) => { ... }
  // ESLint was complaining: Component definition is missing display name (eslintreact/display-name)
  // I was having to call eslint-disable-next-line
  // Solution name the function and then return it.
  //# I have not tested this yet
  const Unmounter = (props: P) => {
    const [shouldUnmount, setShouldUnmount] = useState(false)
    const { show, isOpen, open, visible, isVisible } = props

    /* ======================
          useEffect()
    ====================== */

    useEffect(() => {
      let timeout: any

      if (
        show === false ||
        isOpen === false ||
        open === false ||
        isVisible === false ||
        visible === false
      ) {
        timeout = setTimeout(async () => {
          setShouldUnmount(true)

          if (shouldRemount === true) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            setShouldUnmount(false)
          }
        }, delay)
      } else {
        setShouldUnmount(false)
        clearTimeout(timeout)
      }

      return () => {
        clearTimeout(timeout)
      }
    }, [show, isOpen, open, isVisible, visible])

    /* ======================
            return
    ====================== */

    if (shouldUnmount) {
      return null
    }
    return <Component {...props} />
  }

  return Unmounter
}
