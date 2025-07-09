import {
  $applyNodeReplacement,
  ParagraphNode,
  isHTMLElement,
  type DOMConversionMap,
  type DOMExportOutput,
  type LexicalEditor,
  type DOMConversionOutput,
  type ElementFormatType,
  type LexicalNode,
  type SerializedParagraphNode,
  type Spread
  // type EditorConfig,
  // type EditorThemeClasses
} from 'lexical'
import { theme } from '../theme'

export type SerializedCustomParagraphNode = Spread<
  {
    type: 'custom-paragraph'
    version: 1
  },
  SerializedParagraphNode
>
/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The entire point of CustomParagraphNode is to override the textIndent,
// and replace it with paddingInlineStart for consistency.
// https://github.com/facebook/lexical/issues/6342
//
// The default Lexical ParagraphNode intentionally DOES NOT do this, indicating that:
//
//   padding-inline-start is not widely supported in email HTML, but
//   Lexical Reconciler uses padding-inline-start. Using text-indent instead.
//
// However, I prefer consistency and currently don't care about emails.
//
///////////////////////////////////////////////////////////////////////////

export class CustomParagraphNode extends ParagraphNode {
  static getType(): string {
    return 'custom-paragraph'
  }

  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__key)
  }

  static importJSON(
    serializedNode: SerializedCustomParagraphNode
  ): CustomParagraphNode {
    const node = $createCustomParagraphNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    node.setTextFormat(serializedNode.textFormat)
    return node
  }

  exportJSON(): SerializedCustomParagraphNode {
    return {
      ...super.exportJSON(),
      type: 'custom-paragraph',
      version: 1
    }
  }

  // createDOM(config: EditorConfig): HTMLElement {
  //   const dom = super.createDOM(config)
  //   // Add custom style to test.
  //   dom.style.outline = '2px dashed deeppink'
  //   console.log('Creating DOM!')
  //   return dom
  // }

  // updateDOM(
  //   _prevNode: CustomParagraphNode,
  //   _dom: HTMLElement,
  //   _config: EditorConfig
  // ): boolean {
  //   return false
  // }

  /* ======================
        importDOM
  ====================== */

  static importDOM(): DOMConversionMap | null {
    return {
      p: (_node: Node) => ({
        conversion: $convertCustomParagraphElement,
        priority: 0
      })
    }
  }

  /* ======================
        exportDOM
  ====================== */

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    // const element = super.exportDOM(editor).element as HTMLElement
    const { element } = super.exportDOM(editor)

    if (element && isHTMLElement(element)) {
      element.style.textIndent = '' // Clear existing text-indent style

      ///////////////////////////////////////////////////////////////////////////
      //
      // Don't do this. It's already happening in the super.exportDOM() call above.
      //
      //   if (this.isEmpty()) {
      //     element.append(document.createElement('br'))
      //   }
      //
      //   const formatType = this.getFormatType()
      //   element.style.textAlign = formatType
      //
      //   const direction = this.getDirection()
      //   if (direction) {
      //     element.dir = direction
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
      const indent = this.getIndent()
      if (indent > 0) {
        element.style.paddingInlineStart = `${indent * (theme.indentValue || 40)}px`
      } else {
        element.style.paddingInlineStart = ''
      }
    }

    return { element }
  }
}

/* ======================

====================== */

const $convertCustomParagraphElement = (
  element: HTMLElement
): DOMConversionOutput => {
  const node = $createCustomParagraphNode()
  if (element.style) {
    node.setFormat(element.style.textAlign as ElementFormatType)
    const indent =
      parseInt(element.style.paddingInlineStart, 10) / (theme.indentValue || 40)
    if (indent > 0) {
      node.setIndent(indent)
    }
  }
  return { node }
}

/* ======================

====================== */

export const $createCustomParagraphNode = (): CustomParagraphNode => {
  return $applyNodeReplacement(new CustomParagraphNode())
}

/* ======================

====================== */

export const $isCustomParagraphNode = (
  node: LexicalNode | null | undefined
): node is CustomParagraphNode => {
  return node instanceof CustomParagraphNode
}
