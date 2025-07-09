// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import { useCallback, JSX } from 'react'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, LexicalEditor } from 'lexical'
import DropDown, { DropDownItem } from './Dropdown'

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['12px', '12px'],
  ['14px', '14px'],
  ['16px', '16px'],
  ['18px', '18px'],
  ['20px', '20px']
]

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                              FontSizeDropDown      
======================================================================== */

export const FontSizeDropDown = ({
  disabled = false,
  editor,
  title,
  value
}: {
  disabled?: boolean
  editor: LexicalEditor
  title?: string
  value: string
}): JSX.Element => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, {
            'font-size': option
          })
        }
      })
    },
    [editor]
  )

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'rte-toolbar-item'}
      buttonLabel={value}
      buttonIconClassName=''
      buttonAriaLabel={'Font size formatting options'}
      title={title}
    >
      {FONT_SIZE_OPTIONS.map(([option, text]) => (
        <DropDownItem
          // The .rte-fontsize-item in Dropdown.css unsets the min-width.
          className={`rte-item ${dropDownActiveClass(value === option)} rte-fontsize-item`}
          onClick={() => handleClick(option)}
          key={option}
        >
          <span className='rte-text'>{text}</span>
        </DropDownItem>
      ))}
    </DropDown>
  )
}
