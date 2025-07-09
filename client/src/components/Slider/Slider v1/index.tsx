import {
  Fragment,
  useState,
  ReactElement,
  CSSProperties,
  useEffect
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMeasure } from './useMeasure'

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'

type Slide = { index: number; direction: -1 | 1 }

interface ISlider {
  children?: ReactElement | ReactElement[]
  className?: string
  /** number in milliseconds */
  duration?: number
  style?: CSSProperties
}

//# Add ability to style controls, and/or pass in custom controls.
//# Add indicators
//# Add controlled/uncontrolled implementation.

/* ========================================================================
                                Slider
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This  demo is based off of a Sam Selikoff youtube video:
//
//   https://www.youtube.com/watch?v=aV2YJuxQ2vo
//   https://github.com/samselikoff/2022-06-02-animated-carousel/commit/999107789248de41ff8c7d51238c18662236da02
//   https://codesandbox.io/p/sandbox/github/samselikoff/2022-06-02-animated-carousel/tree/main?file=%2Fpages%2Findex.jsx%3A1%2C1-69%2C1
//
// His version was way too simple, so I gave it a little upgrade.
//
// Usage:
//
//  const textShadow ='0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0)'
//
//   const slides = (
//     <>
//       <Slider.Slide className='flex items-center justify-center bg-red-500 text-6xl font-black text-white'    style={{ textShadow }}>1</Slider.Slide>
//       <Slider.Slide className='flex items-center justify-center bg-orange-500 text-6xl font-black text-white' style={{ textShadow }}>2</Slider.Slide>
//       <Slider.Slide className='flex items-center justify-center bg-yellow-500 text-6xl font-black text-white' style={{ textShadow }}>3</Slider.Slide>
//       <Slider.Slide className='flex items-center justify-center bg-green-500 text-6xl font-black text-white'  style={{ textShadow }}>4</Slider.Slide>
//       <Slider.Slide className='flex items-center justify-center bg-blue-500 text-6xl font-black text-white'   style={{ textShadow }}>5</Slider.Slide>
//       <Slider.Slide className='flex items-center justify-center bg-violet-700 text-6xl font-black text-white' style={{ textShadow }}>6</Slider.Slide>
//     </>
//   )
//
//   ...
//
//   <Slider
//    className='mx-auto aspect-video max-w-[600px] overflow-hidden rounded-2xl border border-black shadow-lg'
//    duration={500}
//   >{slides}</Slider>
//
/////////////////////////
//
// Initially, I was using a slide state without a queue. In order to prevent
// slides from running too quickly I was implementing a useThrottle(). However,
// a better approach is to simply add additional slides to a queue and then run
// those when the current animation completes.
//
// The most challenging part of the implementation was to get everything to work
// in a serialized/synchronous manner. This is a very robust Slider. It doesn't
// have indicators or anything like that, but it's basic functionality is super solid!
//
///////////////////////////////////////////////////////////////////////////

export const Slider = ({
  children,
  className = '',
  duration = 500,
  style = {}
}: ISlider) => {
  const forward = 1
  const backward = -1
  const initialSlide: Slide = { index: 0, direction: forward }

  // useMeasure() allows us to get width implicitly without knowing it in advance.
  // This means that the consumer can set width by whatever manner they choose and
  // it will always work.
  const [ref, { width }] = useMeasure()
  const [_, setQueue] = useState<Slide[]>([initialSlide])
  const [slide, setSlide] = useState<Slide>(initialSlide)
  const [isAnimating, setIsAnimating] = useState(false)

  /* ======================
        childrenArray
  ====================== */

  //! The use of children in this way is not great.
  //! See the 'Hooks 2024' app's useContext demo for how
  //! to correctly 'register' children.

  // Convert children to an array if it's not already.

  let childrenArray: any
  // | unknown[]
  // | (
  //     | ReactElement<any, string | React.JSXElementConstructor<any>>
  //     | undefined
  //   )[]

  // Check if children is Fragment, if so unwrap it.
  if (
    children &&
    'type' in children &&
    children.type === Fragment &&
    children.props &&
    typeof children.props === 'object' &&
    'children' in children.props
  ) {
    const unwrappedChildren = children.props.children

    childrenArray = Array.isArray(unwrappedChildren)
      ? unwrappedChildren
      : [unwrappedChildren]
  } else {
    childrenArray = Array.isArray(children) ? children : [children]
  }

  /* ======================
         useEffect()
  ====================== */
  // Whenever isAnimating becomes false, shift the first item
  // (i.e., slide) off of newQueue and then check newQueue[0].
  // If newQueue[0] exists, then set that as the new current
  // slide and set isAnimating to true.

  useEffect(() => {
    if (isAnimating) {
      return
    }
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue]
      newQueue.shift()

      if (newQueue[0]) {
        setSlide(newQueue[0])
        setIsAnimating(true)
      }
      return newQueue
    })
  }, [isAnimating])

  /* ======================
        renderSlide()
  ====================== */
  // Slide: How do we get away with having only one slide?
  // Because the key prop changes. For more on how keys work,
  // see this Web Dev Simplified tutorial for more info:
  // https://www.youtube.com/watch?v=vXJkeZf-4-4

  const renderSlide = () => {
    return (
      <motion.div
        key={slide.index}
        //className={`absolute inset-0 h-full w-full [&>*]:h-full [&>*]:w-full`}
        className={`absolute inset-0 h-full w-full`}
        variants={{
          enter: ({ direction, width }: any) => {
            return { x: direction * width }
          },
          center: { x: 0 },
          exit: ({ direction, width }: any) => {
            return { x: direction * -width }
          }
        }}
        initial='enter'
        animate='center'
        exit='exit'
        // Provide direction & width to variants.
        custom={{ direction: slide.direction, width }}
        transition={{
          duration: duration / 1000,
          ease: 'linear'
        }}
        onAnimationComplete={() => {
          setIsAnimating(false)
        }}
      >
        {childrenArray?.[slide.index]}
      </motion.div>
    )
  }

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <Fragment>
        <button
          onClick={() => {
            setQueue((prevQueue) => {
              const direction = backward
              const lastSlide = prevQueue[prevQueue.length - 1]
              // If there is a lastSlide, then we want to create the newSlide
              // based off the the lastSlide in the queur. However, it's also possible that
              // the queue is empty, in which case we'll use the current slide
              // as the basis from which to create the newSlide.
              const lastOrCurrentSlide = lastSlide ? lastSlide : slide

              const newSlide: Slide =
                lastOrCurrentSlide.index === 0
                  ? { index: childrenArray.length - 1, direction }
                  : {
                      index: lastOrCurrentSlide.index - 1,
                      direction
                    }

              // If the slide we are adding is the ONLY slide, then
              // set that slide as the current slide and set isAnimating to true.
              if (prevQueue.length === 0) {
                setIsAnimating(true)
                setSlide(newSlide)
              }

              return [...prevQueue, newSlide]
            })
          }}
          className='absolute top-0 left-0 flex h-full w-12 items-center justify-center text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          type='button'
        >
          <CircleChevronLeft className='pointer-events-none inline-block size-[1.25em]' />
        </button>
        <button
          onClick={() => {
            setQueue((prevQueue) => {
              const direction = forward
              const lastSlide = prevQueue[prevQueue.length - 1]
              // If there is a lastSlide, then we want to create the newSlide
              // based off the the lastSlide. However, it's also possible that
              // the queue is empty, in which case we'll use the current slide
              // as the basis from which to create the newSlide.
              const lastOrCurrentSlide = lastSlide ? lastSlide : slide

              const newSlide: Slide =
                lastOrCurrentSlide.index === childrenArray.length - 1
                  ? { index: 0, direction }
                  : {
                      index: lastOrCurrentSlide.index + 1,
                      direction
                    }

              // If the slide we are adding is the ONLY slide, then
              // set that slide as the current slide and set isAnimating to true.
              if (prevQueue.length === 0) {
                setIsAnimating(true)
                setSlide(newSlide)
              }

              return [...prevQueue, newSlide]
            })
          }}
          className='absolute top-0 right-0 flex h-full w-12 items-center justify-center text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          type='button'
        >
          <CircleChevronRight className='pointer-events-none inline-block size-[1.25em]' />
        </button>
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <section
      className={`group${className ? ` ${className}` : ''}`}
      style={{ position: 'relative', ...style }}
    >
      {/* Slide Container */}
      <div
        ref={ref}
        className='relative flex h-full items-center justify-center overflow-hidden bg-stone-900'
      >
        <AnimatePresence custom={{ direction: slide.direction, width }}>
          {renderSlide()}
        </AnimatePresence>
      </div>

      {renderControls()}
    </section>
  )
}

/* ========================================================================
                                Slide
======================================================================== */

export const Slide = ({ children, className = '', style = {} }: any) => {
  return (
    <div
      className={`h-full w-full${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}

Slider.Slide = Slide
