import { useEffect, useState } from 'react'

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/* ========================================================================
                                ImagePreloader
======================================================================== */
// Usage: <ImagePreloader images={images} delay={0} />

export const ImagePreloader = ({
  images,
  delay = 0
}: {
  images: string | string[]
  delay?: number
}) => {
  const [shouldPreload, setShouldPreload] = useState(() => {
    return typeof delay === 'number' && delay > 0 ? false : true
  })
  const imagesArray = typeof images === 'string' ? [images] : images

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldPreload(true)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [delay])

  /* ======================
        preloadImages()
  ====================== */

  const preloadImages = () => {
    if (
      !shouldPreload ||
      !isStringArray(imagesArray) ||
      imagesArray.length === 0
    ) {
      return null
    }

    return (
      <div
        aria-hidden={true}
        style={{
          height: 25,
          left: 0,
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          transform: 'scale(0.00001)',
          transformOrigin: 'top left',
          width: 25,
          zIndex: -9999
        }}
      >
        {imagesArray.map((image, index) => {
          return (
            <img // eslint-disable-line
              key={index}
              src={image}
              alt='Preloaded Image'
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                objectFit: 'cover'
              }}
            />
          )
        })}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return preloadImages()
}
