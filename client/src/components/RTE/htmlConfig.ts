import { $isLineBreakNode, type HTMLConfig } from 'lexical'
import { CodeNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { addClassNamesToElement } from '@lexical/utils'

type DOMExportOutputMap = HTMLConfig['export']

/* 
The html property in Lexical's initial configuration is used to customize how Lexical nodes are exported to HTML. 
This is particularly useful when you want to control the HTML structure and attributes of specific node types when 
the editor content is converted to HTML. This is super useful for transforms because it means we don't have to go
and rewrite the entire node. Here's a brief explanation of its purpose and usage:

  1. HTML Export: The html config allows you to define how different node types should be 
  represented in HTML when the editor content is exported or copied to the clipboard.

  2. Custom DOM Elements: You can specify custom DOM elements, attributes, and classes for each 
  node type, giving you fine-grained control over the resulting HTML structure.

  3. Consistency: It helps maintain consistency between the editor's internal representation and the exported HTML, 
  which can be crucial for features like copy-paste or saving content to a database.

  4. Extensibility: When you add custom node types to your Lexical editor, you can define how these custom 
  nodes should be exported to HTML.


 Gotcha: Transforming the outgoing element in this way is only recommended when the changes are trivial.
 For exmaple, hrNodeExport merely adds a class name to the element.

 Significant changes to the element could break the things that the importDOM looks for to convert.
 In those cases you'll need to buld a Custom???Node instead and a Custom???Plugin the performs the
 necessary node transforms. This is what I had to do in order to change the behavior of the default
 ParagraphNode.
*/

/* ========================================================================
                              hrNodeExport                 
======================================================================== */

const hrNodeExport: DOMExportOutputMap = new Map([
  [
    HorizontalRuleNode,
    (editor, node) => {
      const { element } = node.exportDOM(editor)
      // Or create element from scratch:
      // const element = document.createElement('hr')
      addClassNamesToElement(element as HTMLElement, editor._config.theme.hr)
      return { element }
    }
  ]
])

/* ========================================================================
                              linkNodeExport                 
======================================================================== */

const linkNodeExport: DOMExportOutputMap = new Map([
  [
    LinkNode,
    (editor, node) => {
      const linkNode = node as LinkNode

      const element = document.createElement('a')
      addClassNamesToElement(element, editor._config.theme.link)
      element.setAttribute('href', linkNode.__url)

      if (!linkNode.__target) {
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noopener noreferrer')
      }

      return { element }
    }
  ]
])

/* ========================================================================
                            autoLinkNodeExport        
======================================================================== */

const autoLinkNodeExport: DOMExportOutputMap = new Map([
  [
    AutoLinkNode,
    (editor, node) => {
      const linkNode = node as AutoLinkNode
      const element = document.createElement('a')
      addClassNamesToElement(element, editor._config.theme.link)
      element.setAttribute('href', linkNode.__url)

      if (!linkNode.__target) {
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noopener noreferrer')
      }

      return { element }
    }
  ]
])

/* ========================================================================
                                codeNodeExport           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/facebook/lexical/issues/5640
// This seems to be emulating parts of:
//
//   exportDOM() : https://github.com/facebook/lexical/blob/main/packages/lexical-code/src/CodeNode.ts
//
//   updateCodeGutter() : https://github.com/facebook/lexical/blob/main/packages/lexical-code/src/CodeHighlighter.ts
//
// The Lexical team seems to have intentionally omitted exposing the data-gutter attribute for some reason.
// I don't think it was a browser compatibility issue. The rationale is alluded to here:
// https://github.com/facebook/lexical/pull/4735#issuecomment-1620807057
//
//  "...these attributes can be regenerated - they don't need to be transported as part of the paste payload.
//  They'd mean nothing to any other editor because they're an implementation detail."
//
// The argument seems to be that they only want to generate/expose DOM content that is universally meaningful
// (i.e., meaingingful regardless of where that content then gets used). That said, I still think it's an
// important attribute to include.
//
// One could argue that all you then need to do is create an htmlConfig like this, but that's a lot of extra
// research and work. They should've just exposed data-gutters since it's already part of their internal logic.
//
///////////////////////////////////////////////////////////////////////////

//# Check the importDOM method to make sure this doesn't break it.
const LANGUAGE_DATA_ATTRIBUTE = 'data-language'
const HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE = 'data-highlight-language'

const codeNodeExport: DOMExportOutputMap = new Map([
  [
    CodeNode,
    (editor, node) => {
      const codeNode = node as CodeNode

      // This was 'pre', but it seems more consistent to use 'code'.
      const element = document.createElement('code')
      addClassNamesToElement(element, editor._config.theme.code)
      element.setAttribute('spellcheck', 'false')
      const language = codeNode.getLanguage()

      if (language) {
        element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language)
        if (codeNode.getIsSyntaxHighlightSupported()) {
          element.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language)
        }
      }

      const children = codeNode.getChildren()
      const childrenLength = children.length

      let gutter = '1'
      let count = 1
      for (let i = 0; i < childrenLength; i++) {
        if ($isLineBreakNode(children[i])) {
          gutter += '\n' + ++count
        }
      }

      element.setAttribute('data-gutter', gutter)
      return { element }
    }
  ]
])

export const htmlConfig: HTMLConfig = {
  export: new Map([
    ...hrNodeExport,
    ...linkNodeExport,
    ...autoLinkNodeExport,
    ...codeNodeExport
  ])
}
