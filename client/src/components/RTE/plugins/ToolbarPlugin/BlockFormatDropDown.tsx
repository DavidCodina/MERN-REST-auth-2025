// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import { JSX } from 'react'
import { $createCodeNode } from '@lexical/code'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list'

import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType
} from '@lexical/rich-text'

import { $setBlocksType } from '@lexical/selection'

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor
} from 'lexical'

import { blockTypeToBlockName } from './blockTypeToBlockName'
import DropDown, { DropDownItem } from './Dropdown'

// eslint-disable-next-line
const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
}

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                              BlockFormatDropDown       
======================================================================== */
// BlockFormatDropDown is built on top of DropDown and DropDownItem.

export const BlockFormatDropDown = ({
  editor,
  blockType,
  // rootType, // Not being used.
  disabled = false
}: {
  blockType: keyof typeof blockTypeToBlockName
  rootType: keyof typeof rootTypeToRootName
  editor: LexicalEditor
  disabled?: boolean
}): JSX.Element => {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createQuoteNode())
      })
    }
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection()

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            selection = $getSelection()
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent)
            }
          }
        }
      })
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={disabled}
      buttonClassName='rte-toolbar-item'
      // blockType: 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'bullet', 'check', 'number', 'quote', 'code', etc.
      buttonIconClassName={`rte-icon-${blockType}`}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel='Block type formatting options'
      title='Block type formatting options'
    >
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}
      >
        <i className='rte-icon-paragraph' />

        <span className='rte-text'>Normal</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading('h1')}
      >
        <i className='rte-icon-h1' />
        <span className='rte-text'>Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading('h2')}
      >
        <i className='rte-icon-h2' />
        <span className='rte-text'>Heading 2</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading('h3')}
      >
        <i className='rte-icon-h3' />
        <span className='rte-text'>Heading 3</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h4')}
        onClick={() => formatHeading('h4')}
      >
        <i className='rte-icon-h4' />
        <span className='rte-text'>Heading 4</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h5')}
        onClick={() => formatHeading('h5')}
      >
        <i className='rte-icon-h5' />
        <span className='rte-text'>Heading 5</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h6')}
        onClick={() => formatHeading('h6')}
      >
        <i className='rte-icon-h6' />
        <span className='rte-text'>Heading 6</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={formatBulletList}
      >
        <i className='rte-icon-bullet' />
        <span className='rte-text'>Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'number')}
        onClick={formatNumberedList}
      >
        <i className='rte-icon-number' />
        <span className='rte-text'>Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'check')}
        onClick={formatCheckList}
      >
        <i className='rte-icon-check' />
        <span className='rte-text'>Check List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}
      >
        <i className='rte-icon-quote' />
        <span className='rte-text'>Quote</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}
      >
        <i className='rte-icon-code' />
        <span className='rte-text'>Code Block</span>
      </DropDownItem>
    </DropDown>
  )
}
