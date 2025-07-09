import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import {
  $createCustomHeadingNode,
  CustomHeadingNode
} from '../../nodes/CustomHeadingNode'

import { HeadingNode, $isHeadingNode } from '@lexical/rich-text'
/* ========================================================================
                         
======================================================================== */
// This plugin uses the concept of 'node transforms'.
// Node Transforms: Lexical allows you to register transformations that are applied
// to nodes of a specific type. These transforms can modify the node or replace it entirely.

export default function CustomHeadingPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.registerNodeTransform(HeadingNode, (node) => {
      if ($isHeadingNode(node) && !(node instanceof CustomHeadingNode)) {
        const customNode = $createCustomHeadingNode(node.getTag())
        customNode.__format = node.__format
        customNode.__indent = node.__indent
        customNode.__dir = node.__dir
        node.replace(customNode, true)
      }
    })
  }, [editor])

  return null
}
