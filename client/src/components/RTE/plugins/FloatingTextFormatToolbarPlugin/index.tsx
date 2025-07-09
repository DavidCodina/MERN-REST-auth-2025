import './index.css'

import { $isCodeHighlightNode } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { Dispatch, useCallback, useEffect, useRef, useState, JSX } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { getDOMRangeRect } from '../../utils/getDOMRangeRect'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { setFloatingElemPosition } from '../../utils/setFloatingElemPosition'

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setIsLinkEditMode
}: {
  editor: LexicalEditor
  anchorElem: HTMLElement
  isBold: boolean
  isCode: boolean
  isItalic: boolean
  isLink: boolean
  isStrikethrough: boolean
  isSubscript: boolean
  isSuperscript: boolean
  isUnderline: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null)

  /* ======================
        insertLink()
  ====================== */

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      setIsLinkEditMode(false)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink, setIsLinkEditMode])

  /* ======================

  ====================== */

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX
        const y = e.clientY
        const elementUnderMouse = document.elementFromPoint(x, y)

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none'
        }
      }
    }
  }

  /* ======================

  ====================== */

  function mouseUpListener(_e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto'
      }
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener)
      document.addEventListener('mouseup', mouseUpListener)

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener)
        document.removeEventListener('mouseup', mouseUpListener)
      }
    }
  }, [popupCharStylesEditorRef])

  /* ======================
  updateTextFormatFloatingToolbar()
  ====================== */

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection()

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current
    const nativeSelection = window.getSelection()

    if (popupCharStylesEditorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement)

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink
      )
    }
  }, [editor, anchorElem, isLink])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar()
      })
    }

    window.addEventListener('resize', update)
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar()
    })
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, $updateTextFormatFloatingToolbar])

  /* ======================
          return
  ====================== */

  return (
    <div
      ref={popupCharStylesEditorRef}
      className='rte-floating-text-format-popup'
    >
      {editor.isEditable() && (
        <>
          <button
            aria-label='Format text as bold'
            className={'rte-popup-item ' + (isBold ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
            }}
            type='button'
          >
            <i className='format rte-icon-bold' />
          </button>

          <button
            aria-label='Format text as italics'
            className={'rte-popup-item ' + (isItalic ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }}
            type='button'
          >
            <i className='format rte-icon-italic' />
          </button>

          <button
            aria-label='Format text to underlined'
            className={'rte-popup-item ' + (isUnderline ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
            }}
            type='button'
          >
            <i className='format rte-icon-underline' />
          </button>

          <button
            aria-label='Format text with a strikethrough'
            className={'rte-popup-item ' + (isStrikethrough ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
            }}
            type='button'
          >
            <i className='format rte-icon-strikethrough' />
          </button>

          <button
            aria-label='Format Subscript'
            className={'rte-popup-item ' + (isSubscript ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
            }}
            title='Subscript'
            type='button'
          >
            <i className='format rte-icon-subscript' />
          </button>

          <button
            aria-label='Format Superscript'
            className={'rte-popup-item ' + (isSuperscript ? 'active' : '')}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
            }}
            title='Superscript'
            type='button'
          >
            <i className='format rte-icon-superscript' />
          </button>

          <button
            aria-label='Insert code block'
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
            }}
            className={'rte-popup-item ' + (isCode ? 'active' : '')}
            type='button'
          >
            <i className='format rte-icon-code' />
          </button>

          <button
            aria-label='Insert link'
            className={'rte-popup-item ' + (isLink ? 'active' : '')}
            onClick={insertLink}
            type='button'
          >
            <i className='format rte-icon-link' />
          </button>
        </>
      )}
    </div>
  )
}

/* ========================================================================
                          useFloatingTextFormatToolbar
======================================================================== */

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>
): JSX.Element | null {
  /* ======================
      state & refs
  ====================== */

  const [isText, setIsText] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)
  const [isCode, setIsCode] = useState(false)

  /* ======================
        updatePopup()
  ====================== */

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return
      }
      const selection = $getSelection()
      const nativeSelection = window.getSelection()
      const rootElement = editor.getRootElement()

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false)
        return
      }

      if (!$isRangeSelection(selection)) {
        return
      }

      const node = getSelectedNode(selection)

      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsCode(selection.hasFormat('code'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsSubscript(selection.hasFormat('subscript'))
      setIsSuperscript(selection.hasFormat('superscript'))

      // Update links
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node))
      } else {
        setIsText(false)
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '')
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false)
        return
      }
    })
  }, [editor])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup)
    return () => {
      document.removeEventListener('selectionchange', updatePopup)
    }
  }, [updatePopup])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup()
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false)
        }
      })
    )
  }, [editor, updatePopup])

  /* ======================
          return
  ====================== */

  if (!isText) {
    return null
  }

  return createPortal(
    <TextFormatFloatingToolbar
      anchorElem={anchorElem}
      editor={editor}
      isBold={isBold}
      isCode={isCode}
      isItalic={isItalic}
      isLink={isLink}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  )
}

/* ========================================================================
                              FloatingTextFormatToolbarPlugin
======================================================================== */
// This plugin creates a floating menu for basic formatting features when the user
// selects (i.e., highlights) a portion of text.

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode
}: {
  anchorElem?: HTMLElement
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode)
}
