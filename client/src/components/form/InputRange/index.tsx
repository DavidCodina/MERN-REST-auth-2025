import {
  Fragment,
  forwardRef,
  useId,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react'

type Ref = HTMLInputElement

export type IInputRange = {
  error?: string // errors?.xxx?.message from react-hook-form

  formGroupClassName?: string
  formGroupStyle?: React.CSSProperties

  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties

  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties

  showMinMax?: boolean
  touched?: boolean // touchedFields?.xxx from react-hook-form
} & Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'placeholder'>

const useForceRender = (): VoidFunction => {
  const [, setForceRenderCount] = useState(0)
  return useCallback(() => {
    setForceRenderCount((v) => v + 1)
  }, [])
}

// See also: https://github.com/CharlesStover/use-force-update/blob/main/src/index.ts
// const useForceRender = (): VoidFunction => {
//   const createNewObject = (): Record<string, never> => ({})
//   const [, setValue] = useState<Record<string, never>>(createNewObject)
//   return useCallback((): void => {
//     setValue(createNewObject())
//   }, [])
// }

/* ========================================================================

======================================================================== */
//# Next steps:
//# This is a pretty good range slider, but I would prefer to
//# abstract much of the logic by using the Radix UI version instead.
//# https://www.radix-ui.com/primitives/docs/components/slider
//#
//# Currently, the problem is that if you tab to the input, then use
//# the arrow keys, the user has no way of knowing what the actual value is.

export const InputRange = forwardRef<Ref, IInputRange>(
  (
    {
      className = '',
      disabled = false,
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      id,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      style = {},
      showMinMax = true,
      touched,
      ...otherProps
    },
    ref
  ) => {
    const internalInputRef = useRef<HTMLInputElement | null>(null)
    // The cursor is the name of the tooltip that shows the current content value
    const cursorRef = useRef<HTMLDivElement | null>(null)

    const [moveValueWithCursor, setMoveValueWithCursor] = useState(false)

    const [rect, setRect] = useState<DOMRect>()
    const rectLeft = rect?.left
    const rectRight = rect?.right
    const forceRender = useForceRender() //eslint-disable-line

    const uuid = useId()
    id = id || uuid

    /* ======================
          useEffect()
    ====================== */
    // Listens for 'Tab', 'ArrowLeft', and 'ArrowRight' key presses...

    useEffect(() => {
      if (!internalInputRef) {
        return
      }

      const keydownListener = (e: any) => {
        // This is all based on the assumption that keyboard users navigate using Tab and
        // use left/right arrows for moving the range. If that's not the case then they
        // won't be able to operate the range.
        if (e.code === 'Tab') {
          // I believe this forces reflow.
          setTimeout(() => {
            const activeElement = document?.activeElement

            if (activeElement !== internalInputRef.current) {
              if (cursorRef.current) {
                cursorRef.current.style.top = '-500px'
                cursorRef.current.style.left = '-500px'
              }
            } else if (internalInputRef.current) {
              const rect = internalInputRef.current.getBoundingClientRect()
              const middle = (rect.right - rect.left) / 2 + rect.left

              if (cursorRef.current) {
                cursorRef.current.style.top = `${rect.top}px`
                cursorRef.current.style.left = `${middle}px`
              }

              setRect(rect)
            }
          }, 0)
        }

        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
          forceRender()
        }
      }

      window.addEventListener('keydown', keydownListener)
      return () => window.removeEventListener('keydown', keydownListener)
    }, [forceRender])

    /* ======================
          useEffect()
    ====================== */
    // Listens for cursor movement...

    useEffect(() => {
      if (!moveValueWithCursor) {
        return
      }

      const mouseMoveListener = (e: MouseEvent) => {
        if (cursorRef.current) {
          let left = e.clientX
          if (typeof rectLeft === 'number' && e.clientX < rectLeft) {
            left = rectLeft
          } else if (typeof rectRight === 'number' && e.clientX > rectRight) {
            left = rectRight
          }
          cursorRef.current.style.left = `${left}px`
        }
        forceRender()
      }

      window.addEventListener('mousemove', mouseMoveListener)
      return () => window.removeEventListener('mousemove', mouseMoveListener)
    }, [moveValueWithCursor, rectLeft, rectRight, forceRender])

    /* ======================
          getClassName()
    ====================== */

    const getClassName = () => {
      let classes = 'form-range'

      ///////////////////////////////////////////////////////////////////////////
      //
      // This  configuration is important. If there is an error, then
      // ALWAYS implement .is-valid. However, if there is no error then ONLY
      // implement .is-valid if touched is true. This makes it so the component
      // can be used without passing in touched and not have an immediate success green.
      // Note also that the component works best when react-hook-form mode is set to 'onTouched'.
      //
      ///////////////////////////////////////////////////////////////////////////
      if (error) {
        classes = `${classes} is-invalid`
      } else if (!error && touched) {
        classes = `${classes} is-valid`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
          renderLabel()
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
            className={`form-label${
              labelClassName ? ` ${labelClassName}` : ''
            }`}
            style={{
              ...labelStyle,
              ...(disabled ? { color: 'var(--form-disabled-color)' } : {})
            }}
          >
            {label}{' '}
            {labelRequired && (
              <sup
                className=''
                style={{
                  color: disabled ? 'inherit' : 'red'
                }}
              >
                *
              </sup>
            )}
          </label>
        )
      }
      return null
    }

    /* ======================
        renderFormText()
    ====================== */

    const renderFormText = () => {
      if (formText) {
        return (
          <div
            className={`form-text${
              formTextClassName ? ` ${formTextClassName}` : ''
            }`}
            style={formTextStyle}
          >
            {formText}
          </div>
        )
      }

      return null
    }

    /* ======================
          renderError()
    ====================== */

    const renderError = () => {
      if (error) {
        return <div className='invalid-feedback'>{error}</div>
      }
      return null
    }

    /* ======================
          renderMinMax()
    ====================== */

    const renderMinMax = () => {
      const { min, max } = otherProps

      if (
        showMinMax &&
        (typeof min === 'string' || typeof min === 'number') &&
        (typeof max === 'string' || typeof max === 'number')
      ) {
        return (
          <div
            style={{
              display: 'flex',
              color: '#333',
              fontWeight: 'bold',
              fontSize: 12,
              lineHeight: 1,
              marginBottom: -5,
              justifyContent: 'space-between',
              position: 'relative',
              top: -5
            }}
          >
            <div>{min}</div>
            <div>{max}</div>
          </div>
        )
      }

      return null
    }

    /* ======================
            return
    ====================== */

    return (
      <Fragment>
        <div
          ref={cursorRef}
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: 5,
            boxShadow: '0px 1px 1px rgba(0,0,0,0.5)',
            color: '#333',
            fontWeight: 'bold',
            fontSize: 12,
            left: -500,
            lineHeight: 1,
            padding: '2px 4px',
            pointerEvents: 'none',
            position: 'fixed',
            top: -500,
            transform: 'translate(-50%, -30px)',
            zIndex: 9999
          }}
        >
          {internalInputRef.current && internalInputRef.current?.value}
        </div>

        <div
          className={formGroupClassName}
          style={{
            position: 'relative',
            ...formGroupStyle
          }}
        >
          {renderLabel()}
          <input
            className={getClassName()}
            disabled={disabled}
            id={id}
            ref={(node) => {
              // We can't know in advance whether ref will be a function or an object literal.
              // If we're using react-hook-form, it will be a function, but we may not be using
              // react-hook-form. For that reason, we need to use the following conditional logic.
              // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library
              if (ref && 'current' in ref) {
                ref.current = node
              } else if (typeof ref === 'function') {
                ref?.(node)
              }
              internalInputRef.current = node
            }}
            style={style}
            type='range'
            onMouseDown={(e) => {
              const target = e.target as HTMLInputElement
              const rect = target.getBoundingClientRect()
              setRect(rect)

              if (cursorRef.current) {
                cursorRef.current.style.top = `${rect.top}px`
                cursorRef.current.style.left = `${e.clientX}px`
              }
              setMoveValueWithCursor(true)
            }}
            onMouseUp={() => {
              if (cursorRef.current) {
                cursorRef.current.style.top = '-500px'
                cursorRef.current.style.left = '-500px'
              }
              setMoveValueWithCursor(false)
            }}
            {...otherProps}
          />
          {renderMinMax()}
          {renderFormText()}
          {renderError()}
        </div>
      </Fragment>
    )
  }
)

InputRange.displayName = 'InputRange'
