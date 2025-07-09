import type { Position } from './'
import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import * as React from 'react'
import { Suspense, useCallback, useEffect, useRef, useState, JSX } from 'react'

import useModal from '../../hooks/useModal'

import { $isInlineImageNode, InlineImageNode } from './'

/* ========================================================================
                         
======================================================================== */

const imageCache = new Set()

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        imageCache.add(src)
        resolve(null)
      }
    })
  }
}

/* ========================================================================
                         
======================================================================== */

function LazyImage({
  altText,
  className,
  height,
  imageRef,
  position,
  src,
  width
}: {
  altText: string
  className: string | null
  height: 'inherit' | number
  imageRef: { current: null | HTMLImageElement }
  position: Position
  src: string
  width: 'inherit' | number
}): JSX.Element {
  useSuspenseImage(src)

  return (
    <img
      alt={altText}
      className={className || undefined}
      draggable='false'
      data-position={position}
      ref={imageRef}
      src={src}
      style={{
        display: 'block',
        height,
        width
      }}
    />
  )
}

/* ========================================================================
                         
======================================================================== */
// This component renders when you click the 'Edit' button on an inline image.

export function UpdateInlineImageDialog({
  activeEditor,
  nodeKey,
  onClose
}: {
  activeEditor: LexicalEditor
  nodeKey: NodeKey
  onClose: () => void
}): JSX.Element {
  const editorState = activeEditor.getEditorState()
  const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode)
  const [altText, setAltText] = useState(node.getAltText())
  const [width, setWidth] = useState('')
  const [position, setPosition] = useState<Position>(node.getPosition())

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value as Position)
  }

  const handleOnConfirm = () => {
    const widthAsNumber = width.trim() !== '' ? parseInt(width) : undefined

    const payload = {
      altText,
      position,
      width:
        typeof widthAsNumber === 'number' && !isNaN(widthAsNumber)
          ? widthAsNumber
          : undefined // Do not update if undefined.
    }
    if (node) {
      activeEditor.update(() => {
        node.update(payload)
      })
    }
    onClose()
  }

  /* ======================
          return
  ====================== */

  return (
    <>
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
          placeholder='The new width of the image...'
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
          id='position-select' //! Not loving this!
          className='rte-form-select rte-form-select-sm'
          value={position}
          name='position'
          onChange={handlePositionChange}
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
          onClick={() => handleOnConfirm()}
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

export default function InlineImageComponent({
  src,
  altText,
  nodeKey,
  width = 500,
  height,
  position
}: {
  altText: string
  height: 'inherit' | number
  nodeKey: NodeKey
  src: string
  width: 'inherit' | number
  position: Position
}): JSX.Element {
  const [modal, showModal] = useModal()
  const imageRef = useRef<null | HTMLImageElement>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const activeEditorRef = useRef<LexicalEditor | null>(null)

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const deleteSelection = $getSelection() //  _NodeSelection : { dirty, _cachedNodes, _nodes }

      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        if (isSelected && $isNodeSelection(deleteSelection)) {
          editor.update(() => {
            deleteSelection.getNodes().forEach((node) => {
              if ($isInlineImageNode(node)) {
                console.warn('The node IS an inline image node.', node)
                node.remove()
              } else {
                //! The problem is a false negative here.....................................................
                console.warn('The node IS NOT an inline image node.', node)
              }
            })
          })
        }
      }
      return false
    },
    [editor, isSelected]
  )

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()))
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected)
            } else {
              clearSelection()
              setSelected(true)
            }
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
    return () => {
      isMounted = false
      unregister()
    }
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected])

  /* ======================
         return
  ====================== */

  const draggable = isSelected && $isNodeSelection(selection)
  const isFocused = isSelected

  return (
    <Suspense fallback={null}>
      <>
        {/* This was originally <span draggable={draggable}> */}
        <div draggable={draggable}>
          <button
            className='rte-edit-image-button'
            onClick={() => {
              showModal('Update Inline Image', (onClose) => (
                <UpdateInlineImageDialog
                  activeEditor={editor}
                  nodeKey={nodeKey}
                  onClose={onClose}
                />
              ))
            }}
            ref={buttonRef}
            type='button'
            title='Edit Image'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1em'
              height='1em'
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z' />
            </svg>
          </button>

          <LazyImage
            altText={altText}
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : null
            }
            height={height}
            imageRef={imageRef}
            position={position}
            src={src}
            width={width}
          />
        </div>
      </>
      {modal}
    </Suspense>
  )
}
