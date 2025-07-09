import { SliderProvider } from './SliderContext'
import { Slider } from './Slider'
import { Slide } from './Slide'

/* ========================================================================
                              ParentWithProvider
======================================================================== */
//# Type the props here...

const SliderWithProvider = (props: any) => {
  return (
    <SliderProvider>
      <Slider {...props} />
    </SliderProvider>
  )
}

SliderWithProvider.Slide = Slide

// Alias the ParentWithPovider as the Parent. The consumer
// can be blisfully unaware that they are actually using
// Parent that is wrappen in a Context.
export { SliderWithProvider as Slider }
