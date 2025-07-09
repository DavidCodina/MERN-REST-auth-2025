import { Fragment, useState } from 'react'
import { useDebouncedValue } from './index'

/* ========================================================================

======================================================================== */

export const UseDebouncedValueDemo = () => {
  const [value, setValue] = useState('')
  const [debounced] = useDebouncedValue(value, 500 /*, { leading: true } */) // 200 is more realistic

  return (
    <Fragment>
      <section className='mx-auto max-w-lg rounded-lg border border-gray-300 bg-[#fafafa] p-4 shadow'>
        <div>
          <label
            className='mb-1 w-full text-sm font-bold text-blue-500'
            htmlFor='my-input'
          >
            Enter value to see debounce effect:
          </label>
          <input
            id='my-input'
            className='block w-full rounded border px-2 py-1'
            onChange={(e) => setValue(e.currentTarget.value)}
            value={value}
          />
          <div className='mb-4 text-[12px] text-gray-400'>
            Debounced value will output below.
          </div>
        </div>

        <div className='text-center font-bold text-[#409]'>{debounced}</div>
      </section>
    </Fragment>
  )
}
