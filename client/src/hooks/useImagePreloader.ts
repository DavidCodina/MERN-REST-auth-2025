import { useEffect, useRef } from 'react'

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The core problem stems from Chrome's optimization strategies for image loading.
// In an effort to improve performance, Chrome may choose not to preload certain images
// based on various CSS properties. This can lead to the undesirable "flicker" effect when
// images are needed but haven't been loaded yet.
//
///////////////////////////////////////////////////////////////////////////

// Usage: useImagePreloader(images, 0)

export const useImagePreloader = (
  images: string | string[],
  delay: number = 0
) => {
  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const imagesArray = typeof images === 'string' ? [images] : images

    if (typeof document === 'undefined' || !isStringArray(imagesArray)) {
      return
    }

    const preloadImages = () => {
      const div = document.createElement('div')
      divRef.current = div

      div.setAttribute('aria-hidden', 'true')

      // This will only hide the div if there was something like a PageContainer, and it
      // had a backgroundColor on it. While this doesn't hurt, a safer approach is to use
      // 'scale(0.001)'
      div.style.zIndex = '-9999'

      div.style.position = 'fixed'
      div.style.top = '0px'
      div.style.left = '0px'
      div.style.pointerEvents = 'none'
      div.style.height = '25px' // Images won't preload in Chrome if too small.
      div.style.width = '25px' // Images won't preload in Chrome if too small.

      // div.style.clip       = 'rect(0, 0, 0, 0)' // Images won't preload in Chrome if you do this.
      // div.style.width      = '1px'              // Images won't preload in Chrome if you do this.
      // div.style.height     = '1px'              // Images won't preload in Chrome if you do this.
      // div.style.overflow   = 'hidden'           // Images won't preload in Chrome if you do this.
      // div.style.visibility = 'hidden'           // Images won't preload in Chrome if you do this.
      // div.style.opacity = '0'                   // Images won't preload in Chrome if you do this.
      // div.style.transform = 'translateX(-100%)' // Images won't preload in Chrome if you do this.
      div.style.transform = 'scale(0.00001)'
      div.style.transformOrigin = 'top left'

      imagesArray.forEach((src) => {
        const img = document.createElement('img')
        img.src = src
        img.alt = 'Preloaded image'
        img.style.height = '100%'
        img.style.width = '100%'
        img.style.position = 'absolute'
        img.style.objectFit = 'cover' // Strangely this is also necessary.
        div.appendChild(img)
      })

      document.body.insertBefore(div, document.body.firstChild)
    }

    const timeoutId = setTimeout(preloadImages, delay)

    return () => {
      clearTimeout(timeoutId)
      if (divRef.current && document.body.contains(divRef.current)) {
        document.body.removeChild(divRef.current)
      }
    }
  }, [images, delay])
}
