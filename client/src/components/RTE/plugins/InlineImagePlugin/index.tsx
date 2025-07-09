import type { Position } from '../../nodes/InlineImageNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor
} from 'lexical'
import * as React from 'react'
import { useEffect, useRef, useState, JSX } from 'react'

import {
  $createInlineImageNode,
  $isInlineImageNode,
  InlineImageNode,
  InlineImagePayload
} from '../../nodes/InlineImageNode'

export type InsertInlineImagePayload = Readonly<InlineImagePayload>

//^ Probably need to check window for Next.js.
export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

/* ========================================================================
                         
======================================================================== */
//^ Probably need to check window for Next.js.

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null

/* ========================================================================
                         
======================================================================== */

export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> =
  createCommand('INSERT_INLINE_IMAGE_COMMAND')

/* ========================================================================
                         
======================================================================== */

export function InsertImageUriDialogBody({
  onClick
}: {
  onClick: (payload: InsertInlineImagePayload) => void
}) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('')
  const [position, setPosition] = useState<Position>('left')

  const isDisabled = src === ''

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Image URL
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onChange={(e) => {
            setSrc(e.target.value)
          }}
          placeholder='i.e. https://picsum.photos/400/200'
          spellCheck={false}
          type='text'
          value={src}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Alt Text
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onChange={(e) => {
            setAltText(e.target.value)
          }}
          placeholder='Descriptive alternative text'
          spellCheck={false}
          type='text'
          value={altText}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Width
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onKeyDown={(e) => {
            if (['e', 'E', '-', '+', '.'].includes(e.key)) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
          }}
          onChange={(e) => {
            setWidth(e.target.value)
          }}
          placeholder='The initial width of the image...'
          type='number'
          value={width}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Position
        </label>

        <select
          className={'rte-form-select rte-form-select-sm'}
          id='position-select' //! Not loving this...
          name='position'
          onChange={(e) => {
            setPosition(e.target.value as Position)
          }}
        >
          <option value='left'>Left</option>
          <option value='right'>Right</option>
          <option value='full'>Full Width</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          marginTop: 20
        }}
      >
        <button
          className='rte-button'
          disabled={isDisabled}
          onClick={() => {
            const widthAsNumber =
              width.trim() !== '' ? parseInt(width) : undefined

            onClick({
              altText,
              position,
              src,
              width:
                typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
                  ? widthAsNumber
                  : 500 // I have also set 500 within ImageNode.tsx $createImageNode
            })
          }}
          style={{ minWidth: 150 }}
          type='button'
        >
          Confirm
        </button>
      </div>
    </>
  )
}

/* ========================================================================
                         
======================================================================== */

export const InsertImageUploadedDialogBody = ({
  activeEditor,
  onClose
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}): JSX.Element => {
  const hasModifier = useRef(false)

  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('')
  const [position, setPosition] = useState<Position>('left')

  const isDisabled = src === ''

  /* ======================

  ====================== */

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result)
      }
      return ''
    }
    if (files !== null) {
      reader.readAsDataURL(files[0] as Blob)
    }
  }

  /* ======================
        useEffect() 
  ====================== */

  useEffect(() => {
    hasModifier.current = false
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [activeEditor])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Image Upload
        </label>
        <input
          accept='image/*' // ???
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onChange={(e) => {
            loadImage(e.target.files)
          }}
          spellCheck={false}
          type='file'
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Alt Text
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onChange={(e) => {
            setAltText(e.target.value)
          }}
          placeholder='Descriptive alternative text'
          spellCheck={false}
          type='text'
          value={altText}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Width
        </label>

        <input
          autoComplete='off'
          className='rte-form-control rte-form-control-sm'
          onKeyDown={(e) => {
            if (['e', 'E', '-', '+', '.'].includes(e.key)) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
          }}
          onChange={(e) => {
            setWidth(e.target.value)
          }}
          placeholder='The initial width of the image...'
          type='number'
          value={width}
        />
      </div>

      <div className='rte-form-group'>
        <label // eslint-disable-line
          className='rte-form-label'
        >
          Position
        </label>

        <select
          className={'rte-form-select rte-form-select-sm'}
          id='position-select' //! Not loving this...
          name='position'
          onChange={(e) => {
            setPosition(e.target.value as Position)
          }}
        >
          <option value='left'>Left</option>
          <option value='right'>Right</option>
          <option value='full'>Full Width</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          marginTop: 20
        }}
      >
        <button
          className='rte-button'
          disabled={isDisabled}
          onClick={() => {
            const widthAsNumber =
              width.trim() !== '' ? parseInt(width) : undefined

            const payload = {
              altText,
              position,
              src,
              width:
                typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
                  ? widthAsNumber
                  : 500 // I have also set 500 within the InlineImageNode constructor.
            }
            activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload)
            onClose()
          }}
          type='button'
          style={{ minWidth: 150 }}
        >
          Confirm
        </button>
      </div>
    </>
  )
}

/* ========================================================================
                         
======================================================================== */

export function InsertInlineImageDialog({
  activeEditor,
  onClose
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}): JSX.Element {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null)
  const hasModifier = useRef(false)

  useEffect(() => {
    hasModifier.current = false
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [activeEditor])

  const onClick = (payload: InsertInlineImagePayload) => {
    activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload)
    onClose()
  }

  return (
    <>
      {!mode && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            justifyContent: 'right',
            marginTop: 20
          }}
        >
          <button
            className='rte-button'
            onClick={() => setMode('url')}
            type='button'
          >
            URL
          </button>

          <button
            className='rte-button'
            onClick={() => setMode('file')}
            type='button'
          >
            File
          </button>
        </div>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && (
        <InsertImageUploadedDialogBody
          activeEditor={activeEditor}
          onClose={onClose}
        />
      )}
    </>
  )
}

/* ========================================================================
                         
======================================================================== */

export default function InlineImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    if (!editor.hasNodes([InlineImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertInlineImagePayload>(
        INSERT_INLINE_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createInlineImageNode(payload)
          $insertNodes([imageNode])
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event)
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event)
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor)
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor])

  return null
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const img = document.createElement('img')
img.src = TRANSPARENT_IMAGE

/* ========================================================================
                         
======================================================================== */

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    return false
  }
  dataTransfer.setData('text/plain', '_')
  dataTransfer.setDragImage(img, 0, 0)
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        height: node.__height,
        key: node.getKey(),
        src: node.__src,
        width: node.__width
      },
      type: 'image'
    })
  )

  return true
}

/* ========================================================================
                         
======================================================================== */

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }
  if (!canDropImage(event)) {
    event.preventDefault()
  }
  return true
}

/* ========================================================================
                         
======================================================================== */

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }

  const data = getDragImageData(event)
  if (!data) {
    return false
  }

  event.preventDefault()
  if (canDropImage(event)) {
    const range = getDragSelection(event)
    node.remove()
    const rangeSelection = $createRangeSelection()
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range)
    }
    $setSelection(rangeSelection)
    editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, data)
  }
  return true
}

/* ========================================================================
                         
======================================================================== */

function $getImageNodeInSelection(): InlineImageNode | null {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) {
    return null
  }
  const nodes = selection.getNodes()
  const node = nodes[0]
  return $isInlineImageNode(node) ? node : null
}

/* ========================================================================
                         
======================================================================== */

function getDragImageData(event: DragEvent): null | InsertInlineImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag')
  if (!dragData) {
    return null
  }
  const { type, data } = JSON.parse(dragData) as any
  if (type !== 'image') {
    return null
  }

  return data
}

/* ========================================================================
                         
======================================================================== */

declare global {
  interface DragEvent {
    rangeOffset?: number
    rangeParent?: Node
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target
  return !!(
    target &&
    target instanceof HTMLElement &&
    // The InlineImageNode creates a span, creates a className from theme.inlineImage and sets it on that span.
    !target.closest('code, span.rte-editor-image') &&
    target.parentElement &&
    // This className is set on the ContentEditable in the main index.tsx file.
    target.parentElement.closest('div.rte-content-editable-root')
  )
}

/* ========================================================================
                         
======================================================================== */

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range
  const target = event.target as null | Element | Document
  const targetWindow =
    target === null
      ? null
      : target.nodeType === 9
        ? (target as Document).defaultView
        : (target as Element).ownerDocument.defaultView
  const domSelection = getDOMSelection(targetWindow)
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    throw Error('Cannot get the selection when dragging')
  }

  return range
}
