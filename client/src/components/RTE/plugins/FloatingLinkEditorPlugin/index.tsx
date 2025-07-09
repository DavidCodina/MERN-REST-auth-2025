import './index.css'

import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { getSelectedNode } from '../../utils/getSelectedNode'
import { setFloatingElemPositionForLinkEditor } from '../../utils/setFloatingElemPositionForLinkEditor'
import { sanitizeUrl } from '../../utils/url'

/* ========================================================================

======================================================================== */

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode
}: {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: Dispatch<boolean>
  anchorElem: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  /* ======================
      $updateLinkEditor()
  ====================== */

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      if (linkParent) {
        setLinkUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }

      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        domRect.y += 40
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem)
      }
      setLastSelection(selection)

      //^ We're looking for the specifc class specified below.
    } else if (
      !activeElement ||
      activeElement.className !==
        'rte-form-control rte-form-control-sm rte-link-input'
    ) {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem)
      }
      setLastSelection(null)
      setIsLinkEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor()
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
  }, [anchorElem.parentElement, editor, $updateLinkEditor])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, $updateLinkEditor, setIsLink, isLink])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLinkEditMode, isLink])

  /* ======================
  monitorInputInteraction()
  ====================== */

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLinkSubmission()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  /* ======================
  handleLinkSubmission()
  ====================== */

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl))

        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent()
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title
              })
              parent.replace(linkNode, true)
            }
          }
        })
      }
      setEditedLinkUrl('https://')
      setIsLinkEditMode(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <div ref={editorRef} className='rte-link-editor'>
      {!isLink ? null : isLinkEditMode ? (
        <>
          <input
            autoComplete='off'
            //^ The className specified here is used above in logic that looks for
            //^ the specific input by className.
            className='rte-form-control rte-form-control-sm rte-link-input'
            onChange={(event) => {
              setEditedLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event)
            }}
            ref={inputRef}
            spellCheck={false}
            value={editedLinkUrl}
          />

          <div>
            <div // eslint-disable-line
              className='rte-link-cancel rte-icon-close'
              onClick={() => {
                setIsLinkEditMode(false)
              }}
              onMouseDown={(event) => event.preventDefault()}
              role='button'
              tabIndex={0}
            />

            <div // eslint-disable-line
              className='rte-link-confirm rte-icon-success-alt'
              onClick={handleLinkSubmission}
              onMouseDown={(event) => event.preventDefault()}
              role='button'
              tabIndex={0}
            />
          </div>
        </>
      ) : (
        <div className='rte-link-view'>
          <a
            href={sanitizeUrl(linkUrl)}
            rel='noopener noreferrer'
            target='_blank'
          >
            {linkUrl}
          </a>
          <div // eslint-disable-line
            className='rte-link-edit rte-icon-pencil-fill'
            onClick={() => {
              setEditedLinkUrl(linkUrl)
              setIsLinkEditMode(true)
            }}
            onMouseDown={(event) => event.preventDefault()}
            role='button'
            tabIndex={0}
          />
          <div // eslint-disable-line
            className='rte-link-trash rte-icon-clear'
            onClick={() => {
              ///////////////////////////////////////////////////////////////////////////
              //
              // Gotcha: this handler was getting called but sometimes didn't work.
              // In particular, it didn't work when in conjunction with the AutoLinkPlugin
              // feature such that after dropping a URL in the editor, the trash feature
              // wouldn't do anything.
              //
              // It turns out that the order of rendered components matters:
              //
              //   <AutoLinkPlugin /> // <-- Must come first in order
              //   <LinkPlugin />     // <-- Must come second in order.
              //
              ///////////////////////////////////////////////////////////////////////////
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }}
            onMouseDown={(event) => event.preventDefault()}
            role='button'
            tabIndex={0}
          />
        </div>
      )}
    </div>
  )
}

/* ========================================================================

======================================================================== */

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>
): React.JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection()

      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)

        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)

        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        )

        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false)
          return
        }

        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode)
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            )
          })
        if (!badNode) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar()
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  /* ======================
          return
  ====================== */

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  )
}

/* ========================================================================

======================================================================== */

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
  isLinkEditMode,
  setIsLinkEditMode
}: {
  anchorElem?: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode
  )
}
