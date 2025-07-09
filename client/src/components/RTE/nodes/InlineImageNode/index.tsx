import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from 'lexical'

import { $applyNodeReplacement, DecoratorNode } from 'lexical'
import * as React from 'react'
import { Suspense, JSX } from 'react'

const InlineImageComponent = React.lazy(() => import('./InlineImageComponent'))

export type Position = 'left' | 'right' | 'full' | undefined

export interface InlineImagePayload {
  altText: string
  height?: number
  key?: NodeKey
  src: string
  width?: number
  position?: Position
}

export interface UpdateInlineImagePayload {
  altText?: string
  position?: Position
  width?: number
}

/* ========================================================================
                         
======================================================================== */

function $convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode
    const node = $createInlineImageNode({ altText, height, src, width })
    return { node }
  }
  return null
}

/* ========================================================================
                         
======================================================================== */

export type SerializedInlineImageNode = Spread<
  {
    altText: string
    height?: number
    src: string
    width?: number
    position?: Position
  },
  SerializedLexicalNode
>

export class InlineImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __position: Position

  static getType(): string {
    return 'inline-image'
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__altText,
      node.__position,
      node.__width,
      node.__height,
      node.__key
    )
  }

  static importJSON(
    serializedNode: SerializedInlineImageNode
  ): InlineImageNode {
    const { altText, height, width, src, position } = serializedNode
    const node = $createInlineImageNode({
      altText,
      height,
      position,
      src,
      width
    })
    return node
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_node: Node) => ({
        conversion: $convertInlineImageElement,
        priority: 0
      })
    }
  }

  constructor(
    src: string,
    altText: string,
    position: Position,
    // This is important for setting a default size. Without it, the
    // editor image would fallback to maxWidth, but any dangerouslySetInnerHTML
    // would be unconstrained. That said, modal for the associated plugin now also
    // allows the user to set an initial width. // ???
    width: 'inherit' | number = 500,
    height?: 'inherit' | number,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
    this.__position = position
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())

    const domStyle =
      this.__position === 'left'
        ? 'float: left; margin: 0.5em 0.5em 0 0; clear: both;'
        : this.__position === 'right'
          ? 'float: right; margin: 0.5em 0 0 0.5em; clear: both;'
          : this.__position === 'full'
            ? 'width: 100%;'
            : ''

    element.setAttribute('style', domStyle)

    return { element }
  }

  //# I'm not sure if I need to make a similar update to exportJSON()...
  exportJSON(): SerializedInlineImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      position: this.__position,
      src: this.getSrc(),
      type: 'inline-image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width
    }
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  setAltText(altText: string): void {
    const writable = this.getWritable()
    writable.__altText = altText
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  getPosition(): Position {
    return this.__position
  }

  setPosition(position: Position): void {
    const writable = this.getWritable()
    writable.__position = position
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable()
    const { altText, position, width } = payload
    if (altText !== undefined) {
      writable.__altText = altText
    }

    if (position !== undefined) {
      writable.__position = position
    }

    if (width !== undefined) {
      writable.__width = width
    }
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const className = `${config.theme.inlineImage} position-${this.__position}`
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(
    prevNode: InlineImageNode,
    dom: HTMLElement,
    config: EditorConfig
  ): false {
    const position = this.__position
    if (position !== prevNode.__position) {
      const className = `${config.theme.inlineImage} position-${position}`
      if (className !== undefined) {
        dom.className = className
      }
    }
    return false
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <InlineImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          position={this.__position}
        />
      </Suspense>
    )
  }
}

/* ========================================================================
                         
======================================================================== */

export function $createInlineImageNode({
  altText,
  position,
  height,
  src,
  width,
  key
}: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(
    new InlineImageNode(src, altText, position, width, height, key)
  )
}

// Gotcha! There were previously backup coppies of InlineImageNode.tsx in the same directory.
// Their mere presence may have been causing false negatives.
export function $isInlineImageNode(
  node: LexicalNode | null | undefined
): node is InlineImageNode {
  return node instanceof InlineImageNode
}
