import { CSSProperties, Fragment, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import './styles.css'

type Slider = {
  error?: string
  touched?: boolean
  formGroupClassName?: string
  formGroupStyle?: CSSProperties
  formText?: string
  formTextClassName?: string
  formTextStyle?: React.CSSProperties
  label?: string // Could be React.ReactNode, but string is okay for now.
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: React.CSSProperties
  /** Strips out the formGroup, label, formText and error message JSX. */
  sliderOnly?: boolean
  showToolTipWhen?: 'always' | 'hover' | 'focus' | 'hover-focus' | 'never'
} & Slider.SliderProps

const _sortNumbers = (arr: number[]): number[] => {
  if (!Array.isArray(arr)) {
    return arr
  }
  return [...arr].sort((a, b) => a - b)
}

/* ========================================================================
                                RadixSlider
======================================================================== */

export const RadixSlider = ({
  error = '',
  touched = false,
  formGroupClassName = '',
  formGroupStyle = {},

  className = '',
  disabled = false,

  label = '',
  labelClassName = '',
  labelRequired = false,
  labelStyle = {},

  formText = '',
  formTextClassName = '',
  formTextStyle = {},

  defaultValue,
  style = {},
  min = 0,
  max = 100,
  minStepsBetweenThumbs = 1,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  onValueCommit,
  onValueChange,
  step = 1,
  value,

  sliderOnly = false,
  showToolTipWhen = 'always',
  ...otherProps
}: Slider) => {
  const [internalValue, setInternalValue] = useState<number[]>(() => {
    if (Array.isArray(value)) {
      return value
    } else if (Array.isArray(defaultValue)) {
      return defaultValue
    }
    return []
  })

  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const showTooltip = (() => {
    if (showToolTipWhen === 'always') {
      return true
    }

    if (showToolTipWhen === 'hover' && hovered) {
      return true
    }

    if (showToolTipWhen === 'focus' && focused) {
      return true
    }

    if (showToolTipWhen === 'hover-focus' && (hovered || focused)) {
      return true
    }

    // Case: 'never' & default
    return false
  })()

  /* ======================
    Infer number of thumbs
  ====================== */

  const numberOfThumbs = (() => {
    let x = 1

    if (Array.isArray(value)) {
      x = value.length
    } else if (Array.isArray(defaultValue)) {
      x = defaultValue.length
    }

    return x
  })()

  /* ======================
        sliderThumbs
  ====================== */

  const sliderThumbs = Array.from({ length: numberOfThumbs }, (_, i) => {
    return (
      <Fragment key={i}>
        <Slider.Thumb className='SliderThumb' aria-label='Range value'>
          {typeof internalValue?.[i] === 'number' && showTooltip && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 4,
                border: '0.5px solid #888',
                color: '#333',
                fontSize: 10,
                lineHeight: 1,
                minWidth: 16,
                position: 'absolute',
                padding: 2,
                top: '0%',
                left: '50%',
                transform: 'translate(-50%,-125%)'
              }}
            >
              {' '}
              {internalValue?.[i]}
            </div>
          )}
        </Slider.Thumb>
      </Fragment>
    )
  })

  /* ======================
          getClassName()
  ====================== */

  const getClassName = () => {
    let classes = 'SliderRoot'

    if (error) {
      classes = `${classes} invalid-radix-slider`
    } else if (!error && touched) {
      classes = `${classes} valid-radix-slider`
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
          className={`form-label${labelClassName ? ` ${labelClassName}` : ''}`}
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
      return <div className='invalid-feedback block'>{error}</div>
    }
    return null
  }

  /* ======================
        renderSlider
  ====================== */

  const renderSlider = () => {
    return (
      <Slider.Root
        {...otherProps}
        className={getClassName()}
        defaultValue={defaultValue} // This is only set by Radix on initialization.
        max={max} // defaults to 100
        min={min} // defaults to 0
        step={step} // defaults to 1
        disabled={disabled}
        onValueChange={(value) => {
          onValueChange?.(value)
          setInternalValue(value)
        }}
        // This is like a debounced version of onValueChange.
        // It's useful for getting the final value of uncontrolled implementations.
        // However, for controlled implementations using this value will actually
        // prevent the ranger slider from moving.
        onValueCommit={(value) => {
          // From what I've seen of the uncontrolled implementation,
          // the value does not need to be sorted. It does that already internally.
          // const sortedValue = sortNumbers(value)
          onValueCommit?.(value)
        }}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        style={style}
        value={value}
        onBlur={(e) => {
          onBlur?.(e)
          setFocused(false)
        }}
        onFocus={(e) => {
          onFocus?.(e)
          setFocused(true)
        }}
        onMouseEnter={(e) => {
          onMouseEnter?.(e)
          setHovered(true)
        }}
        onMouseLeave={(e) => {
          onMouseLeave?.(e)
          setHovered(false)
        }}
      >
        <Slider.Track className='SliderTrack'>
          <Slider.Range className='SliderRange' />
        </Slider.Track>

        {sliderThumbs}
      </Slider.Root>
    )
  }

  /* ======================
          return
  ====================== */

  if (sliderOnly) {
    return renderSlider()
  }

  return (
    <div className={formGroupClassName} style={formGroupStyle}>
      {renderLabel()}
      {renderSlider()}
      {renderFormText()}
      {renderError()}
    </div>
  )
}
