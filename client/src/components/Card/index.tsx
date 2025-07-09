// Third-party imports
import { twMerge } from 'tailwind-merge'

// Custom imports
import { ICard, ICardHeading, ICardBody, ICardText } from './types'

/* ========================================================================
                                Card
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// <Card className='mb-6'>
//   <Card.Heading className='text-blue-500 dark:text-cyan-400'>
//     This is the Title
//   </Card.Heading>
//   <Card.Body>
//     <Card.Text>
//       Lorem ipsum dolor sit amet consectetur, adipisicing elit.
//       Similique debitis laborum eaque earum ullam quos quidem beatae...
//     </Card.Text>
//   </Card.Body>
// </Card>
//
///////////////////////////////////////////////////////////////////////////

export const Card = ({
  className = '',
  children,
  style = {},
  ...otherProps
}: ICard) => {
  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    // Why no margins on the base style? Unlike Bootstrap that
    // puts margins on input fields and a whole bunch of other stuff
    // I do not do that here: https://mxstbr.com/thoughts/margin/
    const base = `
      relative 
      bg-white 
      border 
      border-stone-300 
      rounded-lg 
      shadow-sm 
      shadow-neutral-500
      transition-colors
      duration-300
      ease-linear
    `

    const dark = `dark:border-(--dark-primary-color) dark:bg-(--dark-bg-color) dark:shadow-(--dark-shadow-color)`

    const _className = twMerge(`${base} ${dark}`, className)
    return _className
  }

  /* ======================
          return 
  ====================== */

  return (
    <div
      // tailwind-merge is always VERY important. Why? Suppose user passes in bg-blue-500, but we've got bg-green-500.
      // Merely concatenating className last will not affect the actual cascade order in the compiled CSS.
      className={getClassName()}
      style={style}
      {...otherProps}
    >
      {children}
    </div>
  )
}

/* ========================================================================
                                CardHeading
======================================================================== */
// CardHeading is designed to work in conjunction with CardBody
// and provide a consistent heading size and look.

export const CardHeading = ({
  children,
  className = '',
  style = {},
  ...otherProps
}: ICardHeading) => {
  return (
    <h5
      className={twMerge('mt-4 -mb-2 px-4 font-black', className)}
      style={style}
      {...otherProps}
    >
      {children}
    </h5>
  )
}

/* ========================================================================
                                CardBody
======================================================================== */

export const CardBody = ({
  children,
  className = '',
  style = {},
  ...otherProps
}: ICardBody) => {
  return (
    <div className={twMerge('p-4', className)} style={style} {...otherProps}>
      {children}
    </div>
  )
}

/* ========================================================================
                                CardText
======================================================================== */
// Again, just another component to help create consistency inside of each <Card />.

export const CardText = ({
  children,
  className = '',
  style = {},
  ...otherProps
}: ICardText) => {
  return (
    <p
      className={twMerge('last:mb-0', className)}
      style={style}
      {...otherProps}
    >
      {children}
    </p>
  )
}

Card.Heading = CardHeading
Card.Body = CardBody
Card.Text = CardText
export default Card
