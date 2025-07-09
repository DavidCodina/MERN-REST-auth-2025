import { Fragment, useRef, useState, useEffect } from 'react'

// Custom imports
import { useIntersectionObserver } from './useIntersectionObserver' // 'useIntersectionObserver'
import { Animation } from './index'

/* ========================================================================
                              AnimationDemo2
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This version implements a custom useIntersectionObserver() instead of
// the react-intersection-observer package. It requires a little extra logic
// on the consuming side, but the hooks itself is much less magical.
// That said, I tried to add a delay to the custom hook, but it was very
// difficult, and ultimately gave up.
//
///////////////////////////////////////////////////////////////////////////

export const AnimationDemo2 = () => {
  const [shouldSkip, setShouldSkip] = useState(true)

  const [animation1Classes, setAnimation1Classes] = useState('')
  const [animation2Classes, setAnimation2Classes] = useState(
    'animate__backOutRight'
  )
  const [animation3Classes, setAnimation3Classes] = useState(
    'animate__fadeOutDown'
  )
  const [animation4Classes, setAnimation4Classes] = useState(
    'animate__fadeOutDown'
  )
  const [animation5Classes, setAnimation5Classes] = useState(
    'animate__backOutLeft'
  )

  /* ======================
        observers
  ====================== */

  const animation1Ref = useRef<HTMLDivElement | null>(null)
  const { entry: entry1, observer: _observer1 } = useIntersectionObserver(
    animation1Ref,
    {
      threshold: 0,
      // This says when you're scrolling down, do not trigger the
      // fade out animation until the bottom border is 300px past
      // the top edge. This way the user does not retrigger the
      // animation just from a quick down/up scroll.
      rootMargin: '300px 0px 0px 0px',

      ///////////////////////////////////////////////////////////////////////////
      //
      // The onChange was added to the original useIntersectionObserver:
      // https://usehooks-ts.com/react-hook/use-intersection-observer
      //
      // The problem is that when the component mounts it has to either show or
      // hide the content. The IntersectionObserver can't know anything until AFTER
      // the first render. This means that WE must make a choice which animation to
      // initially use, and when refreshing the page this ends up sometimes causing a blink.
      //
      // That said, we seem to be able to get around this issue by using an onChange
      // callback that runs whenever the entry changes. I'm not sure why this works
      // but it does. It doesn't actually skip the render where the isIntersecting value
      // is undefined. However, in this implementation the wrong initial animation
      // class is never set, and React is quick enough to set the correct initial
      // animation class BEFORE the user sees anything. Again, this seems strange
      // to me. I would've assumed that the UI would render once BEFORE any animation
      // class gets applied. This strange behavior may be because there's a difference
      // between rendering and painting the DOM in React (???), or maybe React ends
      // up batching these Javascript changes into a single render. It's confusing, but
      // this is the way...
      //
      // Then I changed the threshold to 0.4, and I got the blinking again for
      // the second article. Presumably, this IS because React shows the component on
      // first render, then hides it on the second render. Once again, we're back to
      // the point where WE actually need to explicitly decide what the intial styles
      // should be.
      //
      // But then, once the onChange is triggered, it might be different, causing yet
      // another blink. This can be remedied by:
      //
      //   if (hasMountedRef.current === false) {
      //     return
      //   }
      //
      // However, then the observer may not get triggered again for a while since its
      // triggered by thresholds and not scrolling. This can be remedied by stopping/starting
      // each observer manually, but then the <Animation> components disableOnMount timeout
      // will have likely expired.
      //
      // The real way to handle this is with a skip flag that can be passed into the hook,
      // and works with the hook's useEffect.
      //
      //
      ///////////////////////////////////////////////////////////////////////////

      onChange: (entry) => {
        if (entry.isIntersecting) {
          setAnimation1Classes('animate__backInLeft')
        } else {
          setAnimation1Classes('animate__backOutLeft')
        }
      }
    }
  )

  // If we don't do !!entry1?.isIntersecting, then it will be
  // undefined on first render, which is actually what we want.
  const _animation1InView = entry1?.isIntersecting

  /* =================== */

  const animation2Ref = useRef<HTMLDivElement | null>(null)
  const { entry: entry2, observer: _observer2 } = useIntersectionObserver(
    animation2Ref,
    {
      threshold: 0,
      rootMargin: '300px 0px 0px 0px',
      skip: shouldSkip,
      onChange: (entry) => {
        if (entry.isIntersecting) {
          setAnimation2Classes('animate__backInRight')
        } else {
          setAnimation2Classes('animate__backOutRight')
        }
      }
    }
  )

  const _animation2InView = entry2?.isIntersecting

  /* =================== */

  const animation3Ref = useRef<HTMLDivElement | null>(null)
  const { entry: entry3, observer: _observer3 } = useIntersectionObserver(
    animation3Ref,
    {
      threshold: 0,
      skip: shouldSkip,
      rootMargin: '300px 0px 0px 0px',
      // delay: 5000,
      onChange: (entry) => {
        if (entry.isIntersecting) {
          setAnimation3Classes('animate__fadeInUp')
        } else {
          setAnimation3Classes('animate__fadeOutDown')
        }
      }
    }
  )
  const _animation3InView = entry3?.isIntersecting

  /* =================== */

  const animation4Ref = useRef<HTMLDivElement | null>(null)
  const { entry: entry4, observer: _observer4 } = useIntersectionObserver(
    animation4Ref,
    {
      threshold: 0,
      skip: shouldSkip,
      rootMargin: '300px 0px 0px 0px',
      // delay: 5000,
      onChange: (entry) => {
        if (entry.isIntersecting) {
          setAnimation4Classes('animate__fadeInUp')
        } else {
          setAnimation4Classes('animate__fadeOutDown')
        }
      }
    }
  )
  const _animation4InView = entry4?.isIntersecting

  /* =================== */

  const animation5Ref = useRef<HTMLDivElement | null>(null)
  const { entry: entry5, observer: _observer5 } = useIntersectionObserver(
    animation5Ref,
    {
      threshold: 0,
      skip: shouldSkip,
      rootMargin: '300px 0px 0px 0px',

      onChange: (entry) => {
        if (entry.isIntersecting) {
          setAnimation5Classes('animate__backInLeft')
        } else {
          setAnimation5Classes('animate__backOutLeft')
        }
      }
    }
  )
  const _animation5InView = entry5?.isIntersecting

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
        className={animation1Classes}
        containerClassName='mb-6'
        containerStyle={{}}
        duration={1000}
        ref={animation1Ref}
      >
        {articles[0]}
      </Animation>

      <Animation
        className={animation2Classes}
        containerClassName='mb-6'
        containerStyle={{}}
        duration={1000}
        ref={animation2Ref}
      >
        {articles[1]}
      </Animation>

      <section className='flex gap-6'>
        <Animation
          className={animation3Classes}
          containerClassName='mb-6'
          containerStyle={{}}
          duration={2000}
          ref={animation3Ref}
        >
          {articles[2]}
        </Animation>

        <Animation
          className={animation4Classes}
          containerClassName='mb-6'
          containerStyle={{}}
          duration={2000}
          ref={animation4Ref}
        >
          {articles[3]}
        </Animation>
      </section>

      <Animation
        className={animation5Classes}
        containerClassName='mb-6'
        containerStyle={{}}
        duration={1000}
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
