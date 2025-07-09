import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  INSERT_SQUARE_COMMAND,
  $createSquareNode
} from '../../nodes/SquareNode'
// import { $insertNodeToNearestRoot } from '@lexical/utils'

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  $createParagraphNode,
  $createTextNode
  // $createRangeSelection,
  // $setSelection
} from 'lexical'

import { SquareNode } from '../../nodes/SquareNode'

/* ========================================================================
                         
======================================================================== */

export function SquarePlugin() {
  const [editor] = useLexicalComposerContext()

  if (!editor.hasNodes([SquareNode])) {
    throw new Error('SquarePlugin: SquareNode not registered on editor.')
  }

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    return editor.registerCommand(
      INSERT_SQUARE_COMMAND,
      (_type) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        // const focusNode = selection.focus.getNode()
        // if (focusNode !== null) {
        //   const squareNode = $createSquareNode()
        //   $insertNodeToNearestRoot(squareNode)
        // }

        const squareNode = $createSquareNode()
        const paragraphNode = $createParagraphNode()
        paragraphNode.append($createTextNode(''))
        //selection.insertNodes([squareNode])
        selection.insertNodes([squareNode, paragraphNode])

        return true //^ Why true? I think it has something to do with propagation.
      },
      COMMAND_PRIORITY_EDITOR //^ Why COMMAND_PRIORITY_EDITOR? You could use COMMAND_PRIORITY_LOW?
    )
  }, [editor])
  return null
}
