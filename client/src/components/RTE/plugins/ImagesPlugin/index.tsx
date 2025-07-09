//  All of the logic for captions has been removed from ImagesPlugin, ImageNode,
// ImageComponent, and ImageResizer. This drastically simplifies the implementation,
// making it more understandable while still keeping the resizing and centering features.

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
import * as React from 'react' //* Just added.
import { useEffect, useRef, useState, JSX } from 'react'

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload
} from '../../nodes/ImageNode'

export type InsertImagePayload = Readonly<ImagePayload>

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

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')

/* ========================================================================
                         
======================================================================== */

export function InsertImageUriDialogBody({
  onClick
}: {
  onClick: (payload: InsertImagePayload) => void
}) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('')

  const isDisabled = src === ''

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

export function InsertImageUploadedDialogBody({
  onClick
}: {
  onClick: (payload: InsertImagePayload) => void
}) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [width, setWidth] = useState('')

  const isDisabled = src === ''

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
              src,

              width:
                typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
                  ? widthAsNumber
                  : 500 // I have also set 500 within the ImageNode constructor.
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

export function InsertImageDialog({
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

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
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
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  )
}

/* ========================================================================
                         
======================================================================== */

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload)
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

/* ========================================================================
                         
======================================================================== */

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const img = document.createElement('img')

img.src = TRANSPARENT_IMAGE

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
        maxWidth: node.__maxWidth,
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
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)
  }
  return true
}

/* ========================================================================
                         
======================================================================== */

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) {
    return null
  }
  const nodes = selection.getNodes()
  const node = nodes[0]
  return $isImageNode(node) ? node : null
}

/* ========================================================================
                         
======================================================================== */

function getDragImageData(event: DragEvent): null | InsertImagePayload {
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

  // Basically, this is saying don't drop images on code or other images.
  return !!(
    target &&
    target instanceof HTMLElement &&
    // The ImageNode creates a span, creates a className from theme.image and sets it on that span.
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

  //^ This may be deprecated, but the playground source code is still using it.
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    throw Error(`Cannot get the selection when dragging`)
  }

  return range
}
