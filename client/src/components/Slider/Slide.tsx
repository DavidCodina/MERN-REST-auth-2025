import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSliderContext } from './SliderContext'

/* ========================================================================
                                Slide
======================================================================== */

export const Slide = ({ children, className = '', style = {} }: any) => {
  const {
    addChildElement,
    childElements,
    currentSlide,
    previousSlide,
    setIsAnimating,
    duration
  } = useSliderContext()
  const hasMountedRef = useRef(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const isCurrent = childElements[currentSlide.index] === ref.current

  const isPrevious =
    previousSlide && childElements[previousSlide.index] === ref.current

  /* ======================
        useEffect()
  ====================== */
  // On mount, add the JSX element (i.e. ref.current) to the childElements array.

  useEffect(() => {
    if (hasMountedRef.current) {
      return
    }
    hasMountedRef.current = true

    if (ref.current !== null) {
      const element = ref.current
      addChildElement(element)
    }

    // Possibly return cleanup function that removes the element.
    // That said, it may create weird behavior.
  }, [addChildElement])

  /* ======================
          return
  ====================== */

  return (
    <motion.div
      ref={ref}
      className={`absolute h-full w-full${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        overflow: 'auto', // ???
        zIndex: isCurrent || isPrevious ? 1 : 0
      }}
      variants={{
        enter: ({ direction }: any) => {
          return {
            x: [`${direction * 100}%`, '0%'],
            zIndex: 1
          }
        },
        exit: ({ direction }: any) => {
          return { x: `${direction * -100}%`, zIndex: 1 }
        }
      }}
      // initial={false} // In the current implementation this will have no effect.
      animate={isCurrent ? 'enter' : isPrevious ? 'exit' : {}}
      custom={{
        direction: currentSlide.direction
      }}
      transition={{
        duration: duration / 1000,
        ease: 'linear'
      }}
      onAnimationComplete={() => {
        if (isCurrent) {
          setIsAnimating(false)
        }
      }}
    >
      {children}
    </motion.div>
  )
}
