import { useEffect, JSX } from 'react'
import type { LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TextNode } from 'lexical'
import { $createEmojiNode, EmojiNode } from '../../nodes/EmojiNode'

///////////////////////////////////////////////////////////////////////////
//
// In the following list, 'emoji happysmile' is a CSS class name.
//
//   const emojis: Map<string, [string, string]> = new Map([
//     [':)', ['rte-emoji happysmile', 'X']],
//   ])
//
// It tells the plugin to transform ':) into:
//
//   <span class="rte-emoji happysmile" data-lexical-text="true"><span class="emoji-inner">X</span></span>
//
//
// Presumably, the 'X' is for screen readers only.
// The specific name of 'rte-emoji happysmile' depends on the following CSS
// in the components index.css file:
//
//   .rte-emoji.happysmile { background-image: url(images/emoji/1F642.png); }
//
//
// Above the name of 1F642 can be anything, but it actually corresponds to
// the corresponding emoji code: https://unicode.org/emoji/charts/full-emoji-list.html
// See also: https://emojipedia.org/
//
// If we instead use [':)', ['rte-emoji abc123', 'X']] it will render:
//
//   <span class="rte-emoji abc123" data-lexical-text="true"><span class="emoji-inner">X</span></span>
//
//
// Which doesn't correspond to any CSS at all, and therefore renders a broken <span>.
// Conversely, if we use [':)', ['abc123', '🙂']] without prepending 'rte-emoji', then
// it will use the specified emoji without relying on CSS and some image in the public folder.
// This is actually how I prefer to use this plugin. Thus, while you can use EmojisPlugin to
// transform emojis, I don't really care for that feature.
//
///////////////////////////////////////////////////////////////////////////

// The problem with the emoji shorthands is that they're often too aggressive.
// Unlike in iMessages, where you're offered the emoji as a suggestion,
// here they will just automatically be inserted. Thus if for some reason
// you needed to type ':pizza', you would instead get '😛izza'. Whoops!
// To mitigate this, many of the potential shortands have been commented out.
const emojis: Map<string, [string, string]> = new Map([
  ['=)', ['grinning face with big eyes', '😃']],
  [':D', ['grinning face', '😀']],
  [':)', ['slightly smiling face', '🙂']],
  [':|', ['neutral face', '😐']],
  [':(', ['slightly frowning face', '🙁']],
  // Apple does this in iMessages, but it won't work here.
  // ❌ [':((', ['frowning face', '☹️']],

  //  This will get in the way of any URL in the editor (e.g., https://www.youtube.com/...)
  // ❌ [':/', ['confused face', '😕']],
  [':>', ['smirking face', '😏']],
  [':@', ['face with medical mask', '😷']],
  [':*', ['face blowing a kiss', '😘']],
  [':!', ['grimacing face', '😬']],
  [';)', ['winking face', '😉']],
  [':[', ['flushed face', '😳']],
  // This one won't work because it becomes >🙂
  // ['>:)', ['smiling face with horns', '😈']],
  [':^', ['lying face', '🤥']],
  ['<3', ['red heart', '❤️']]
  // I think they can only be two characters long to work.
  // ['</3', ['broken heart', '💔']],
  // These work, but they could get in the way
  // when a user is trying to type something else...
  // [':3', ['grinning cat', '😺']],
  // [':d', ['face savoring food', '😋']],
  // ['D:', ['weary face', '😩']],
  // ['B)', ['smiling face with sunglasses', '😎']],
  // [':o', ['surprised face with open mouth', '😛']],
  // [':O', ['surprised face with open mouth', '😛']],
  // ['o:)', ['smiling face with halo', '😇']],
  // ['O:)', ['smiling face with halo', '😇']],
  // [':p', ['face with tongue', '😛']],
  // [':P', ['face with tongue', '😛']],
  // [':s', ['confounded face', '😖']],
  // [':S', ['confounded face', '😖']],
  // [':x', ['face without mouth', '😶']],
  // [':X', ['face without mouth', '😶']]
])

/* ========================================================================
                         
======================================================================== */

function $findAndTransformEmoji(node: TextNode): null | TextNode {
  const text = node.getTextContent()

  for (let i = 0; i < text.length; i++) {
    const emojiData =
      emojis.get(text[i] as string) || emojis.get(text.slice(i, i + 2))

    if (emojiData !== undefined) {
      const [emojiStyle, emojiText] = emojiData
      let targetNode

      if (i === 0) {
        ;[targetNode] = node.splitText(i + 2)
      } else {
        ;[, targetNode] = node.splitText(i, i + 2)
      }

      const emojiNode = $createEmojiNode(emojiStyle, emojiText)

      targetNode?.replace(emojiNode)

      return emojiNode
    }
  }

  return null
}

function $textNodeTransform(node: TextNode): void {
  let targetNode: TextNode | null = node

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return
    }

    targetNode = $findAndTransformEmoji(targetNode)
  }
}

function useEmojis(editor: LexicalEditor): void {
  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error('EmojisPlugin: EmojiNode not registered on editor')
    }

    return editor.registerNodeTransform(TextNode, $textNodeTransform)
  }, [editor])
}

export default function EmojisPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  useEmojis(editor)
  return null
}
