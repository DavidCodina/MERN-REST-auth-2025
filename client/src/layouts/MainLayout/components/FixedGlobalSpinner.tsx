// Third-party imports
import { useState, useEffect } from 'react'
import { useNavigation } from 'react-router'

/* ========================================================================
                            FixedGlobalSpinnner
======================================================================== */

export const FixedGlobalSpinner = ({ delay = 0 }: { delay?: number }) => {
  const navigation = useNavigation()

  const navigationState = navigation.state
  const [showSpinner, setShowSpinner] = useState(false)

  const spinner = (
    <div
      aria-label='Loading'
      className='pointer-events-none fixed inset-0 flex items-center justify-center'
      style={{ zIndex: 9999 }}
    >
      <div className='relative flex h-20 w-20'>
        <i className='absolute h-full w-full animate-[custom-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-t-transparent border-r-transparent border-b-violet-800 border-l-transparent'></i>
        <i className='absolute h-full w-full animate-[custom-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-t-transparent border-r-transparent border-b-violet-800 border-l-transparent opacity-75'></i>
      </div>
    </div>
  )

  /* ======================
        useEffect()
  ====================== */
  // Because it's annoying to see a momentary spinner, it's
  // better to wait at least 500ms before showing it.
  // One thing you don't want is for the

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (navigationState === 'loading') {
      timeout = setTimeout(() => {
        setShowSpinner(true)
      }, delay)
    }

    // Make sure to prevent the spinner from rendering
    // AFTER the component has already loaded.
    return () => {
      clearTimeout(timeout)
      setShowSpinner(false)
    }
  }, [delay, navigationState])

  /* ======================
        renderSpinner()
  ====================== */

  const renderSpinner = () => {
    if (showSpinner) {
      // return (
      //   <div className='fixed inset-0' style={{ zIndex: 9999 }}>
      //     <div
      //       className='absolute'
      //       style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
      //     >
      //       <FontAwesomeIcon className='text-6xl text-blue-500' icon={faSpinner} spin />
      //     </div>
      //   </div>
      // )
      return spinner
    }
    return null
  }

  return renderSpinner()
}
