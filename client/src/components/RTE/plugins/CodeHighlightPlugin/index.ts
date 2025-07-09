import { registerCodeHighlighting } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, JSX } from 'react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Somehow by calling registerCodeHighlighting(editor)
// It adds the data-gutter attribute to the <code>,
// which then allows the CSS theme to read that.
// The documentation for Lexical is actually really bad.
// Ultimately, we're left to just kind of figure it out based on examples.
//
// https://lexical.dev/docs/api/modules/lexical_code#registercodehighlighting
//
//   <code
//     class="editor-theme-code"
//     spellcheck="false" data-language="js"
//     data-highlight-language="js"
//     data-gutter="1
//     2
//     3"
//     dir="ltr"
//   > ... </code>
//
// Also the ToolbarPlugin does this:
//
//   const onCodeLanguageSelect = useCallback(
//     (value: string) => {
//       activeEditor.update(() => {
//         if (selectedElementKey !== null) {
//           const node = $getNodeByKey(selectedElementKey)
//           if ($isCodeNode(node)) {
//             node.setLanguage(value)
//           }
//         }
//       })
//     },
//     [activeEditor, selectedElementKey]
//   )
//
// There doesn't seem to be an associated custom node for CodeHighlightPlugin.
// However, there is:
//
//  import {CodeHighlightNode, CodeNode} from '@lexical/code';
//
// Both of which I'm already implementing.
//
///////////////////////////////////////////////////////////////////////////

export default function CodeHighlightPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])

  return null
}
