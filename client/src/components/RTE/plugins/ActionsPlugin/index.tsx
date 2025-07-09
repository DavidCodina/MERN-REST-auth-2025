import './ActionsPlugin.css'
import { useEffect, useState, JSX } from 'react'

import type { LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from 'lexical'
import useModal from '../../hooks/useModal'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is a simplified version of the one found in the Lexical Playground.
// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ActionsPlugin/index.tsx
// It only implements the Clear/Trash button.
//
// Note: In order for the CLEAR_EDITOR_COMMAND to actually work here, we need
// to enable it with the following plugin in the editor:
//
//   import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
//
//   ...
//
//   <ClearEditorPlugin />
//
///////////////////////////////////////////////////////////////////////////

export default function ActionsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [modal, showModal] = useModal()

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    return editor.registerUpdateListener(
      (/*{ dirtyElements, prevEditorState, tags } */) => {
        editor.getEditorState().read(() => {
          const root = $getRoot()
          const children = root.getChildren()

          if (children.length > 1) {
            setIsEditorEmpty(false)
          } else {
            if ($isParagraphNode(children[0])) {
              const paragraphChildren = children[0].getChildren()
              setIsEditorEmpty(paragraphChildren.length === 0)
            } else {
              setIsEditorEmpty(false)
            }
          }
        })
      }
    )
  }, [editor])

  /* ======================
          return
  ====================== */

  return (
    <div className='rte-actions-container'>
      <button
        aria-label='Clear editor contents'
        className='rte-delete-action-button'
        disabled={isEditorEmpty}
        onClick={() => {
          showModal('Clear editor', (onClose: any) => (
            <ShowClearDialog editor={editor} onClose={onClose} />
          ))
        }}
        title='Clear'
        type='button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
          <path
            fillRule='evenodd'
            d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
          />
        </svg>
      </button>

      {modal}
    </div>
  )
}

/* ========================================================================

======================================================================== */

function ShowClearDialog({
  editor,
  onClose
}: {
  editor: LexicalEditor
  onClose: () => void
}): JSX.Element {
  return (
    <>
      <p style={{ margin: '0px 0px 16px 0px' }}>
        Are you sure you want to clear the editor?
      </p>
      <div
        className=''
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center'
        }}
      >
        <button
          className='rte-button'
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
            editor.focus()
            onClose()
          }}
          style={{ minWidth: 80 }}
          type='button'
        >
          Clear
        </button>{' '}
        <button
          className='rte-button'
          onClick={() => {
            editor.focus()
            onClose()
          }}
          style={{ minWidth: 80 }}
          type='button'
        >
          Cancel
        </button>
      </div>
    </>
  )
}
