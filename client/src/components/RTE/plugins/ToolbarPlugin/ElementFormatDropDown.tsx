// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import {
  LexicalEditor,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND
} from 'lexical'

import DropDown, { DropDownItem } from './Dropdown'
import { Divider } from './Divider'

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string
    iconRTL: string
    name: string
  }
} = {
  center: {
    icon: 'rte-icon-center-align',
    iconRTL: 'rte-icon-center-align',
    name: 'Center Align'
  },
  end: {
    icon: 'rte-icon-right-align',
    iconRTL: 'rte-icon-left-align',
    name: 'End Align'
  },
  justify: {
    icon: 'rte-icon-justify-align',
    iconRTL: 'rte-icon-justify-align',
    name: 'Justify Align'
  },
  left: {
    icon: 'rte-icon-left-align',
    iconRTL: 'rte-icon-left-align',
    name: 'Left Align'
  },
  right: {
    icon: 'rte-icon-right-align',
    iconRTL: 'rte-icon-right-align',
    name: 'Right Align'
  },
  start: {
    icon: 'rte-icon-left-align',
    iconRTL: 'rte-icon-right-align',
    name: 'Start Align'
  }
}

/* ========================================================================
                            ElementFormatDropDown   
======================================================================== */
// This component is used for alignment, etc.

export const ElementFormatDropDown = ({
  editor,
  value,
  isRTL,
  disabled = false
}: {
  editor: LexicalEditor
  value: ElementFormatType
  isRTL: boolean
  disabled: boolean
}) => {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left']

  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={disabled}
      buttonLabel={formatOption.name}
      buttonIconClassName={`icon ${
        isRTL ? formatOption.iconRTL : formatOption.icon
      }`}
      buttonClassName='rte-toolbar-item alignment'
      buttonAriaLabel='Formatting options for text alignment'
      title='Alignment options'
    >
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        }}
        className='rte-item'
      >
        <i className='rte-icon-left-align' />
        <span className='rte-text'>Left Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        }}
        className='rte-item'
      >
        <i className='rte-icon-center-align' />
        <span className='rte-text'>Center Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        }}
        className='rte-item'
      >
        <i className='rte-icon-right-align' />
        <span className='rte-text'>Right Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        }}
        className='rte-item'
      >
        <i className='rte-icon-justify-align' />
        <span className='rte-text'>Justify Align</span>
      </DropDownItem>

      {/* <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start')
        }}
        className='rte-item'
      >
        <i
          className={`icon ${
            isRTL
              ? ELEMENT_FORMAT_OPTIONS.start.iconRTL
              : ELEMENT_FORMAT_OPTIONS.start.icon
          }`}
        />
        <span className='rte-text'>Start Align</span>
      </DropDownItem> */}

      {/* <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end')
        }}
        className='rte-item'
      >
        <i
          className={`icon ${
            isRTL
              ? ELEMENT_FORMAT_OPTIONS.end.iconRTL
              : ELEMENT_FORMAT_OPTIONS.end.icon
          }`}
        />
        <span className='rte-text'>End Align</span>
      </DropDownItem> */}

      <Divider />

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        }}
        className='rte-item'
      >
        <i className={isRTL ? 'rte-icon-indent' : 'rte-icon-outdent'} />
        <span className='rte-text'>Outdent</span>
      </DropDownItem>

      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
        }}
        className='rte-item'
      >
        <i className={isRTL ? 'rte-icon-outdent' : 'rte-icon-indent'} />
        <span className='rte-text'>Indent</span>
      </DropDownItem>
    </DropDown>
  )
}
