import './Dropdown.css'

import * as React from 'react'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  JSX
} from 'react'
import { createPortal } from 'react-dom'

import { DropDownContext } from './DropDownContext'
export { DropDownItem } from './DropDownItem'

type DropDownType = {
  disabled?: boolean
  buttonAriaLabel?: string
  buttonClassName: string
  buttonIconClassName?: string
  buttonLabel?: string
  children: ReactNode
  stopCloseOnClickSelf?: boolean
  title?: string
}

type DropDownMenuType = {
  children: React.ReactNode
  dropDownRef: React.Ref<HTMLDivElement>
  onClose: () => void
}

const dropDownPadding = 4

/* ========================================================================
                              DropDownMenu                    
======================================================================== */

const DropDownMenu = ({ children, dropDownRef, onClose }: DropDownMenuType) => {
  const [items, setItems] = useState<React.RefObject<HTMLButtonElement>[]>()
  const [highlightedItem, setHighlightedItem] =
    useState<React.RefObject<HTMLButtonElement>>()

  const registerItem = useCallback(
    (itemRef: React.RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]))
    },
    [setItems]
  )

  const contextValue = useMemo(
    () => ({
      registerItem
    }),
    [registerItem]
  )

  /* ======================
        handleKeyDown()
  ====================== */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!items) return

    const key = event.key

    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
      event.preventDefault()
    }

    if (key === 'Escape' || key === 'Tab') {
      onClose()
    } else if (key === 'ArrowUp') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0]
        }
        const index = items.indexOf(prev) - 1
        return items[index === -1 ? items.length - 1 : index]
      })
    } else if (key === 'ArrowDown') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0]
        }

        return items[items.indexOf(prev) + 1]
      })
    }
  }

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    if (items && !highlightedItem) {
      setHighlightedItem(items[0])
    }

    if (highlightedItem && highlightedItem.current) {
      highlightedItem.current.focus()
    }
  }, [items, highlightedItem])

  /* ======================
          return
  ====================== */

  return (
    <DropDownContext.Provider value={contextValue}>
      <div // eslint-disable-line
        className='rte-dropdown'
        ref={dropDownRef}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </DropDownContext.Provider>
  )
}

/* ========================================================================
                                DropDown      
======================================================================== */

export default function DropDown({
  disabled = false,
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  children,
  stopCloseOnClickSelf,
  title
}: DropDownType): JSX.Element {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showDropDown, setShowDropDown] = useState(false)

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    const button = buttonRef.current
    const dropDown = dropDownRef.current

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect()
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`
      dropDown.style.left = `${Math.min(
        left,
        window.innerWidth - dropDown.offsetWidth - 20
      )}px`
    }
  }, [dropDownRef, buttonRef, showDropDown])

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    const button = buttonRef.current

    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target
        if (stopCloseOnClickSelf) {
          if (
            dropDownRef.current &&
            dropDownRef.current.contains(target as Node)
          )
            return
        }
        if (!button.contains(target as Node)) {
          setShowDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }
  }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf])

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    const handleButtonPositionUpdate = () => {
      if (showDropDown) {
        const button = buttonRef.current
        const dropDown = dropDownRef.current
        if (button !== null && dropDown !== null) {
          const { top } = button.getBoundingClientRect()
          const newPosition = top + button.offsetHeight + dropDownPadding
          if (newPosition !== dropDown.getBoundingClientRect().top) {
            dropDown.style.top = `${newPosition}px`
          }
        }
      }
    }

    document.addEventListener('scroll', handleButtonPositionUpdate)

    return () => {
      document.removeEventListener('scroll', handleButtonPositionUpdate)
    }
  }, [buttonRef, dropDownRef, showDropDown])

  /* ======================
          return
  ====================== */

  return (
    <>
      <button
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        disabled={disabled}
        onClick={() => setShowDropDown(!showDropDown)}
        ref={buttonRef}
        type='button'
        title={title}
      >
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && (
          <span className='rte-text rte-dropdown-button-text'>
            {buttonLabel}
          </span>
        )}

        <i className='rte-icon-chevron-down' />
      </button>

      {showDropDown &&
        createPortal(
          <DropDownMenu
            dropDownRef={dropDownRef}
            onClose={() => {
              setShowDropDown(false)
              if (buttonRef && buttonRef.current) {
                buttonRef.current.focus()
              }
            }}
          >
            {children}
          </DropDownMenu>,
          document.body
        )}
    </>
  )
}
