// Third-party imports
import { CSSProperties } from 'react'

// Custom imports
import { twMerge } from 'tailwind-merge'

interface ISpinner {
  className?: string
  containerClassName?: string
  containerStyle?: CSSProperties
  size?: string | number
  style?: CSSProperties
  useContainer?: boolean
}

// Helper for object literals.
function isEmpty(obj: any) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

/* ========================================================================
                                Spinner
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// useContainer = false by default. However, configuring containerClasses or containerStyle,
// will still cause the spinner to render with a <div> wrapper.
// In the absence of any other styling, the spinner will default to the currentColor
// of the parent element.
//
// Usage:
//
//   <Spinner
//     className='border-[5px] text-violet-800'
//     containerClassName='flex justify-center'
//     size={30}
//   />
//
// One benefit of this Spinner is that it adds the .sr-only text.
//
///////////////////////////////////////////////////////////////////////////

export const Spinner = ({
  className = '',
  containerClassName = '',
  containerStyle = {},
  size = 50,
  style = {},
  useContainer = false
}: ISpinner) => {
  /* ======================
      getClassName()
  ====================== */

  const getClassName = () => {
    let _className = `spinner-border`

    if (className) {
      _className = twMerge(_className, className)
    }

    return _className
  }

  /* ======================
        renderSpinner()
  ====================== */

  const renderSpinner = () => {
    const spinner = (
      <div
        className={getClassName()}
        role='status'
        style={{ width: size, height: size, ...style }}
      >
        <span className='sr-only'>Loading...</span>
      </div>
    )

    if (useContainer || containerClassName || !isEmpty(containerStyle)) {
      return (
        <div className={containerClassName} style={containerStyle}>
          {spinner}
        </div>
      )
    }

    return spinner
  }

  /* ======================
          return
  ====================== */

  return renderSpinner()
}
