import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { isMimeType, mediaFileReader } from '@lexical/utils'
import { COMMAND_PRIORITY_LOW } from 'lexical'
import { useEffect } from 'react'

import { INSERT_IMAGE_COMMAND } from '../ImagesPlugin'

//# We might want to modify this to only allow jpeg, and png.
const ACCEPTABLE_IMAGE_TYPES = [
  'image/'
  // 'image/heic',
  // 'image/heif',
  // 'image/gif',
  // 'image/webp'
]

/* ========================================================================
                              DragDropPaste         
======================================================================== */
// The DragDropPaste plugin is specifically designed to handle the dragging and dropping of images
// into the Lexical editor. It checks for acceptable image MIME types and processes them accordingly.
// If you want to enable dragging and dropping of other types of content, you would need to modify the plugin
// to handle additional MIME types and implement the corresponding logic for those types.
//
// Note: Because the image is base64 encoded, rather than being an actual file upload, you may not want
// this feature. That said, it's important to note that any non-URL images (i.e., all file input uploads) are
// also converted to base64 strings. For this reason, you may not want the file upload option in any of the
// image plugins because it can potentially add a bunch of kb to your database.

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        ;(async () => {
          // The mediaFileReader function reads the image file and converts it to a base64-encoded string.
          // This base64 string is then used as the src attribute for the image when it is inserted into the editor.
          // { file: File, result: "data:image/png;base64,iVBORw0KGgoAAAAN ..." }
          const filesResult = await mediaFileReader(
            files,
            [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x)
          )

          for (const { file, result } of filesResult) {
            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: file.name,
                src: result
              })
            }
          }
        })()
        return true
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])
  return null
}
