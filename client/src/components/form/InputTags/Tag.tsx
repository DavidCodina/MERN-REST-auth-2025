import {
  CSSProperties,
  useState,
  useLayoutEffect,
  useEffect,
  useRef
} from 'react'
import { useOutsideClick } from './useOutsideClick'

type Props = {
  disabled: boolean
  onClick: () => void
  onDelete: (tagToDelete: string) => void
  onDoubleClick: () => void
  onEnter: (newValue: string) => void
  onEscape: () => void
  onOutsideClick: () => void
  shouldEdit: boolean
  shouldHighlight: boolean
  tag: string
  tagClassName: string | undefined
  tagStyle: CSSProperties | undefined
}

/* ========================================================================
                                Tag
======================================================================== */

export const Tag = ({
  disabled,
  onClick,
  onDelete,
  onDoubleClick,
  onEnter,
  onEscape,
  onOutsideClick,
  shouldEdit = false,
  shouldHighlight = false,
  tag,
  tagClassName = '',
  tagStyle = {}
}: Props) => {
  const hiddenSpanRef = useRef<HTMLSpanElement | null>(null)
  const [hiddenSpanWidth, setHiddenSpanWidth] = useState<number>()

  const tagInputRef = useRef<HTMLInputElement | null>(null)
  const [tagInputValue, setTagInputValue] = useState<string>(tag)

  useOutsideClick(tagInputRef, onOutsideClick)

  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    let classes = `flex items-center rounded-full select-none text-xs pl-2 leading-none border border-neutral-400`

    if (!disabled) {
      classes = `${classes} data-[highlighted]:outline data-[highlighted]:outline-[1.5px] data-[highlighted]:outline-blue-400 outline-offset-[-1px]`
    }
    if (tagClassName) {
      classes = `${classes} ${tagClassName}`
    }
    return classes
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (disabled) {
      return
    }
    if (shouldEdit === true) {
      tagInputRef.current?.focus()
      setTagInputValue(tag)
    }
  }, [disabled, shouldEdit, tag])

  /* ======================
      useLayoutEffect()
  ====================== */
  // This effect sets spanWidth after render, but before paint.

  useLayoutEffect(() => {
    if (disabled || !shouldEdit || !hiddenSpanRef.current) {
      return
    }

    const hiddenSpanWidth = hiddenSpanRef.current.offsetWidth

    setHiddenSpanWidth(hiddenSpanWidth)
  }, [disabled, shouldEdit, tagInputValue])

  /* ======================
      renderTagOrInput()
  ====================== */

  const renderTagOrInput = () => {
    if (shouldEdit && !disabled) {
      return (
        <>
          <div aria-hidden='true' className='sr-only'>
            {/* Don't use a <div>. <span> allows the element to overflow its parent. */}
            <span
              className='border text-center text-xs leading-none'
              ref={hiddenSpanRef}
            >
              {tagInputValue}
            </span>
          </div>

          <input
            aria-label='Press enter to save or escape to cancel.'
            disabled={disabled}
            ref={tagInputRef}
            autoCapitalize='none'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            className='m-0 block rounded-full border border-neutral-300 bg-transparent text-center text-xs leading-none outline-none'
            style={{
              height: 20, // 'calc(1em + 6px)', // 4px vertical space + 1px for the border.
              minHeight: 0,
              minWidth: '80px',
              // This assumes that the <span>  has the same font-family,font-size, letter-spacing, and padding.
              width:
                typeof hiddenSpanWidth === 'number'
                  ? `${hiddenSpanWidth + 16}px`
                  : 80
            }}
            onChange={(e) => {
              if (disabled) {
                return
              }
              setTagInputValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (disabled) {
                return
              }
              if (e.key === 'Enter') {
                e.preventDefault() // Stop form submission
                onEnter(tagInputValue)
                return
              }

              if (e.key === 'Escape') {
                onEscape()
              }
            }}
            tabIndex={-1}
            type='text'
            value={tagInputValue}
          />
        </>
      )
    }

    return (
      <div // eslint-disable-line
        className={getClassName()}
        style={{
          height: 20, // 'calc(1em + 6px)', // 4px vertical space + 1px for the border.
          ...tagStyle
        }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        {...(shouldHighlight ? { 'data-highlighted': '' } : {})}
      >
        <div className=''>{tag}</div>

        <button
          aria-label={`Delete tag: ${tag}`}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation() // Stops propagation to the parent's onClick.
            onDelete(tag)
          }}
          style={{
            padding: '0.125em calc(0.125em + 2px) 0.125em 0.125em',
            margin: '-0.5em 0px -0.5em 4px'
          }}
          tabIndex={-1}
          title={`Delete tag: ${tag}`}
          type='button'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={'1.25em'}
            height={'1.25em'}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M18 6 6 18'></path>
            <path d='m6 6 12 12'></path>
          </svg>
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderTagOrInput()
}
