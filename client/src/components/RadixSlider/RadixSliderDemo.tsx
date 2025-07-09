import { useState, useEffect } from 'react'
import { RadixSlider } from './'

/* ========================================================================
                                RadixSliderDemo
======================================================================== */

export const RadixSliderDemo = () => {
  const [value, setValue] = useState([25, 75])
  const [debouncedValue, setDebouncedValue] = useState([25, 75])
  const [sliderTouched, setSliderTouched] = useState(false)
  const [sliderError, setSliderError] = useState('')

  /* ======================
        validateSlider()
  ====================== */

  const validateSlider = (val?: number[]) => {
    val = Array.isArray(val) ? val : debouncedValue
    let error = ''

    if (
      !val ||
      !Array.isArray(val) ||
      typeof val[0] !== 'number' ||
      typeof val[1] !== 'number'
    ) {
      error = 'Invalid type.'
      setSliderError(error)
      return error
    }

    const min = val[0]
    const max = val[1]

    if (min < 25 || max > 75) {
      error = 'Range must be between 25 and 75.'
      setSliderError(error)
      return error
    }

    setSliderError('')
    return ''
  }

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    console.log('debouncedValue:', debouncedValue)
  }, [debouncedValue])

  /* ======================
          return
  ====================== */
  // Uncontrolled:
  //
  // return (
  //   <form className='rounded-lg border border-neutral-400 bg-white p-4'>
  //     <RadixSlider
  //       defaultValue={[25, 75]}
  //       style={{}}
  //       className={`
  //       [--radix-slider-height:15px]
  //       [--radix-slider-range-bg:--color-indigo-700]
  //       [--radix-slider-track-bg:--color-sky-300]
  //       `}
  //       min={0}
  //       max={100}
  //       step={1}
  //       onValueCommit={(value) => {
  //         console.log(value)
  //       }}
  //     />
  //   </form>
  // )

  return (
    <form className='rounded-lg border border-neutral-400 bg-white p-4'>
      <RadixSlider
        id='abc123'
        // sliderOnly
        showToolTipWhen='hover-focus'
        error={sliderError}
        touched={sliderTouched}
        label='Select Price Range:'
        labelRequired
        labelClassName='text-blue-500 font-black'
        labelStyle={{}}
        formText='Valid ranges are between 25 & 75.'
        formTextClassName='text-xs text-neutral-400 font-medium'
        // formTextStyle={{ }}
        // formGroupClassName='outline-dashed outline-red-500'
        formGroupStyle={{}}
        defaultValue={[0, 100]}
        // disabled={true}
        className={`[--radix-slider-height:15px] [--radix-slider-range-bg:--color-indigo-700] [--radix-slider-track-bg:--color-sky-300]`}
        min={0}
        max={100}
        step={1}
        onValueChange={(newValue) => {
          setValue(newValue)

          // Validating here is optional, but it's more reactive if we do it here also.
          if (sliderTouched) {
            validateSlider(newValue)
          }
        }}
        onValueCommit={(newValue) => {
          setDebouncedValue(newValue)

          if (sliderTouched) {
            validateSlider(newValue)
          }
        }}
        onBlur={(_e) => {
          setSliderTouched(true)
          validateSlider()
        }}
        value={value}
      />
    </form>
  )
}
