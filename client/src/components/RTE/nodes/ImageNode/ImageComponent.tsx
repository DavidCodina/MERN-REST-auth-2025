import type {
  BaseSelection,
  LexicalCommand,
  LexicalEditor,
  NodeKey
} from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { Suspense, useCallback, useEffect, useRef, useState, JSX } from 'react'
import brokenImage from './image-broken.svg'

import ImageResizer from '../../ui/ImageResizer'
import { $isImageNode } from './.'

const imageCache = new Set()

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
  createCommand('RIGHT_CLICK_IMAGE_COMMAND')

/* ========================================================================
                         
======================================================================== */

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        imageCache.add(src)
        resolve(null)
      }
      img.onerror = () => {
        imageCache.add(src)
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
  maxWidth,
  onError,
  src,
  width
}: {
  altText: string
  className: string | null
  height: 'inherit' | number
  imageRef: { current: null | HTMLImageElement }
  maxWidth: number
  onError: () => void
  src: string
  width: 'inherit' | number
}): JSX.Element {
  useSuspenseImage(src)
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width
      }}
      onError={onError}
      draggable='false'
    />
  )
}

/* ========================================================================
                         
======================================================================== */
//# Test this...

function BrokenImage(): JSX.Element {
  return (
    <img // eslint-disable-line
      src={brokenImage}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200
      }}
      draggable='false'
    />
  )
}

/* ========================================================================
                         
======================================================================== */

export default function ImageComponent({
  altText,
  height,
  maxWidth,
  nodeKey,
  resizable,
  src,
  width
}: {
  altText: string
  height: 'inherit' | number
  maxWidth: number
  nodeKey: NodeKey
  resizable: boolean
  src: string
  width: 'inherit' | number
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null)

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const [isResizing, setIsResizing] = useState<boolean>(false)

  const [editor] = useLexicalComposerContext()

  const [selection, setSelection] = useState<BaseSelection | null>(null)

  const activeEditorRef = useRef<LexicalEditor | null>(null)

  const [isLoadError, setIsLoadError] = useState<boolean>(false)

  /* ======================
        $onDelete()
  ====================== */

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const deleteSelection = $getSelection()

      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        editor.update(() => {
          deleteSelection.getNodes().forEach((node) => {
            if ($isImageNode(node)) {
              node.remove()
            }
          })
        })
      }
      return false
    },
    [editor, isSelected]
  )

  /* ======================
          $onClick()
  ====================== */

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload

      if (isResizing) {
        return true
      }
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
    [isResizing, isSelected, setSelected, clearSelection]
  )

  /* ======================
        onRightClick()
  ====================== */
  //# Test this...

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection()
        const domElement = event.target as HTMLElement
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent)
        }
      })
    },
    [editor]
  )

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    let isMounted = true
    //^ rootElement not in previous.
    //^ It looks like it's part of a context menu implementation.
    const rootElement = editor.getRootElement()

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
        onClick,
        COMMAND_PRIORITY_LOW
      ),

      //^ Not in previous...
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
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

    //^ Not in previous...
    rootElement?.addEventListener('contextmenu', onRightClick)

    return () => {
      isMounted = false
      unregister()
      //^ Not in previous...
      rootElement?.removeEventListener('contextmenu', onRightClick)
    }
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    $onDelete,
    onClick,
    onRightClick,
    setSelected
  ])

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const onResizeStart = () => {
    setIsResizing(true)
  }

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing
  const isFocused = isSelected || isResizing
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              className={
                isFocused
                  ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                  : null
              }
              src={src}
              altText={altText}
              imageRef={imageRef}
              width={width}
              height={height}
              maxWidth={maxWidth}
              onError={() => setIsLoadError(true)}
            />
          )}
        </div>

        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </>
    </Suspense>
  )
}
