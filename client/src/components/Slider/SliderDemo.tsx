import { Fragment } from 'react'
import { Slider } from './index'

const textShadow =
  '0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0), 0px 0px 1px rgb(0,0,0)'

const slides = (
  <>
    <Slider.Slide
      className='flex items-center justify-center bg-red-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      1
    </Slider.Slide>
    <Slider.Slide
      className='flex items-center justify-center bg-orange-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      2
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-amber-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      3
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-yellow-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      4
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-lime-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      5
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-green-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      6
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-emerald-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      7
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-teal-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      8
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-cyan-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      9
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-sky-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      10
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-blue-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      11
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-indigo-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      12
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-violet-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      13
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-purple-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      14
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-pink-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      15
    </Slider.Slide>

    <Slider.Slide
      className='flex items-center justify-center bg-rose-500 text-6xl font-black text-white'
      style={{ textShadow }}
    >
      16
    </Slider.Slide>
  </>
)

/* ========================================================================
                                SliderDemo
======================================================================== */

export const SliderDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <Slider
        className='mx-auto aspect-video max-w-[280px] overflow-hidden rounded-2xl border border-black shadow-lg'
        duration={500}
        // controls={false}
        // indicators={false}
      >
        {slides}
      </Slider>
    </Fragment>
  )
}
