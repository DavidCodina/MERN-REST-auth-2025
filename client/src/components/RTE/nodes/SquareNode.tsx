import { JSX } from 'react'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import {
  NodeKey,
  // $createParagraphNode,
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
  DecoratorNode,
  // ElementNode,
  $applyNodeReplacement,
  DOMExportOutput,
  SerializedLexicalNode,
  DOMConversionMap,
  // SerializedElementNode,
  // Spread,
  type EditorConfig,
  type LexicalNode,
  type LexicalEditor
} from 'lexical'

// import { addClassNamesToElement } from '@lexical/utils'

export const INSERT_SQUARE_COMMAND = createCommand('INSERT_SQUARE_COMMAND')

// Was using this when  extends ElementNode
// export type SerializedSquareNode = SerializedElementNode

export type SerializedSquareNode = SerializedLexicalNode

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// SquareNode and SquarePlugin are for demonstrating the basics of how to construct
// custom plugins. The associated UI might look something like this:
//
// <button
//   aria-label='Insert Square'
//   disabled={!isEditable}
//   onClick={() => { activeEditor.dispatchCommand(INSERT_SQUARE_COMMAND, undefined) }}
//   style={{
//     alignSelf: 'center',
//     backgroundColor: 'rgb(132, 204, 22)',
//     border: '1px solid #65a30d',
//     borderRadius: 5,
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     lineHeight: 1,
//     padding: '4px 6px',
//     userSelect: 'none'
//   }}
//   title={'Insert Square'}
//   type='button'
// >Square</button>
//
///////////////////////////////////////////////////////////////////////////

// export class SquareNode extends ElementNode {
export class SquareNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'square'
  }

  // This method creates a copy of the node. Cloning is useful when you need to duplicate nodes,
  // such as during certain editing operations.
  static clone(node: SquareNode): SquareNode {
    return new SquareNode(node.__key)
  }

  constructor(key?: NodeKey) {
    super(key)
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    // Gotcha: It's actually significan whether you choose a 'div' or 'span'.
    // The editor's internal conversion functions will react differently.
    // For example, previously, I was using a 'div', and within the editor, the
    // square was wrapped in a <p>, but when it was converted back out to HTML, the
    // <p> was placed above the <div> as a previous sibling.
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.style.width = '100px'
    span.style.height = '100px'
    span.style.backgroundColor = 'rgb(132, 204, 22)'
    // Prevent editing inside the square. Not necessary for DecoratorNode.
    span.contentEditable = 'false'
    return span
  }

  // This method is used to update the DOM representation of the node when the node’s state changes.
  // It helps keep the DOM in sync with the node's state.
  updateDOM(
    _prevNode: SquareNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false
  }

  // This method is used to import a node from its serialized JSON representation.
  // This is particularly useful when you need to load saved content back into the editor.
  // When you call importJSON, it takes the serialized data and reconstructs the node in the editor.
  // In your case, it calls $createSquareNode() to create a new SquareNode instance.
  static importJSON(_serializedNode: SerializedSquareNode): SquareNode {
    return $createSquareNode()
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // exportJSON() is important. If we attempt to omit it, we will get a warning in the dev console.
  // This method is used to export the node to a JSON representation. This is useful for saving the editor’s
  // content to a database or for other serialization purposes.
  // When you call exportJSON, it converts the node’s state into a JSON object.
  // This JSON object can then be stored or transmitted as needed.
  //
  // If a node doesn’t properly implement exportJSON, you could indeed run into issues when calling editorState.toJSON().
  // This could result in incomplete or incorrect serialization of the editor’s content.
  // To avoid such issues, make sure that all custom nodes in your Lexical editor have an exportJSON method that returns
  // a valid JSON representation of the node.
  //
  ///////////////////////////////////////////////////////////////////////////
  exportJSON(): SerializedSquareNode {
    return {
      // Only do this when extending ElementNode.
      // ❌ ...super.exportJSON(),
      type: 'square',
      version: 1
    }
  }

  // This method is used to define how the node should be imported from a DOM element.
  // It's useful for converting HTML content into editor nodes.
  // The importDOM method returns a conversion map that specifies how to convert specific DOM elements
  // into nodes. In your case, it checks if the element is a red square and, if so, converts it into a SquareNode.
  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: HTMLElement) => {
        if (
          node.style.width === '100px' &&
          node.style.height === '100px' &&
          // Gotcha: The incoming node will represent the color as rgb.
          node.style.backgroundColor === 'rgb(132, 204, 22)' &&
          node.style.display === 'inline-block'
        ) {
          return {
            conversion: $convertSquareElement,
            // Previously, I was using 'div' It was not working until I set priority 2 here.
            // This is possibly because Lexical sees that it's a 'div' and  attempts to
            // apply a different built-in conversion function to it. However, I have since
            // switched to a 'span'
            priority: 1
          }
        }

        return null
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // Why does this work as a shorthand for this?
  //
  //   exportDOM(_editor: LexicalEditor): DOMExportOutput {
  //     const element = document.createElement('span')
  //     element.style.display = 'inline-block'
  //     element.style.width = '100px'
  //     element.style.height = '100px'
  //     element.style.backgroundColor = 'rgb(132, 204, 22)'
  //     return { element }
  //   }
  //
  // By calling super.exportDOM(editor), you are reusing the existing implementation
  // and only extracting the element from the returned object. That said, in this case
  // we still want to remove contentEditable. I didn't realize this until I implemented
  // DOMPurify, where it will remove it for you if you don't.
  //
  ///////////////////////////////////////////////////////////////////////////
  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor)
    if (element instanceof HTMLElement) {
      element.removeAttribute('contentEditable')
    }
    return { element }
  }

  isInline(): boolean {
    return true
  }

  // The collapseAtStart() method is typically used to handle the behavior when the cursor is
  // at the start of the node and a backspace or delete action is performed.
  // It allows you to define how the node should collapse or transform when such actions occur.
  // Not necessary because there is never a cursor inside this node.

  // collapseAtStart(): boolean {
  //   const paragraph = $createParagraphNode()
  //   const children = this.getChildren()
  //   children.forEach((child: any) => {
  //     paragraph.append(child)
  //   })
  //   this.replace(paragraph)
  //   return true
  // }

  // Always required when extending DecoratorNode.
  // Ultimately, this is what gets renddered in the editor.
  // It kind of seems redundant with createDOM(), but they are both required.
  decorate(): JSX.Element {
    return (
      <span
        style={{
          display: 'inline-block',
          width: '100px',
          height: '100px',
          backgroundColor: 'rgb(132, 204, 22)'
        }}
      />
    )
  }
}

/* ======================

====================== */

function $convertSquareElement() {
  const node = $createSquareNode()
  return { node }
}

/* ======================

====================== */

export function $createSquareNode(): SquareNode {
  return $applyNodeReplacement(new SquareNode())
  //return new SquareNode()
}

/* ======================

====================== */
// This is a type guard function that checks if a given node is an instance of SquareNode.
// It returns true if the node is an instance of SquareNode, and false otherwise. This is
// useful for type checking and ensuring that you’re working with the correct node type.

export function $isSquareNode(
  node: LexicalNode | null | undefined
): node is SquareNode {
  return node instanceof SquareNode
}
