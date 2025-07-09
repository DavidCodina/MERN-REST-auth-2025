// import React, { useEffect, useCallback } from 'react'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import {
  // DecoratorNode,
  // ElementFormatType,
  // $getSelection,
  // $isNodeSelection,
  // $getNodeByKey,
  createCommand,
  // CLICK_COMMAND,
  // COMMAND_PRIORITY_LOW,
  // KEY_DELETE_COMMAND,
  // KEY_BACKSPACE_COMMAND,
  // DecoratorNode,
  ElementNode,
  $applyNodeReplacement,
  // SerializedLexicalNode,
  SerializedElementNode,
  type EditorConfig,
  type LexicalNode,
  type LexicalEditor
} from 'lexical'

import { addClassNamesToElement } from '@lexical/utils'

// import { mergeRegister } from '@lexical/utils'

export const INSERT_HORIZONTAL_RULE_COMMAND = createCommand(
  'INSERT_HORIZONTAL_RULE_COMMAND'
)

export type SerializedHorizontalRuleNode = SerializedElementNode // SerializedLexicalNode

type Priority = 0 | 1 | 2 | 3 | 4 | undefined

/* ========================================================================
                              HorizontalRuleNode
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha: The original HorizontalRule node did: extends DecoratorNode<JSX.Element>
// However, if you do this, then it will remove the element.className that is set
// within createDOM(). I looked at a lot of source code, but couldn't find the
// reason that this happens. It seems like it's being done on purpose.
// Because if we do this in createDOM it works...
//
//   setTimeout(() => { element.classList.add(className) }, 1000)
//
// This would indicate that there's something happening later that intentionally
// removes the className.
//
// In any case, it seems like they're working on making it themeable already:
// https://github.com/facebook/lexical/issues/4336
// I would be curious to see what they actually do to make it work.
//
// In changing from DecoratorNode to ElementNode, I also had to change
// the type definition for SerializedHorizontalRuleNode from SerializedLexicalNode
// to SerializedElementNode. This then affected the definition of exportJSON() below.
//
// Note also that once you switch to ElementNode, the decorate() method does nothing,
// which means that the HorizontalRuleComponent will also never get implemented.
// This is fine, it's just something to be aware of for now...
//
///////////////////////////////////////////////////////////////////////////

export class HorizontalRuleNode extends ElementNode {
  static getType(): string {
    return 'horizontalrule'
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key)
  }

  static importJSON(_serializedNode: SerializedHorizontalRuleNode) {
    return $createHorizontalRuleNode()
  }

  static importDOM() {
    return {
      hr: () => ({
        // This is a function defined below...
        conversion: $convertHorizontalRuleElement,
        priority: 0 as Priority
      })
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // exportJSON() is important. If we attempt to omit it, we will get a warning in the dev console:
  //
  //   Lexical.dev.js:10961 HorizontalRuleNode should implement "exportJSON" method to ensure
  //   JSON and default HTML serialization works as expected
  //
  ///////////////////////////////////////////////////////////////////////////

  exportJSON(): SerializedHorizontalRuleNode {
    return {
      // children: [],
      // direction: null,
      // format: '' as ElementFormatType,
      // indent: 0,
      ...super.exportJSON(),
      type: 'horizontalrule',
      version: 1
    }
  }

  exportDOM(editor: LexicalEditor) {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha: don't do this:
    //
    //   const element = document.createElement('hr')
    //
    // Instead use super.exportDOM(editor). Why?
    // Because then $generateHtmlFromNodes() will work
    // correctly and pass the className.
    //
    ///////////////////////////////////////////////////////////////////////////
    const { element } = super.exportDOM(editor)

    return {
      element
    }
  }

  createDOM(config: EditorConfig, _editor: LexicalEditor) {
    const element = document.createElement('hr')
    const className = config.theme.hr

    // This is why we went through all of the trouble
    // of creating a custom HorizontalRuleNode, HorizontalRulePlugin, etc.
    // const className = config.theme.hr
    // element.className = className
    addClassNamesToElement(element, className)
    return element
  }

  getTextContent() {
    return '\n'
  }

  isInline() {
    return false
  }

  updateDOM() {
    return false
  }

  // In the built-in Lexical HorizontalRuleNode it did this.
  // However, it was also originally a DecoratorNode. As far
  // as I can tell, this is no longer needed, which means that
  // the HorizontalRuleComponent is also no longer needed.

  // decorate() {
  //   console.log('decorate() called...')
  //   return /*#__PURE__*/ React.createElement(HorizontalRuleComponent, {
  //     nodeKey: this.__key
  //   })
  // }
}

/* ========================================================================

======================================================================== */
// Used above by importDOM()

function $convertHorizontalRuleElement() {
  return {
    node: $createHorizontalRuleNode()
  }
}

/* ========================================================================

======================================================================== */
// Used above by $convertHorizontalRuleElement()

export function $createHorizontalRuleNode() {
  return $applyNodeReplacement(new HorizontalRuleNode())
}

/* ========================================================================

======================================================================== */

export function $isHorizontalRuleNode(node: LexicalNode | null | undefined) {
  return node instanceof HorizontalRuleNode
}
