import {
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react'

/** At it's core SlideType is simply an object that stores the index of the
 * associated element that exists within the childElements array.
 * As such an object of type SlideType is not the actual slide, but a pointer to it's
 * indexed location within the childElements array. Why not just use an index number?
 * Rather than merely using an index, the index is wrapped in an object
 * literal in order to include other potentially useful information.
 * In this case, it's important to know the direction as well.
 */
export type SlideType = { index: number; direction: -1 | 1 }

type ChildElements = HTMLDivElement[]

export interface SliderContextValue {
  childElements: ChildElements
  addChildElement: (element: HTMLDivElement) => void
  removeChildElement: (element: HTMLDivElement) => void
  previousSlide: SlideType
  currentSlide: SlideType
  setCurrentSlide: Dispatch<SetStateAction<SlideType>>
  getNextSlide: () => void
  getPrevSlide: () => void
  getSlideByIndex: (index: number) => void
  forward: 1
  backward: -1
  setIsAnimating: Dispatch<SetStateAction<boolean>>
  duration: number
  setDuration: Dispatch<SetStateAction<number>>
  // [key: string]: any
}

const forward = 1
const backward = -1
const initialSlide: SlideType = { index: 0, direction: forward }

/* ========================================================================
                              SliderContext
======================================================================== */

export const SliderContext = createContext({} as SliderContextValue)
export const Consumer = SliderContext.Consumer

export const SliderProvider = ({ children }: PropsWithChildren) => {
  const [childElements, setChildElements] = useState<ChildElements>([])
  const [currentSlide, setCurrentSlide] = useState<SlideType>(initialSlide)
  const previousSlideRef = useRef<any>(undefined)
  const previousSlide = previousSlideRef.current
  const [_, setQueue] = useState<SlideType[]>([initialSlide])
  const [isAnimating, setIsAnimating] = useState(false)
  const [duration, setDuration] = useState(0)

  /* ======================
        getPrevSlide()
  ====================== */

  const getPrevSlide = () => {
    setQueue((prevQueue) => {
      const direction = backward
      const lastSlide = prevQueue[prevQueue.length - 1]
      // If there is a lastSlide, then we want to create the newSlide
      // based off the the lastSlide in the queur. However, it's also possible that
      // the queue is empty, in which case we'll use the currentSlide
      // as the basis from which to create the newSlide.
      const lastOrCurrentSlide = lastSlide ? lastSlide : currentSlide

      const newSlide: SlideType =
        lastOrCurrentSlide.index === 0
          ? { index: childElements.length - 1, direction }
          : {
              index: lastOrCurrentSlide.index - 1,
              direction
            }

      // If the slide we are adding is the ONLY slide, then
      // set that slide as the current slide and set isAnimating to true.
      if (prevQueue.length === 0) {
        setIsAnimating(true)

        setCurrentSlide((prevSlide) => {
          previousSlideRef.current = prevSlide
          return newSlide
        })
      }

      return [...prevQueue, newSlide]
    })
  }

  /* ======================
        getNextSlide()
  ====================== */

  const getNextSlide = () => {
    setQueue((prevQueue) => {
      const direction = forward
      const lastSlide = prevQueue[prevQueue.length - 1]
      // If there is a lastSlide, then we want to create the newSlide
      // based off the the lastSlide. However, it's also possible that
      // the queue is empty, in which case we'll use the currentSlide
      // as the basis from which to create the newSlide.
      const lastOrCurrentSlide = lastSlide ? lastSlide : currentSlide

      const newSlide: SlideType =
        lastOrCurrentSlide.index === childElements.length - 1
          ? { index: 0, direction }
          : {
              index: lastOrCurrentSlide.index + 1,
              direction
            }

      // If the slide we are adding is the ONLY slide, then
      // set that slide as the current slide and set isAnimating to true.
      if (prevQueue.length === 0) {
        setIsAnimating(true)

        setCurrentSlide((prevSlide) => {
          previousSlideRef.current = prevSlide
          return newSlide
        })
      }
      return [...prevQueue, newSlide]
    })
  }

  /* ======================
      getSlideByIndex()
  ====================== */

  const getSlideByIndex = (index: number) => {
    setQueue((prevQueue) => {
      const lastSlide = prevQueue[prevQueue.length - 1]
      const lastOrCurrentSlide = lastSlide ? lastSlide : currentSlide

      // Return early the selected slide (i.e., index) is the current slide.
      // If we don't do this, it ends up breaking logic elsewhere.
      if (index === lastOrCurrentSlide.index) {
        return prevQueue
      }

      const direction = index > lastOrCurrentSlide.index ? forward : backward

      const newSlide: SlideType = { index, direction }

      // If the slide we are adding is the ONLY slide, then
      // set that slide as the current slide and set isAnimating to true.
      if (prevQueue.length === 0) {
        setIsAnimating(true)

        setCurrentSlide((prevSlide) => {
          previousSlideRef.current = prevSlide
          return newSlide
        })
      }
      return [...prevQueue, newSlide]
    })
  }

  /* ======================
      addChildElement() 
  ====================== */
  // Will be used in useEffect(), so wrap in useCallback()

  const addChildElement = useCallback((element: HTMLDivElement) => {
    setChildElements((prevChildElements) => {
      return [...prevChildElements, element]
    })
  }, [])

  /* ======================
      removeChildElement() 
  ====================== */
  // Will be used in useEffect(), so wrap in useCallback()

  const removeChildElement = useCallback((element: HTMLDivElement) => {
    setChildElements((prevChildElements) => {
      return prevChildElements.filter((e) => e !== element)
    })
  }, [])

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
        setCurrentSlide((prevSlide) => {
          if (newQueue[0]) {
            previousSlideRef.current = prevSlide
            return newQueue[0]
          }
          return prevSlide
        })

        setIsAnimating(true)
      }
      return newQueue
    })
  }, [isAnimating])

  /* ======================
          return
  ====================== */

  return (
    <SliderContext.Provider
      value={{
        childElements,
        addChildElement,
        removeChildElement,
        currentSlide,
        setCurrentSlide,
        previousSlide,
        forward,
        backward,
        getPrevSlide,
        getNextSlide,
        getSlideByIndex,
        setIsAnimating,
        duration,
        setDuration
      }}
    >
      {children}
    </SliderContext.Provider>
  )
}

export function useSliderContext() {
  const value = useContext(SliderContext)
  return value
}
