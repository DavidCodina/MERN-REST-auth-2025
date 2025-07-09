import { JSX } from 'react'
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical'
import DropDown, { DropDownItem } from './Dropdown'

type AdditionalFormatDropDownProps = {
  activeEditor: LexicalEditor
  clearFormatting: () => void
  isEditable: boolean
  isStrikethrough: boolean
  isSubscript: boolean
  isSuperscript: boolean
}

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                            AdditionalFormatDropDown       
======================================================================== */

export const AdditionalFormatDropDown = ({
  activeEditor,
  clearFormatting,
  isEditable,
  isStrikethrough,
  isSubscript,
  isSuperscript
}: AdditionalFormatDropDownProps): JSX.Element => {
  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={!isEditable}
      buttonClassName='rte-toolbar-item'
      buttonLabel=''
      buttonAriaLabel='Additional formatting options'
      buttonIconClassName='rte-icon-dropdown-more'
      title='Additional formatting options'
    >
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
        className={'rte-item ' + dropDownActiveClass(isStrikethrough)}
        title='Strikethrough'
        aria-label='Format text with a strikethrough'
      >
        <i className='rte-icon-strikethrough' />
        <span className='rte-text'>Strikethrough</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
        }}
        className={'rte-item ' + dropDownActiveClass(isSubscript)}
        title='Subscript'
        aria-label='Format text with a subscript'
      >
        <i className='rte-icon-subscript' />
        <span className='rte-text'>Subscript</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
        }}
        className={'rte-item ' + dropDownActiveClass(isSuperscript)}
        title='Superscript'
        aria-label='Format text with a superscript'
      >
        <i className='rte-icon-superscript' />
        <span className='rte-text'>Superscript</span>
      </DropDownItem>
      <DropDownItem
        onClick={clearFormatting}
        className='rte-item'
        title='Clear text formatting'
        aria-label='Clear all text formatting'
      >
        <i className='rte-icon-clear' />
        <span className='rte-text'>Clear Formatting</span>
      </DropDownItem>
    </DropDown>
  )
}
