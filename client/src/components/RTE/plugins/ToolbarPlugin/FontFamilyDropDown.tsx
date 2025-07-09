// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import * as React from 'react'
import { useCallback } from 'react'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, LexicalEditor } from 'lexical'
import DropDown, { DropDownItem } from './Dropdown'

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana']
]

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                              FontFamilyDropDown      
======================================================================== */

export const FontFamilyDropDown = ({
  disabled = false,
  editor,
  title,
  value
}: {
  disabled?: boolean
  editor: LexicalEditor
  title?: string
  value: string
}): React.JSX.Element => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          ///////////////////////////////////////////////////////////////////////////
          //
          // If a selection exists, $patchStyleText is called to apply the selected font family to
          // the text within the selection.
          //
          // $patchStyleText: This function applies a style to the selected text. The style is specified as an
          //                  object  where the key is the CSS property and the value is the desired style.
          //
          // option:          This is the selected font family (e.g., ‘Arial’, ‘Courier New’, etc.).
          //
          ///////////////////////////////////////////////////////////////////////////
          $patchStyleText(selection, {
            'font-family': option
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
      buttonIconClassName={'rte-icon-font-family'}
      buttonAriaLabel={'Font family formatting options'}
      title={title}
    >
      {FONT_FAMILY_OPTIONS.map(([option, text]) => (
        <DropDownItem
          className={`rte-item ${dropDownActiveClass(value === option)}`}
          onClick={() => handleClick(option)}
          key={option}
        >
          <span className='rte-text'>{text}</span>
        </DropDownItem>
      ))}
    </DropDown>
  )
}
