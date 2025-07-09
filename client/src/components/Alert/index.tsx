// Third-party imports
import { ComponentProps, CSSProperties, Fragment, ReactNode } from 'react'

interface IAlert extends ComponentProps<'div'> {
  leftSection?: ReactNode
  leftStyle?: CSSProperties
  leftClassName?: string

  /** Only applicable when leftSection or rightSection has content. */
  centerStyle?: CSSProperties
  /** Only applicable when leftSection or rightSection has content. */
  centerClassName?: string

  rightSection?: ReactNode
  rightStyle?: CSSProperties
  rightClassName?: string
}

/* ========================================================================
                                Alert
======================================================================== */

const Alert = ({
  children,
  leftSection = null,

  leftClassName = '',
  leftStyle = {},

  centerClassName = '',
  centerStyle = {},

  rightSection = null,
  rightClassName = '',
  rightStyle = {},
  ...otherProps
}: IAlert) => {
  /* ======================
       renderContent()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // If there is no leftSection or rightSection, then do NOT
  // wrap children in <div>. Why? It's more intuitive when
  // children are not wrapped in a <div>.
  //
  // Why are leftSection & rightSection also wrapped in <div>s?
  // First, if the consumer wraps content in a Fragment, then
  // it will break the layout when the flex implementation sees
  // each child as its own item. Second, if the consumer passes in
  // a single <svg> without adding style={{flexShrink: 0}}, then the
  // flex container will potentially shrink the <svg>.
  //
  // For maximum configurability, each section also has its own style and
  // className props. This allows for each section to alignItems, etc.
  //
  ///////////////////////////////////////////////////////////////////////////

  const renderContent = () => {
    if (leftSection || rightSection) {
      return (
        <Fragment>
          <div className={leftClassName} style={leftStyle}>
            {leftSection}
          </div>

          <div className={centerClassName} style={centerStyle}>
            {children}
          </div>

          <div className={rightClassName} style={rightStyle}>
            {rightSection}
          </div>
        </Fragment>
      )
    }
    return children
  }

  /* ======================
          return
  ====================== */

  return (
    <div role='alert' {...otherProps}>
      {renderContent()}
    </div>
  )
}

/* ========================================================================
                              AlertHeading
======================================================================== */

const AlertHeading = ({
  children,
  className = '',
  ...otherProps
}: ComponentProps<'h5'>) => {
  return (
    <h5
      className={`alert-heading${className ? ` ${className}` : ''}`}
      {...otherProps}
    >
      {children}
    </h5>
  )
}

/* ========================================================================
                                AlertLink
======================================================================== */

const AlertLink = ({
  children,
  className = '',
  ...otherProps
}: ComponentProps<'a'>) => {
  return (
    <a
      className={`alert-link${className ? ` ${className}` : ''}`}
      rel='noopener noreferrer'
      target='_blank'
      {...otherProps}
    >
      {children}
    </a>
  )
}

/* ========================================================================
                                AlertCloseButton
======================================================================== */

const AlertCloseButton = ({
  className = '',
  ...otherProps
}: Omit<ComponentProps<'button'>, 'children'>) => {
  return (
    <button
      className={`alert-btn-close${className ? ` ${className}` : ''}`}
      type='button'
      {...otherProps}
    />
  )
}

// Todo: Add in other button color fixes, especially for red, yellow, blue, and sky.

const greenButtonFix =
  'btn-green border-green-700 bg-green-600 hover:border-green-700 hover:bg-green-600'

const redButtonFix =
  'btn-red border-red-700 bg-red-600 hover:border-red-700 hover:bg-red-600'

const skyButtonFix =
  'btn-sky border-sky-700 bg-sky-600 hover:border-sky-700 hover:bg-sky-600'

const blueButtonFix =
  'btn-blue border-blue-700 bg-blue-600 hover:border-blue-700 hover:bg-blue-600'

const cyanButtonFix =
  'btn-cyan border-cyan-700 bg-cyan-600 hover:border-cyan-700 hover:bg-cyan-600'

const tealButtonFix =
  'btn-teal border-teal-700 bg-teal-600 hover:border-teal-700 hover:bg-teal-600'

const yellowButtonFix =
  'btn-yellow border-yellow-600 bg-yellow-500 hover:border-yellow-600 hover:bg-yellow-500'

const CompoundComponent = Object.assign(Alert, {
  Heading: AlertHeading,
  Link: AlertLink,
  CloseButton: AlertCloseButton,
  greenButtonFix,
  redButtonFix,
  yellowButtonFix,
  blueButtonFix,
  skyButtonFix,
  cyanButtonFix,
  tealButtonFix
})

export { CompoundComponent as Alert, AlertHeading }
