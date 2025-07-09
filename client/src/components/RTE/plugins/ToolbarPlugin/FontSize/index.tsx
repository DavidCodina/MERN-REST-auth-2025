import './fontSize.css'

import { $patchStyleText } from '@lexical/selection'
import { $getSelection, LexicalEditor } from 'lexical'
import * as React from 'react'

const MIN_ALLOWED_FONT_SIZE = 8
const MAX_ALLOWED_FONT_SIZE = 72

// Changed from 15. However, the ToolbarPlugin will also set the font size within
// $updateToolbar(), which has precedence over this.
const DEFAULT_FONT_SIZE = 16

enum updateFontSizeType {
  increment = 1,
  decrement
}

/* ========================================================================
                            FontSize()                
======================================================================== */

export default function FontSize({
  selectionFontSize,
  disabled,
  editor
}: {
  selectionFontSize: string
  disabled: boolean
  editor: LexicalEditor
}) {
  const [inputValue, setInputValue] = React.useState<string>(selectionFontSize)
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false)

  /* ======================
   calculateNextFontSize()
  ====================== */
  /**
   * Calculates the new font size based on the update type.
   * @param currentFontSize - The current font size
   * @param updateType - The type of change, either increment or decrement
   * @returns the next font size
   */

  const calculateNextFontSize = (
    currentFontSize: number,
    updateType: updateFontSizeType | null
  ) => {
    if (!updateType) {
      return currentFontSize
    }

    let updatedFontSize: number = currentFontSize
    switch (updateType) {
      case updateFontSizeType.decrement:
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE
            break

          ///////////////////////////////////////////////////////////////////////////
          //
          // This part was in the playground version. It's unusual to have a bunch of weird
          // rules like this for incrementing.
          //
          // case currentFontSize >= 48:
          //   updatedFontSize -= 12
          //   break
          // case currentFontSize >= 24:
          //   updatedFontSize -= 4
          //   break
          // case currentFontSize >= 14:
          //   updatedFontSize -= 2
          //   break
          // case currentFontSize >= 9:
          //   updatedFontSize -= 1
          //   break
          //
          // I replaced it with the case that immediately follows.
          //
          ///////////////////////////////////////////////////////////////////////////

          case currentFontSize > MIN_ALLOWED_FONT_SIZE - 1:
            updatedFontSize -= 1
            break

          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE
            break
        }
        break

      case updateFontSizeType.increment:
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE
            break

          ///////////////////////////////////////////////////////////////////////////
          //
          // This part was in the playground version. It's unusual to have a bunch of weird
          // rules like this for incrementing.
          //
          // case currentFontSize < 12:
          //   updatedFontSize += 1
          //   break
          // case currentFontSize < 20:
          //   updatedFontSize += 2
          //   break
          // case currentFontSize < 36:
          //   updatedFontSize += 4
          //   break
          // case currentFontSize <= 60:
          //   updatedFontSize += 12
          //   break
          //
          // I replaced it with the case that immediately follows.
          //
          ///////////////////////////////////////////////////////////////////////////
          case currentFontSize < MAX_ALLOWED_FONT_SIZE + 1:
            updatedFontSize += 1
            break

          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE
            break
        }
        break

      default:
        break
    }
    return updatedFontSize
  }
  /** Patches the selection with the updated font size. */

  /* ======================
  updateFontSizeInSelection()
  ====================== */

  const updateFontSizeInSelection = React.useCallback(
    (newFontSize: string | null, updateType: updateFontSizeType | null) => {
      const getNextFontSize = (prevFontSize: string | null): string => {
        if (!prevFontSize) {
          prevFontSize = `${DEFAULT_FONT_SIZE}px`
        }
        prevFontSize = prevFontSize.slice(0, -2)
        const nextFontSize = calculateNextFontSize(
          Number(prevFontSize),
          updateType
        )
        return `${nextFontSize}px`
      }

      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection()
          if (selection !== null) {
            $patchStyleText(selection, {
              'font-size': newFontSize || getNextFontSize
            })
          }
        }
      })
    },
    [editor]
  )

  /* ======================
      handleKeyPress()
  ====================== */

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue)

    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault()
      setInputValue('')
      return
    }

    setInputChangeFlag(true)
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault()
      updateFontSizeByInputValue(inputValueNumber)
    }
  }

  /* ======================
      handleInputBlur()
  ====================== */

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue)
      updateFontSizeByInputValue(inputValueNumber)
    }
  }

  /* ======================
      handleButtonClick()
  ====================== */

  const handleButtonClick = (updateType: updateFontSizeType) => {
    if (inputValue !== '') {
      const nextFontSize = calculateNextFontSize(Number(inputValue), updateType)
      updateFontSizeInSelection(String(nextFontSize) + 'px', null)
    } else {
      updateFontSizeInSelection(null, updateType)
    }
  }

  /* ======================
  updateFontSizeByInputValue()
  ====================== */

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE
    }

    setInputValue(String(updatedFontSize))
    updateFontSizeInSelection(String(updatedFontSize) + 'px', null)
    setInputChangeFlag(false)
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    setInputValue(selectionFontSize)
  }, [selectionFontSize])

  /* ======================
          return
  ====================== */

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <button
        className='rte-toolbar-item rte-font-decrement'
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)
        }
        onClick={() => handleButtonClick(updateFontSizeType.decrement)}
        title='Decrease font size'
        type='button'
      >
        <i className='format rte-icon-minus' />
      </button>

      <input
        className='rte-font-size-input'
        disabled={disabled}
        max={MAX_ALLOWED_FONT_SIZE}
        min={MIN_ALLOWED_FONT_SIZE}
        onBlur={handleInputBlur}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        type='number'
        value={inputValue}
      />

      <button
        className='rte-toolbar-item rte-font-increment'
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)
        }
        onClick={() => handleButtonClick(updateFontSizeType.increment)}
        title='Increase font size'
        type='button'
      >
        <i className='format rte-icon-add' />
      </button>
    </div>
  )
}
