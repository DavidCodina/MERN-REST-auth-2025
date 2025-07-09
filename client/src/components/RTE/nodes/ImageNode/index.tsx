// The code in this file was originally taken from the playground example:
// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/ImageNode.tsx
// However, I've removed caption-related logic.

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

const ImageComponent = React.lazy(() => import('./ImageComponent'))

export interface ImagePayload {
  altText: string
  height?: number
  key?: NodeKey
  maxWidth?: number
  src: string
  width?: number
}

/* ========================================================================
       
======================================================================== */

function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
  return (
    img.parentElement !== null && // Changed from != to !==
    img.parentElement.tagName === 'LI' &&
    img.previousSibling === null &&
    img.getAttribute('aria-roledescription') === 'checkbox'
  )
}

/* ========================================================================
       
======================================================================== */

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement

  // Previously, the conditiona was: if (domNode instanceof HTMLImageElement) { ... }
  if (img.src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
    return null
  }
  const { alt: altText, src, width, height } = img
  const node = $createImageNode({ altText, height, src, width })
  return { node }
}

/* ========================================================================
       
======================================================================== */

export type SerializedImageNode = Spread<
  {
    altText: string
    height?: number
    maxWidth: number
    src: string
    width?: number
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __maxWidth: number

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width
    })

    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_node: Node) => ({
        conversion: $convertImageElement,
        priority: 0
      })
    }
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number = 2000,
    // This is important for setting a default size. Without it, the
    // editor image would fallback to maxWidth, but any dangerouslySetInnerHTML
    // would be unconstrained. That said, modal for the ImagesPlugin now also
    // allows the user to set an initial width. The default width set here is
    // still useful for when the user drag and drops an image.
    width: 'inherit' | number = 500,
    height?: 'inherit' | number,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width
    }
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          altText={this.__altText}
          height={this.__height}
          maxWidth={this.__maxWidth}
          nodeKey={this.getKey()}
          resizable={true}
          src={this.__src}
          width={this.__width}
        />
      </Suspense>
    )
  }
}

/* ========================================================================
       
======================================================================== */

export function $createImageNode({
  altText,
  height,
  // This is arbitrary, but allows fairly large images.
  maxWidth,
  src,
  width,
  key
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, maxWidth, width, height, key)
  )
}

/* ========================================================================
       
======================================================================== */

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
