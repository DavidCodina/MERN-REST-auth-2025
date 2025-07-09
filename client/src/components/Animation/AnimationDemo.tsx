import { Fragment, useCallback, useState, useEffect } from 'react'
import { useInView } from './react-intersection-observer'

// Custom imports
import { Animation } from './index'

/* ========================================================================
                              AnimationDemo
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha: even though we're setting disableOnMount (default), we may
// see a blink in the UI when we do this:
//
// <Animation className={`${animation3InView ? ' animate__backInLeft' : ' animate__backOutLeft'}`} />
//
// This happens because the entry.isIntersecting is
// switching from false to true, which causes the animations to switch
// as well. Even though they have a duration of zero seconds, the result
// is still off-screen, then on-screen.
//
// The solution is to change the styles from WITHIN useInView's onChange.
// Beware: if you want to put a delay on the animations, use the useInView's
// delay, NOT the <Aniation>'s delay. Also note that useInView's delay is a
// "a minimum delay BETWEEN notifications", so it won't affect the first time.
//
// Another solution could entail using:
//
//   const [shouldSkip, setShouldSkip] = useState(true)
//
// Then set this in some of the hooks:
//
//   skip:        shouldSkip,
//   initialView: false
//
// Then create a useEffect:
//
//   useEffect(() => {
//     const handleScroll = () => {
//       if (shouldSkip) {
//         setShouldSkip(false)
//       }
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [shouldSkip])
//
// This approach is not as good in my opinion. However, we can use that approach
// ON TOP OF the other approach to conditionally set the initial animation state.
// Here, I'm only doing it for Section 2, just to emphasize that this is a bonus
// alternative. However, if you were doing this in production it's probably a best
// practice to do it for all others below section 2 as well.
//
///////////////////////////////////////////////////////////////////////////

export const AnimationDemo = () => {
  const [shouldSkip, setShouldSkip] = useState(true)
  const [animation2ClassName, setAnimation2ClassName] = useState(
    'animate__backOutRight'
  )

  /* ======================
        observers
  ====================== */

  const { ref: animation1Ref /* inView: animation1InView, entry */ } =
    useInView({
      threshold: 0,
      // This says when you're scrolling down, do not trigger the
      // fade out animation until the bottom border is 300px past
      // the top edge. This way the user does not retrigger the
      // animation just from a quick down/up scroll.
      //
      // Generally, I would avoid changing threshold from 0, and instead use rootMargin.
      rootMargin: '300px 0px 0px 0px',
      // skip: shouldSkip,
      // initialInView: true
      delay: 500,

      onChange: (_inView, entry) => {
        const container = entry.target
        const element = container.firstElementChild as HTMLElement

        if (entry.isIntersecting) {
          element?.classList.remove('animate__backOutLeft')
          element?.classList.add('animate__backInLeft')
        } else {
          element?.classList.remove('animate__backInLeft')
          element?.classList.add('animate__backOutLeft')
        }
      }
    })

  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
  const ref1 = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        //console.log(node)
      }
      animation1Ref(node)
    },
    [animation1Ref]
  )

  const { ref: animation2Ref /* inView: animation1InView, entry */ } =
    useInView({
      threshold: 0,
      rootMargin: '300px 0px 0px 0px',
      skip: shouldSkip,
      delay: 500,

      onChange: (_inView, entry) => {
        // const container = entry.target
        // const element = container.firstElementChild as HTMLElement

        if (entry.isIntersecting) {
          setAnimation2ClassName('animate__zoomIn')
        } else {
          setAnimation2ClassName('animate__zoomOut')
        }
      }
    })

  const { ref: animation3Ref /* inView: animation1InView, entry */ } =
    useInView({
      threshold: 0,
      rootMargin: '300px 0px 0px 0px',
      delay: 500,
      onChange: (_inView, entry) => {
        const container = entry.target
        const element = container.firstElementChild as HTMLElement

        if (entry.isIntersecting) {
          element?.classList.remove('animate__fadeOutDown')
          element?.classList.add('animate__fadeInUp')
        } else {
          element?.classList.remove('animate__fadeInUp')
          element?.classList.add('animate__fadeOutDown')
        }
      }
    })

  const { ref: animation4Ref /* inView: animation1InView, entry */ } =
    useInView({
      threshold: 0,
      rootMargin: '300px 0px 0px 0px',
      delay: 500,

      onChange: (_inView, entry) => {
        const container = entry.target
        const element = container.firstElementChild as HTMLElement

        if (entry.isIntersecting) {
          element?.classList.remove('animate__fadeOutDown')
          element?.classList.add('animate__fadeInUp')
        } else {
          element?.classList.remove('animate__fadeInUp')
          element?.classList.add('animate__fadeOutDown')
        }
      }
    })

  const { ref: animation5Ref /* inView: animation1InView, entry */ } =
    useInView({
      threshold: 0,
      rootMargin: '300px 0px 0px 0px',
      delay: 500,

      onChange: (_inView, entry) => {
        const container = entry.target
        const element = container.firstElementChild as HTMLElement

        if (entry.isIntersecting) {
          element?.classList.remove('animate__rollOut')
          element?.classList.add('animate__rollIn')
        } else {
          element?.classList.remove('animate__rollIn')
          element?.classList.add('animate__rollOut')
        }
      }
    })

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const handleScroll = () => {
      if (shouldSkip) {
        setShouldSkip(false)
      }

      if (!shouldSkip) {
        window.removeEventListener('scroll', handleScroll)
        return
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldSkip])

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <Animation
        className=''
        containerClassName='mb-6'
        containerStyle={{}}
        // disableOnMount={false}
        duration={1000}
        // delay={500}
        ref={ref1}
        // removeContainer={true} // Don't do this if using an observer.
      >
        {articles[0]}
      </Animation>

      <Animation
        className={animation2ClassName}
        containerClassName='mb-6'
        containerStyle={{}}
        //delay={500}
        duration={1000}
        ref={animation2Ref}
      >
        {articles[1]}
      </Animation>

      <section className='flex gap-6'>
        <Animation
          className=''
          containerClassName='mb-6'
          containerStyle={{}}
          duration={1000}
          //delay={500}
          ref={animation3Ref}
        >
          {articles[2]}
        </Animation>

        <Animation
          className=''
          containerClassName='mb-6'
          containerStyle={{}}
          duration={1000}
          //delay={500}
          ref={animation4Ref}
        >
          {articles[3]}
        </Animation>
      </section>

      <Animation
        className=''
        containerClassName='mb-6'
        containerStyle={{}}
        duration={1000}
        // delay={500}
        ref={animation5Ref}
      >
        {articles[4]}
      </Animation>
    </Fragment>
  )
}

/* ========================================================================
                              articles
======================================================================== */

const articles = [1, 2, 3, 4, 5].map((article) => {
  const renderParagraphs = (article: number) => {
    if (article === 3 || article === 4) {
      return [1].map((item) => {
        return (
          <p key={item}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
            voluptatem temporibus ducimus consectetur tempore, vel obcaecati
            quisquam aliquid culpa inventore, aut molestias doloribus
            repellendus. Cupiditate sint enim repellendus fuga, perferendis non
            voluptatum delectus fugiat illo maiores hic. Sed tempora laborum
            fugit magni. Sit dolorum delectus eaque omnis libero beatae
            reprehenderit sint ea labore earum est id ipsa natus fuga a
            explicabo atque facere consequatur, aut ex provident! Rerum expedita
            sunt beatae quisquam illum. Consequatur incidunt unde quia vel rem
            eum nam distinctio, tempora nesciunt earum? Eaque nam quae
            voluptatibus quia ullam recusandae, nisi nulla enim reprehenderit
            officia, animi suscipit ex.
          </p>
        )
      })
    }

    return [1, 2, 3].map((item) => {
      return (
        <p key={item}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          voluptatem temporibus ducimus consectetur tempore, vel obcaecati
          quisquam aliquid culpa inventore, aut molestias doloribus repellendus.
          Cupiditate sint enim repellendus fuga, perferendis non voluptatum
          delectus fugiat illo maiores hic. Sed tempora laborum fugit magni. Sit
          dolorum delectus eaque omnis libero beatae reprehenderit sint ea
          labore earum est id ipsa natus fuga a explicabo atque facere
          consequatur, aut ex provident! Rerum expedita sunt beatae quisquam
          illum. Consequatur incidunt unde quia vel rem eum nam distinctio,
          tempora nesciunt earum? Eaque nam quae voluptatibus quia ullam
          recusandae, nisi nulla enim reprehenderit officia, animi suscipit ex.
        </p>
      )
    })
  }
  return (
    <article
      key={article}
      className='rounded-lg border border-gray-300 bg-white p-3 shadow'
    >
      <h3 className='fw-bold text-blue-500'>Section {article}:</h3>

      {renderParagraphs(article)}
    </article>
  )
})
