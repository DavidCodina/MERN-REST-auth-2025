import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  INSERT_HORIZONTAL_RULE_COMMAND,
  $createHorizontalRuleNode
} from '../../nodes/HorizontalRuleNode'

import { $insertNodeToNearestRoot } from '@lexical/utils'

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR
} from 'lexical'

/* ========================================================================
                         
======================================================================== */

export function HorizontalRulePlugin() {
  const [editor] = useLexicalComposerContext()

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      (_type) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        const focusNode = selection.focus.getNode()

        if (focusNode !== null) {
          const horizontalRuleNode = $createHorizontalRuleNode()
          $insertNodeToNearestRoot(horizontalRuleNode)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])
  return null
}
