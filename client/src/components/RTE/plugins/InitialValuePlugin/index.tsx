import { useLayoutEffect } from 'react'
import { $getRoot, $insertNodes, LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

// Note: DOMPurify v2.5.6 is the latest version supporting MSIE. For important
// security updates compatible with MSIE, please use the 2.x branch.
import DOMPurify from 'dompurify'

type InitialValuePluginProps = {
  initialValue?: string
}

const defaultValue = '<p class="editor-theme-paragraph"><br></p>'

/* ========================================================================
                            updateEditorState()        
======================================================================== */

const updateEditorState = (editor: LexicalEditor, value: string) => {
  editor.update(() => {
    if (value.trim() === '') {
      value = defaultValue
    }

    const sanitizedValue = DOMPurify.sanitize(value, {
      // Note, this will omit the <svg> and probably all of its associated tags
      // like <path>, etc. For the purposes of this editor, that should be fine.
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe', 'a'],
      ADD_ATTR: [
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'target',
        'title'
      ],
      KEEP_CONTENT: false
    })

    // const removed = DOMPurify.removed
    // if (removed.length > 0) {
    //   console.log({ removed: DOMPurify.removed })
    //   alert('Something was removed!')
    // }

    const parser = new DOMParser()
    const dom = parser.parseFromString(sanitizedValue, 'text/html')

    try {
      const nodes = $generateNodesFromDOM(editor, dom)

      const root = $getRoot()
      // Clear the editor's content. Otherwise, it will append the new string to the old sring.
      root.clear()

      // The line $getRoot().select() is selecting the root node, which can lead to the insertion of an empty paragraph
      // (<p><br /></p>). If you don’t want this initial empty paragraph, you can safely remove the $getRoot().select() line.
      // $getRoot().select()

      $insertNodes(nodes)
    } catch (err) {
      console.error('RTE Error: could not parse the initial value:', err)
    }
  })
}

/* ========================================================================
                            InitialValuePlugin()        
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// InitialValuePlugin, is designed to insert HTML content into the Lexical editor.
// The onChange handler uses $generateHtmlFromNodes(editor) to change the internal
// editor content into an HTML string. It looks like $generateNodesFromDOM() does
// the opposite.
//
// This will run whenever the initialValue props changes. In practice this could
// be on first mount, or some indefinite time later (i.e., async data fetch).
// It's not called defaultValue because often the concepts of value and defaultValue
// are thought of as mutually exclusive and associated with uncontrolled vs controlled
// implementations, respectively.
//
// In practice, RTE's Lexical implementation should NEVER be fully controlled.
// In other words, the onChange handler should not set initialValue on
// every change. This leads to performance issues, potential infinite loops,
// or fatal errors. By exposing onChange and initialValue (and not value), this
// is meant to indicate to the developer that they should not attempt a
// fully-controlled imlementation.
//
//   https://lexical.dev/docs/getting-started/react#saving-lexical-state
//   One important thing to note: Lexical is generally meant to be uncontrolled,
//   so avoid trying to pass the EditorState back into Editor.setEditorState
//   or something along those lines.
//
// Lexical is designed to manage its own internal state, which is one of its strengths.
// the general consensus in the rich text editor community (including Lexical, Draft.js,
// and others) is to avoid fully controlled implementations. The documentation and
// examples for these libraries typically demonstrate uncontrolled usage with callbacks
// for change events.
//
// 👍🏻 https://lexical.dev/docs/concepts/serialization#html---lexical
// 👍🏻 https://lexical.dev/docs/packages/lexical-html
//
///////////////////////////////////////////////////////////////////////////

export const InitialValuePlugin = ({
  initialValue = ''
}: InitialValuePluginProps) => {
  const [editor] = useLexicalComposerContext()

  useLayoutEffect(() => {
    if (typeof initialValue !== 'string') {
      return
    }

    updateEditorState(editor, initialValue)
  }, [editor, initialValue])
  return null
}
