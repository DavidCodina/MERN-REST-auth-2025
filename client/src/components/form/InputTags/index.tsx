import {
  CSSProperties,
  ComponentProps,
  forwardRef,
  useState,
  useEffect,
  useLayoutEffect,
  KeyboardEvent,
  MutableRefObject,
  useRef,
  useId
} from 'react'

import { Tag } from './Tag'
import { useOutsideClick } from './useOutsideClick'

type Tags = string[]

type Props = {
  apiRef?: MutableRefObject<unknown>
  editable?: boolean
  error?: string
  formGroupClassName?: string
  formGroupStyle?: CSSProperties
  formText?: string
  formTextClassName?: string
  formTextStyle?: CSSProperties
  initialValue?: Tags
  inputClassName?: string
  inputId?: string
  inputStyle?: CSSProperties
  label?: string
  labelClassName?: string
  labelRequired?: boolean
  labelStyle?: CSSProperties
  max?: number
  onMaxExceeded?: (max: number) => void
  onChange?: (newValue: Tags) => void
  size?: 'sm' | 'lg'
  tagClassName?: string
  tagStyle?: CSSProperties
  touched?: boolean
} & Omit<
  ComponentProps<'input'>,
  'onChange' | 'value' | 'defaultValue' | 'size'
>

export type TagsInputAPI = {
  clear: () => void
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/* ========================================================================
                                InputTags
======================================================================== */
// https://ark-ui.com/react/docs/components/tags-input

//# Create full RHF demo.

export const InputTags = forwardRef<HTMLInputElement, Props>(
  (
    {
      apiRef,
      className = '',
      disabled = false,
      editable = true,
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      id,
      initialValue,
      inputId,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},
      onBlur,
      onChange,
      max = Infinity,
      name,
      onMaxExceeded,
      placeholder = '',
      size,
      style = {},
      tagClassName = '',
      tagStyle = {},
      touched,
      ...otherProps
    },
    ref
  ) => {
    const componentId = useId()
    id = id || componentId

    const inputFieldId = useId()
    inputId = inputId || inputFieldId

    const tagsInputRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const isEditingRef = useRef(false)

    const [internalValue, setInternalValue] = useState<string>('')
    const [internalTags, setInternalTags] = useState<Tags>(() => {
      return []
    })

    const [highlightedTagIndex, setHighlightedTagIndex] = useState<number>()

    // Pressing Enter or double-clicking on the tag will put it in edit mode, allowing
    // the user change its value and press Enter to commit the changes.
    const [editableTagIndex, setEditableTagIndex] = useState<number>()

    useOutsideClick(tagsInputRef, () => {
      setHighlightedTagIndex(undefined)
      setEditableTagIndex(undefined)
    })

    /* ======================
              api
    ====================== */

    if (typeof apiRef !== 'undefined') {
      apiRef.current = {
        clear: () => {
          setInternalTags([])
          setInternalValue('')
        }
      }
    }

    /* ======================
          handleKeyDown()
    ====================== */

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      const cursorPosition =
        typeof inputRef.current?.selectionStart === 'number'
          ? inputRef.current?.selectionStart
          : 0

      // If there is a highlightedTagIndex when user presses 'Enter'
      // Then toggle edit mode for that tag.
      if (event.key === 'Enter' && typeof highlightedTagIndex === 'number') {
        event.preventDefault() // Stop form submission

        if (typeof editableTagIndex !== 'number' && editable) {
          setEditableTagIndex(highlightedTagIndex)
          isEditingRef.current = true
        }

        return
      }

      if (event.key === 'Enter' && internalValue.trim()) {
        event.preventDefault() // Stop form submission

        if (
          typeof max === 'number' &&
          Array.isArray(internalTags) &&
          internalTags.length >= max
        ) {
          setInternalValue('')
          onMaxExceeded?.(max)

          return
        }

        const newTag = internalValue.trim()

        if (internalTags.includes(newTag)) {
          setInternalValue('')
          return
        }

        setInternalTags([...internalTags, newTag])
        setInternalValue('')

        return
      }

      // Pressing Delete or Backspace will delete the tag that has visual focus.
      if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'U+007F'
      ) {
        if (
          cursorPosition === 0 &&
          typeof highlightedTagIndex === 'undefined' &&
          Array.isArray(internalTags) &&
          internalTags.length > 0
        ) {
          setHighlightedTagIndex(internalTags.length - 1)
          return
        }

        if (highlightedTagIndex === 0) {
          if (internalTags.length === 1) {
            setHighlightedTagIndex(undefined)
          }

          setInternalTags((prevTags) => {
            return prevTags.slice(1)
          })

          return
        }

        if (typeof highlightedTagIndex === 'number') {
          setInternalTags((prevTags) => {
            // Delete the tag in tags with the index corresponding to highlightedTagIndex.
            return prevTags.filter((_, index) => index !== highlightedTagIndex)
          })

          setHighlightedTagIndex((prevIndex) => {
            if (typeof prevIndex === 'number' && prevIndex > 0) {
              return prevIndex - 1
            }
            return prevIndex
          })
        }
      }

      // Write code here that gets the inputRef.current cursor position.
      // Add a condition to the if statement that the cursor position must
      // also be at 0.

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // Suppose the cursor is in the middle of the input value.
        // If there's not already a highligtedTag, then return.
        // If there is already a highlightedTag, then continue.
        if (
          cursorPosition !== 0 &&
          typeof highlightedTagIndex === 'undefined'
        ) {
          return
        }

        if (event.key === 'ArrowLeft') {
          setHighlightedTagIndex((prevIndex) => {
            if (typeof prevIndex === 'undefined') {
              return internalTags.length - 1
            }

            if (prevIndex > 0) {
              return prevIndex - 1
            }

            return prevIndex
          })

          return
        }

        if (
          cursorPosition !== 0 &&
          typeof highlightedTagIndex !== 'undefined'
        ) {
          event.preventDefault()
          setHighlightedTagIndex(undefined)
        }

        if (event.key === 'ArrowRight' && cursorPosition === 0) {
          // Prevent input cursor movement while there is a highlighted tag.
          if (typeof highlightedTagIndex === 'number') {
            event.preventDefault()
          }

          setHighlightedTagIndex((prevIndex) => {
            if (
              typeof prevIndex === 'number' &&
              prevIndex < internalTags.length - 1
            ) {
              return prevIndex + 1
            }
            return undefined
          })
        }
      }

      if (event.key === 'Escape') {
        setHighlightedTagIndex(undefined)
      }
    }

    /* ======================
          getClassName()
    ====================== */
    //# Add in tailwind-merge or move all styling to formPlugin.ts

    const getClassName = () => {
      let classes = `flex flex-wrap items-center form-control gap-2`

      if (error) {
        classes = `${classes} is-invalid focus-within-invalid`
      } else if (!error && touched) {
        classes = `
        ${classes} is-valid focus-within-valid`
      } else {
        classes = `${classes} focus-within`
      }

      if (size === 'sm') {
        classes = `${classes} form-control-sm`
      } else if (size === 'lg') {
        classes = `${classes} form-control-lg`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
      useLayoutEffect()
    ====================== */
    // initialValue is set in useLayoutEffect to allow for
    // the possibility of an asynchronous initialValue

    useLayoutEffect(() => {
      if (initialValue && isStringArray(initialValue)) {
        if (typeof max === 'number' && initialValue.length > max) {
          setInternalTags(initialValue.slice(0, max))
        } else {
          setInternalTags(initialValue)
        }
      }
    }, [initialValue, max])

    /* ======================
        useEffect()
  ====================== */

    useEffect(() => {
      onChange?.(internalTags)
      // eslint-disable-next-line
    }, [internalTags])

    /* ======================
          renderLabel()
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
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
                  color: disabled ? 'inherit' : 'red' // ???
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
        renderTags()
  ====================== */

    const renderTags = () => {
      return internalTags.map((tag, index) => (
        <Tag
          disabled={disabled}
          shouldEdit={editableTagIndex === index}
          key={index} // ???
          onDelete={(tagName: string) => {
            if (disabled) {
              return
            }
            setHighlightedTagIndex(undefined)
            setInternalTags(internalTags.filter((tag) => tag !== tagName))
            inputRef.current?.focus()
          }}
          shouldHighlight={highlightedTagIndex === index}
          onClick={() => {
            if (disabled) {
              return
            }
            setHighlightedTagIndex(index)
          }}
          onEnter={(newValue: string) => {
            if (disabled) {
              return
            }
            if (newValue.trim()) {
              const newTags = internalTags.map((t, i) =>
                i === index ? newValue : t
              )
              setInternalTags(newTags)
            }

            setEditableTagIndex(undefined)
            isEditingRef.current = false
            inputRef.current?.focus()
          }}
          onDoubleClick={() => {
            if (disabled || !editable) {
              return
            }
            setHighlightedTagIndex(index)
            setEditableTagIndex(index)
            isEditingRef.current = true
          }}
          onEscape={() => {
            if (disabled) {
              return
            }
            setEditableTagIndex(undefined)
            isEditingRef.current = false
            inputRef.current?.focus()
          }}
          onOutsideClick={() => {
            if (disabled) {
              return
            }
            setEditableTagIndex(undefined)
            isEditingRef.current = false
          }}
          tag={tag}
          tagClassName={
            !disabled
              ? `cursor-pointer${tagClassName ? ` ${tagClassName}` : ''}`
              : tagClassName
          }
          tagStyle={tagStyle}
        />
      ))
    }

    /* ======================
        renderInput()
  ====================== */

    const renderInput = () => {
      return (
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          spellCheck={false}
          {...otherProps}
          disabled={disabled}
          id={inputId}
          className='flex-1 border-none bg-transparent outline-none'
          name={name}
          onBlur={(e) => {
            if (disabled) {
              return
            }
            onBlur?.(e)
          }}
          onChange={(e) => {
            if (disabled) {
              return
            }
            setHighlightedTagIndex(undefined)
            setInternalValue(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Disabled...' : placeholder}
          ref={(node) => {
            // We can't know in advance whether ref will be a function or an object literal.
            // For that reason, we need to use the following conditional logic.
            // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library

            if (ref && 'current' in ref) {
              ref.current = node
            } else if (typeof ref === 'function') {
              ref?.(node)
            }

            inputRef.current = node
          }}
          type='text'
          value={internalValue}
        />
      )
    }

    /* ======================
          return
  ====================== */

    return (
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}

        <div // eslint-disable-line
          id={id}
          className={getClassName()}
          onClick={() => {
            if (isEditingRef.current === true) {
              return
            }

            // Whenever anything inside this div is clicked, it will
            // focus on inputRef.current, except when editing a tag.
            inputRef.current?.focus()
          }}
          ref={tagsInputRef}
          style={style}
          // This makes the div focusable, but not tabbable.
          // The benefit here is that clicking on an empty part of the <div>
          // will not cause focus to go to <body> prior to being programmatically
          // set on inputRef.current
          tabIndex={disabled ? undefined : -1}
        >
          {renderTags()}
          {renderInput()}
        </div>

        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)
