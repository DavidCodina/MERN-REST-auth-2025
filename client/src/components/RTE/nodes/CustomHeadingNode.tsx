import {
  $applyNodeReplacement,
  isHTMLElement,
  // ElementNode,
  type SerializedElementNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type LexicalEditor,
  type DOMConversionOutput,
  type ElementFormatType,
  type LexicalNode,
  type Spread
  // type EditorConfig
  // type NodeKey
  // type EditorThemeClasses
} from 'lexical'
import { HeadingNode } from '@lexical/rich-text'
// import { addClassNamesToElement } from '@lexical/utils'
import { theme } from '../theme'

export type SerializedCustomHeadingNode = Spread<
  {
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  },
  SerializedElementNode
>

export type HeadingTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/* ========================================================================
                         
======================================================================== */

export class CustomHeadingNode extends HeadingNode {
  static getType(): string {
    return 'custom-heading'
  }

  static clone(node: CustomHeadingNode): CustomHeadingNode {
    return new CustomHeadingNode(node.__tag, node.__key)
  }

  /* ======================
        importJSON
  ====================== */

  static importJSON(
    serializedNode: SerializedCustomHeadingNode
  ): CustomHeadingNode {
    const node = $createCustomHeadingNode(serializedNode.tag) //^ Different
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  /* ======================
        exportJSON
  ====================== */

  exportJSON(): SerializedCustomHeadingNode {
    return {
      ...super.exportJSON(),
      tag: this.getTag(),
      type: 'custom-heading',
      version: 1
    }
  }

  /* ======================
        createDOM
  ====================== */
  // For DOM content created in the editor, there's no need to add logic for adding indentation.
  // This already happens as a result of Lexical's internal LexicalReconciler.ts

  // createDOM(config: EditorConfig): HTMLElement {
  //   const dom = super.createDOM(config)
  //   console.log('Creating DOM!')
  //   return dom
  // }

  /* ======================
        importDOM
  ====================== */

  static importDOM(): DOMConversionMap | null {
    return {
      h1: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      h2: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      h3: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      h4: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      h5: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      h6: (_node: Node) => ({
        conversion: $convertCustomHeadingElement, //^ Different
        priority: 0
      }),
      p: (node: Node) => {
        // domNode is a <p> since we matched it by nodeName
        const paragraph = node as HTMLParagraphElement
        const firstChild = paragraph.firstChild
        if (firstChild !== null && isGoogleDocsTitle(firstChild)) {
          return {
            conversion: () => ({ node: null }),
            priority: 3
          }
        }
        return null
      },
      span: (node: Node) => {
        if (isGoogleDocsTitle(node)) {
          return {
            conversion: (_domNode: Node) => {
              return {
                node: $createCustomHeadingNode('h1') //^ Different
              }
            },
            priority: 3
          }
        }
        return null
      }
    }
  }

  /* ======================
        exportDOM
  ====================== */

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor)

    if (element && isHTMLElement(element)) {
      element.style.textIndent = ''
      const indent = this.getIndent()
      if (indent > 0) {
        // Clear existing text-indent style
        element.style.paddingInlineStart = `${indent * (theme.indentValue || 40)}px`
      } else {
        element.style.paddingInlineStart = ''
      }
    }

    return {
      element
    }
  }
}

/* ======================

====================== */

function $convertCustomHeadingElement(
  element: HTMLElement
): DOMConversionOutput {
  const nodeName = element.nodeName.toLowerCase()
  let node = null
  if (
    nodeName === 'h1' ||
    nodeName === 'h2' ||
    nodeName === 'h3' ||
    nodeName === 'h4' ||
    nodeName === 'h5' ||
    nodeName === 'h6'
  ) {
    node = $createCustomHeadingNode(nodeName)
    if (element.style !== null) {
      node.setFormat(element.style.textAlign as ElementFormatType)
      const indent =
        parseInt(element.style.paddingInlineStart, 10) /
        (theme.indentValue || 40)
      if (indent > 0) {
        node.setIndent(indent)
      }
    }
  }
  return { node }
}

/* ======================

====================== */

export function $createCustomHeadingNode(
  headingTag: HeadingTagType
): CustomHeadingNode {
  return $applyNodeReplacement(new CustomHeadingNode(headingTag))
}

/* ======================

====================== */

export function $isCustomHeadingNode(
  node: LexicalNode | null | undefined
): node is CustomHeadingNode {
  return node instanceof CustomHeadingNode
}

/* ======================

====================== */

function isGoogleDocsTitle(domNode: Node): boolean {
  if (domNode.nodeName.toLowerCase() === 'span') {
    return (domNode as HTMLSpanElement).style.fontSize === '26pt'
  }
  return false
}
