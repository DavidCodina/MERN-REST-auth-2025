// https://lexical.dev/docs/getting-started/theming

import type { EditorThemeClasses } from 'lexical'
import './theme.css'

/* ========================================================================
                                  theme
======================================================================== */

export const theme: EditorThemeClasses & { indentValue: number } = {
  // custom property used within CustomParagraphNode & CustomHeadingNode
  // Make sure this matches whatever is set in the indent class.
  indentValue: 40,
  indent: 'editor-theme-indent',
  hr: 'editor-theme-hr',
  // The associated image and inlineImage classes are important because they
  // are used for javascript checks in ImagesPlugin.tsx & InlineImagePlugin.tsx.
  // They also are set through the theme within their associaed nodes.

  image: 'rte-editor-image', // This is used by styles in index.css
  inlineImage: 'rte-inline-editor-image', // This is used by styles in index.css
  code: 'editor-theme-code', // For code blocks

  // Works in conjunction with CodeHightlightPlugin.
  codeHighlight: {
    atrule: 'editor-theme-tokenAttr',
    attr: 'editor-theme-tokenAttr',
    boolean: 'editor-theme-tokenProperty',
    builtin: 'editor-theme-tokenSelector',
    cdata: 'editor-theme-tokenComment',
    char: 'editor-theme-tokenSelector',
    class: 'editor-theme-tokenFunction',
    'class-name': 'editor-theme-tokenFunction',
    comment: 'editor-theme-tokenComment',
    constant: 'editor-theme-tokenProperty',
    deleted: 'editor-theme-tokenProperty',
    doctype: 'editor-theme-tokenComment',
    entity: 'editor-theme-tokenOperator',
    function: 'editor-theme-tokenFunction',
    important: 'editor-theme-tokenVariable',
    inserted: 'editor-theme-tokenSelector',
    keyword: 'editor-theme-tokenAttr',
    namespace: 'editor-theme-tokenVariable',
    number: 'editor-theme-tokenProperty',
    operator: 'editor-theme-tokenOperator',
    prolog: 'editor-theme-tokenComment',
    property: 'editor-theme-tokenProperty',
    punctuation: 'editor-theme-tokenPunctuation',
    regex: 'editor-theme-tokenVariable',
    selector: 'editor-theme-tokenSelector',
    string: 'editor-theme-tokenSelector',
    symbol: 'editor-theme-tokenProperty',
    tag: 'editor-theme-tokenProperty',
    url: 'editor-theme-tokenOperator',
    variable: 'editor-theme-tokenVariable'
  },

  link: 'editor-theme-link',
  paragraph: 'editor-theme-paragraph',
  text: {
    bold: 'editor-theme-textBold',
    code: 'editor-theme-textCode',
    italic: 'editor-theme-textItalic',
    strikethrough: 'editor-theme-textStrikethrough',
    subscript: 'editor-theme-textSubscript',
    superscript: 'editor-theme-textSuperscript',
    underline: 'editor-theme-textUnderline',
    underlineStrikethrough: 'editor-theme-textUnderlineStrikethrough'
  },

  list: {
    ul: 'editor-theme-ul',
    ol: 'editor-theme-ol',
    listitemChecked: 'editor-theme-listItemChecked',
    listitemUnchecked: 'editor-theme-listItemUnchecked'
  },
  quote: 'editor-theme-quote',

  embedBlock: {
    base: 'editor-theme-embedBlock',
    focus: 'editor-theme-embedBlockFocus'
  },
  heading: {
    h1: 'editor-theme-h1',
    h2: 'editor-theme-h2',
    h3: 'editor-theme-h3',
    h4: 'editor-theme-h4',
    h5: 'editor-theme-h5',
    h6: 'editor-theme-h6'
  }
}
