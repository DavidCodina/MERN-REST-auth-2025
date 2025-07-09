import {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { Chevron } from './Chevron'

export type Props = {
  cursorRef: MutableRefObject<number | null>
  disabled: boolean
  error?: string
  floatValueRef: MutableRefObject<number>
  hideControls: boolean
  internalRef: MutableRefObject<HTMLInputElement | null>
  isProgrammaticUpdateRef: MutableRefObject<boolean>
  maxNumberOrUndefined: number | undefined
  minNumberOrUndefined: number | undefined
  setInternalValue: Dispatch<SetStateAction<string>>
  step: number
  stepHoldDelay: number
  stepHoldInterval: number
  touched?: boolean
}

/* ========================================================================
                                Controls
======================================================================== */

export const Controls = ({
  cursorRef,
  disabled,
  error,
  floatValueRef,
  hideControls,
  internalRef,
  isProgrammaticUpdateRef,
  maxNumberOrUndefined,
  minNumberOrUndefined,
  setInternalValue,
  step,
  stepHoldDelay,
  stepHoldInterval,
  touched
}: Props) => {
  /* ======================
        state & refs
  ====================== */

  const isPointingRef = useRef(false)

  const [isStepping, setIsStepping] = useState(false)
  const [stepDirection, setStepDirection] = useState(true) // Possibly change name choice.

  const [controlsContainerStyle, setControlsContainerStyle] =
    useState<CSSProperties>({})

  /* ======================
          onStep()
  ====================== */

  const onStep = (isIncrement: boolean) => {
    if (typeof floatValueRef.current !== 'number') {
      return
    }

    const floatValue = floatValueRef.current

    if (
      typeof minNumberOrUndefined === 'number' &&
      floatValue - step < minNumberOrUndefined
    ) {
      return
    }

    if (
      isIncrement &&
      typeof maxNumberOrUndefined === 'number' &&
      floatValue + step > maxNumberOrUndefined
    ) {
      return
    }

    const newFloatValue = isIncrement ? floatValue + step : floatValue - step
    floatValueRef.current = newFloatValue

    // Logic for cursor consistently being in end position.
    const newStringValue = newFloatValue.toString()
    if (typeof newStringValue === 'string') {
      cursorRef.current = newStringValue.length
      if (internalRef.current) {
        internalRef.current.style.caretColor = 'transparent'
      }
    }

    isProgrammaticUpdateRef.current = true
    setInternalValue(newFloatValue.toString())
  }

  /* ======================
        startStepping()
  ====================== */

  const startStepping = (isIncrement: boolean) => {
    setStepDirection(isIncrement)
    setIsStepping(true)
  }

  /* ======================
        stopStepping()
  ====================== */

  const stopStepping = () => {
    isPointingRef.current = false
    setIsStepping(false)
  }

  /* ======================
        useLayoutEffect(()
  ====================== */

  useLayoutEffect(() => {
    if (isStepping) {
      const interval = setInterval(() => {
        onStep(stepDirection)
      }, stepHoldInterval)
      return () => clearInterval(interval)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStepping, stepDirection, stepHoldInterval])

  /* ======================
      useLayoutEffect(()
  ====================== */
  // This useLayoutEffect() sets the borderRadius on the <div> containing the controls.

  useLayoutEffect(() => {
    if (!internalRef.current || typeof window === 'undefined') {
      return
    }

    const computedStyle = window.getComputedStyle(internalRef.current)
    let borderRadius = computedStyle.borderRadius

    if (typeof borderRadius === 'string') {
      //# This extra bit assumes that the borderRadius is 1px, but really we should check.
      if (borderRadius.endsWith('px')) {
        borderRadius = borderRadius.replace('px', '')
        const n = parseFloat(borderRadius)
        if (!isNaN(n)) {
          borderRadius = `${n - 1}px`
        }
      }

      setControlsContainerStyle({
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    if (hideControls) {
      return null
    }

    const color = error
      ? 'var(--form-invalid-color, red)'
      : touched && !error
        ? 'var(--form-valid-color, green)'
        : 'var(--form-border-color, #a3a3a3)'

    const borderColor = color

    return (
      <div
        className='absolute right-0 flex h-full w-6 flex-col'
        style={{
          ...controlsContainerStyle,
          overflow: 'hidden',
          top: 1,
          right: 1,
          height: 'calc(100% - 2px)'
        }}
      >
        <button
          className='flex flex-1 items-center justify-center hover:bg-neutral-200'
          disabled={disabled}
          style={{
            borderLeft: `1px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`
          }}
          type='button'
          ///////////////////////////////////////////////////////////////////////////
          //
          // Mantine UI likely uses onMouseDown={(event) => event.preventDefault()} to prevent the default behavior
          // of the mouse down event. Here are a few reasons why this might be important:
          //
          //   1. Preventing Text Selection: When you click and hold on an element, the browser might start selecting text.
          //      By preventing the default behavior, you can avoid unwanted text selection, which can interfere with the user experience.
          //
          //   2. Preventing Focus: In some cases, clicking on a button might cause the input field to lose focus. Preventing the default
          //      behavior ensures that the input field remains focused, which is important for maintaining a smooth user experience.
          //
          //   3. Custom Behavior: By preventing the default behavior, you can ensure that only your custom behavior (such as auto
          //      incrementing/decrementing) is executed. This can help avoid conflicts with the browser’s default actions.
          //
          //   4. Consistency Across Devices: Preventing the default behavior can help ensure consistent behavior across different devices
          //      and browsers, especially when dealing with touch events.
          //
          ///////////////////////////////////////////////////////////////////////////
          onMouseDown={(event) => event.preventDefault()}
          ///////////////////////////////////////////////////////////////////////////
          //
          // The PointerEvent API provides a unified way to handle input from various pointing devices,
          // such as a mouse, pen, or touch. This means you can write a single event handler that works
          // across different devices, making the code more maintainable and reducing the need for
          // device-specific event handling.
          //
          ///////////////////////////////////////////////////////////////////////////

          onPointerDown={(e) => {
            e.preventDefault() // Mantine does this, but why?
            if (disabled) {
              return
            }

            if (typeof floatValueRef.current !== 'number') {
              return
            }

            const floatValue = floatValueRef.current

            const outOfRange =
              typeof maxNumberOrUndefined === 'number' &&
              floatValue + step > maxNumberOrUndefined

            if (outOfRange) {
              return
            }

            const newFloatValue = floatValue + step
            floatValueRef.current = newFloatValue

            // Logic for cursor consistently being in end position.
            const newStringValue = newFloatValue.toString()
            if (typeof newStringValue === 'string') {
              // This is then checked by a useLayoutEffect() that watches for changes to internalValue.
              // If cursorRef.current is not null, then it will use current to set the cursor position.
              cursorRef.current = newStringValue.length
              if (internalRef.current) {
                internalRef.current.style.caretColor = 'transparent'
              }
            }

            isProgrammaticUpdateRef.current = true
            setInternalValue(newFloatValue.toString())

            isPointingRef.current = true
            setTimeout(() => {
              if (isPointingRef.current === true) {
                startStepping(true)
              }
            }, stepHoldDelay)
          }}
          onPointerUp={() => {
            stopStepping()
          }}
          onPointerLeave={() => {
            stopStepping()
          }}
        >
          <Chevron direction='up' style={{ color: color }} />
        </button>
        <button
          className='flex flex-1 items-center justify-center hover:bg-neutral-200'
          disabled={disabled}
          style={{
            borderLeft: `1px solid ${borderColor}`,
            borderTop: `0.5px solid ${borderColor}`
          }}
          type='button'
          onMouseDown={(event) => event.preventDefault()}
          onPointerDown={() => {
            if (disabled) {
              return
            }

            if (typeof floatValueRef.current !== 'number') {
              return
            }

            const floatValue = floatValueRef.current

            const outOfRange =
              typeof minNumberOrUndefined === 'number' &&
              floatValue - step < minNumberOrUndefined

            if (outOfRange) {
              return
            }

            const newFloatValue = floatValue - step
            floatValueRef.current = newFloatValue

            // Logic for cursor consistently being in end position.
            const newStringValue = newFloatValue.toString()
            if (typeof newStringValue === 'string') {
              cursorRef.current = newStringValue.length
              if (internalRef.current) {
                internalRef.current.style.caretColor = 'transparent'
              }
            }

            isProgrammaticUpdateRef.current = true
            setInternalValue(newFloatValue.toString())

            isPointingRef.current = true
            setTimeout(() => {
              if (isPointingRef.current === true) {
                startStepping(false)
              }
            }, stepHoldDelay)
          }}
          onPointerUp={stopStepping}
          onPointerLeave={stopStepping}
        >
          <Chevron direction='down' style={{ color: color }} />
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderControls()
}
