import { useEffect, MutableRefObject } from 'react'
import { LexicalEditor, CLEAR_EDITOR_COMMAND } from 'lexical'

function isHTMLElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement
}

/* ========================================================================
                                useAPI()
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Initially, I had created an APIPlugin to hook into the editor, and pass it
// back through a ref.
//
//   export default function APIPlugin({ apiRef }: APIPluginProps) {
//     const [editor] = useLexicalComposerContext()
//     const clear = () => { editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined) }
//     const focus = () => { editor.focus() }
//     const api = { clear, focus }
//     apiRef.current = api
//     return null
//   }
//
// However, I later realized the you can attach a ref to <ContentEditable ref={contentEditableRef} />
// And then hook into editor from there. Once we have the editor, we can expose it direclty, or
// create a limited set of API methods. Then we can attach the api object to the apiRef, passing it
// all the way out to the parent component.
//
///////////////////////////////////////////////////////////////////////////

export default function useAPI({
  contentEditableRef,
  apiRef
}: {
  contentEditableRef: MutableRefObject<HTMLDivElement | null>
  apiRef: MutableRefObject<unknown> | undefined
}) {
  useEffect(() => {
    const contentEditable = contentEditableRef.current
    if (!contentEditable || !('__lexicalEditor' in contentEditable)) {
      return
    }

    const editor = contentEditable.__lexicalEditor as LexicalEditor

    const clear = () => {
      if (typeof document === 'undefined') {
        return
      }

      const activeElement = document.activeElement

      // Gotcha: this command returns focus to div.rte-content-editable-root
      // Ordinarily, that makes sense because we don't want div.rte-content-editable-root
      // losing focus just because we cleared the editor, or dispatched some other command.
      // That said, in the case of a programmatic operation like clear(), we don't expect
      // the editor to get focus. To get around this, we need to capture the activeElement,
      // and later reset it.
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)

      if (
        activeElement &&
        activeElement !== document.body &&
        isHTMLElement(activeElement)
      ) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // We need to use SetTimeout here. Why?
        //  setTimeout here is related to the execution context and the JavaScript event loop.
        // Let's break down why this is necessary and what effect it has:
        //
        //   1. Execution Context and Event Loop:
        //      When you call editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined), this operation
        //      likely triggers a series of synchronous operations within the Lexical editor, including
        //      clearing the content and managing focus.
        //
        //   2. Microtasks vs Macrotasks:
        //     JavaScript distinguishes between microtasks (like Promise callbacks) and macrotasks
        //     (like setTimeout callbacks). Microtasks are executed before the next render, while
        //     macrotasks are executed after the next render.
        //
        //   3. Focus Management:
        //     The editor's internal focus management is likely happening synchronously or as a microtask,
        //     immediately after the dispatchCommand call.
        //
        //   4. The setTimeout Effect:
        //      By wrapping activeElement.focus() in a setTimeout, even with a delay of 0, you're pushing this
        //      operation to the end of the current call stack and scheduling it as a new macrotask.
        //
        // Here's what's happening in sequence:
        //
        //   1. The clear function is called.
        //   2. activeElement is captured.
        //   3. editor.dispatchCommand is called, clearing the editor.
        //   4. The editor's internal operations run, including its own focus management.
        //   5. Your setTimeout callback is scheduled.
        //   6. The current call stack completes, allowing any microtasks to run.
        //   7. The browser may perform a render.
        //   8. Finally, your setTimeout callback runs, refocusing the original activeElement.
        //
        // The key here is that by using setTimeout, you're ensuring that your focus operation happens after
        // the editor has completely finished its own operations and any potential rerender.
        //
        // Without setTimeout, your activeElement.focus() call would happen immediately after
        // dispatchCommand, potentially being overridden by the editor's own focus management that
        // occurs as part of its clearing process. In essence, setTimeout is allowing you to
        // "cut in line" after the editor has done its thing, giving you the last word on where the focus should be. This is a common technique for working around focus issues in complex web applications, especially when dealing with third-party libraries that manage their own focus.
        //
        ///////////////////////////////////////////////////////////////////////////
        setTimeout(() => {
          activeElement.focus()
        }, 0)
      }
    }

    const focus = () => {
      editor.focus()
    }

    const api = { clear, focus }

    if (apiRef && 'current' in apiRef) {
      apiRef.current = api
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
