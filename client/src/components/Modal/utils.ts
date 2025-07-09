/* ======================
      stopEvents()
====================== */

export function stopEvents(eventType = 'click', duration = 500) {
  function stopEvent(e: Event) {
    e.stopPropagation()
    e.stopImmediatePropagation()
    e.preventDefault()
  }

  window.addEventListener(eventType, stopEvent, true)
  setTimeout(() => {
    window.removeEventListener(eventType, stopEvent, true)
  }, duration)
}

/* ======================
    createModalRoot()
====================== */
// As an alternative to accepting a portalId, we can use the
// default portal (i.e., defaultModalRoot). Once created, the DOM
// element is never removed. This ensures it's not accidentally
// destroyed while  other modals are still using it. Though, I suppose
// we could check for children.

export const createModalRoot = (
  portalId: string | undefined,
  modalRootId: string
) => {
  if (portalId) {
    return portalId
  }

  const modalRootFound = !!document.getElementById(modalRootId)
  if (!modalRootFound) {
    const root = document.getElementById('root') as HTMLDivElement
    if (!root) {
      console.warn(
        `createModalRoot attempted to create a modalRoot, but could not find a <div id='root'> to place it after.`
      )
      return portalId
    }
    const modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', modalRootId)
    root.parentNode?.insertBefore(modalRoot, root.nextSibling)
  }
  return modalRootId
}

/* ======================
    removeModalRoot()
====================== */

export const removeModalRoot = (modalRootId: string) => {
  const modalRoot = document.getElementById(modalRootId)

  if (modalRoot) {
    if (modalRoot?.children?.length === 0) {
      console.log(
        `<div id="${modalRootId}"> has no children. Now removing:`,
        modalRoot
      )
      modalRoot?.remove()
    }
  }
}
