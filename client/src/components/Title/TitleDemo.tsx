import { useEffect, useRef } from 'react'
import { Title } from './'

/* =============================================================================
                                TitleDemo
============================================================================= */

export const TitleDemo = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null)

  ////////////////////////////////////////////////////////////////////////////////
  //
  // <Title /> ref can be a standard useRef or a callback.
  //
  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
  //
  // const titleRefCallback = useCallback((node: HTMLHeadingElement | null) => {
  //   if (node) {
  //     console.log('node.tagName:', node.tagName)
  //     node.style.outline = '2px dashed red'
  //   }
  // }, [])
  //
  ////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (titleRef.current) {
      console.log('node.tagName:', titleRef.current.tagName)
      titleRef.current.style.outline = '2px dashed orang'
    }
  }, [])

  return (
    <Title
      // ref={titleRefCallback}
      ref={titleRef}
      as='h2'
      style={{
        marginBottom: 50,
        textAlign: 'center'
      }}
      // value='abc123' // Only allowed for as="input"

      // className='dark:text-red-500'
      // color='red'
    >
      Home
    </Title>
  )
}
