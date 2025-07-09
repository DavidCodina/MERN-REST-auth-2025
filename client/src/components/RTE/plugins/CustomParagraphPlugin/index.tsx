import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $isParagraphNode, ParagraphNode } from 'lexical'
import {
  $createCustomParagraphNode,
  CustomParagraphNode
} from '../../nodes/CustomParagraphNode'

/* ========================================================================
                         
======================================================================== */
// This plugin uses the concept of 'node transforms'.
// Node Transforms: Lexical allows you to register transformations that are applied
// to nodes of a specific type. These transforms can modify the node or replace it entirely.

export default function CustomParagraphPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.registerNodeTransform(ParagraphNode, (node) => {
      // CustomParagraphNode extends ParagraphNode. This means that every
      // CustomParagraphNode is also a ParagraphNode, but not every ParagraphNode
      // is a CustomParagraphNode.

      if ($isParagraphNode(node) && !(node instanceof CustomParagraphNode)) {
        const customNode = $createCustomParagraphNode()
        customNode.__format = node.__format
        customNode.__indent = node.__indent
        customNode.__dir = node.__dir
        customNode.__textFormat = node.__textFormat
        node.replace(customNode, true)
      }
    })
  }, [editor])

  return null
}
