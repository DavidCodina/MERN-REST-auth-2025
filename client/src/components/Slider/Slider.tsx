import { Fragment, ReactElement, CSSProperties, useEffect } from 'react'

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'

import { useSliderContext } from './SliderContext'

interface ISlider {
  children?: ReactElement | ReactElement[]
  className?: string
  /** number in milliseconds */
  duration?: number
  style?: CSSProperties
  controls?: boolean
  indicators?: boolean
}

//# Add controlled/uncontrolled implementation.

/* ========================================================================
                                Slider
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// This demo was originally based off of a Sam Selikoff youtube video:
//
//   https://www.youtube.com/watch?v=aV2YJuxQ2vo
//   https://github.com/samselikoff/2022-06-02-animated-carousel/commit/999107789248de41ff8c7d51238c18662236da02
//   https://codesandbox.io/p/sandbox/github/samselikoff/2022-06-02-animated-carousel/tree/main?file=%2Fpages%2Findex.jsx%3A1%2C1-69%2C1
//
// His version was way too simple, so I gave it a major upgrade.
//
// Initially, I was using a slide state without a queue. In order to prevent
// slides from running too quickly I was implementing a useThrottle(). However,
// a better approach is to simply add additional slides to a queue and then run
// those when the current animation completes.
//
// The most challenging part of the implementation was to get everything to work
// in a serialized/synchronous manner.
//
///////////////////////////////////////////////////////////////////////////

export const Slider = ({
  children,
  className = '',
  duration = 500,
  style = {},
  controls = true,
  indicators = true
}: ISlider) => {
  const {
    getPrevSlide,
    getNextSlide,
    getSlideByIndex,
    currentSlide,
    setDuration,
    childElements
  } = useSliderContext()

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <Fragment>
        <button
          onClick={getPrevSlide}
          className='absolute top-0 left-0 flex h-full w-12 items-center justify-center text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          style={{ zIndex: 2 }}
          type='button'
        >
          <CircleChevronLeft className='pointer-events-none inline-block size-[1.25em]' />
        </button>
        <button
          onClick={getNextSlide}
          className='absolute top-0 right-0 flex h-full w-12 items-center justify-center text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          type='button'
          style={{ zIndex: 2 }}
        >
          <CircleChevronRight className='pointer-events-none inline-block size-[1.25em]' />
        </button>
      </Fragment>
    )
  }

  /* ======================
      renderIndicators()
  ====================== */
  // Note: The opacity styles applied to the indicators container and to the
  // button controls may not be the greatest idea when it comes to touch devices.

  const renderIndicators = () => {
    return (
      <div
        className='absolute bottom-0 left-0 flex w-full flex-wrap justify-center gap-2 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        // The zIndex must be higher than the controls (2), and
        // higher than the currentSlide and previousSlide (1).
        style={{ zIndex: 3 }}
      >
        {childElements.map((_child, index) => {
          const isCurrent = index === currentSlide.index
          return (
            <button
              key={index}
              className={`cursor-pointer rounded bg-white hover:opacity-100 ${isCurrent ? 'opacity-100' : 'opacity-60'} `}
              style={{
                height: 12,
                width: 24
              }}
              onClick={() => {
                getSlideByIndex(index)
              }}
            />
          )
        })}
      </div>
    )
  }

  /* ======================
        useEffect()
  ====================== */
  // Initially, duration is set to 0 in SliderContext.
  // This will effectively prevent the initial animation from running.
  // Technically, it will run immediately for 0 seconds.
  // Then after mount we set the actual duration.
  // 250ms is used as an arbitrary value for when to set the actual duration.

  useEffect(() => {
    setTimeout(() => {
      setDuration(duration)
    }, 250)
  }, [duration, setDuration])

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
        // overflow-hidden
        className='relative flex h-full items-center justify-center bg-stone-900'
      >
        {/* Children Container */}
        <div
          // overflow-hidden
          className='relative h-full w-full bg-stone-900'
        >
          {children}
        </div>
      </div>

      {controls && renderControls()}
      {indicators && renderIndicators()}
    </section>
  )
}
