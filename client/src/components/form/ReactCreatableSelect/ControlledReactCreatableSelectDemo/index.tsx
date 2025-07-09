import {
  Dispatch,
  SetStateAction,
  Fragment,
  useState,
  useEffect,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { ReactCreatableSelect, SelectOption, SelectInstance } from '../.'
import { sleep } from 'utils'

/* ======================
        options
====================== */
// react-select types it's options (and value) very loosely.
// However, they always have a `value` and `label`.
// SelectOption is NOT used in the custom ReactSelect typings,
// but I've still created it and exported it for the consuming side.
// Here the emoji property is used within the formatOptionLabel prop.
const options: SelectOption[] = [
  { value: 'chocolate', label: 'Chocolate', emoji: '😋' },
  { value: 'strawberry', label: 'Strawberry', emoji: '🤩' },
  { value: 'vanilla', label: 'Vanilla', emoji: '😀' },

  { value: 'vomit', label: 'Vomit', emoji: '🤮' }, // filtered out.

  { value: 'AAA', label: 'AAA', emoji: '😀' },
  { value: 'BBB', label: 'BBB', emoji: '😀' },
  { value: 'CCC', label: 'CCC', emoji: '😀' },
  { value: 'DDD', label: 'DDD', emoji: '😀' },
  { value: 'EEE', label: 'EEE', emoji: '😀' },
  { value: 'FFF', label: 'FFF', emoji: '😀' },
  { value: 'GGG', label: 'GGG', emoji: '😀' },
  { value: 'HHH', label: 'HHH', emoji: '😀' },
  { value: 'III', label: 'III', emoji: '😀' },
  { value: 'JJJ', label: 'JJJ', emoji: '😀' },
  { value: 'KKK', label: 'KKK', emoji: '😀' },
  { value: 'LLL', label: 'LLL', emoji: '😀' },
  { value: 'MMM', label: 'MMM', emoji: '😀' },
  { value: 'NNN', label: 'NNN', emoji: '😀' },
  { value: 'OOO', label: 'OOO', emoji: '😀' },
  { value: 'PPP', label: 'PPP', emoji: '😀' },
  { value: 'QQQ', label: 'QQQ', emoji: '😀' },
  { value: 'RRR', label: 'RRR', emoji: '😀' },
  { value: 'SSS', label: 'SSS', emoji: '😀' },
  { value: 'TTT', label: 'TTT', emoji: '😀' },
  { value: 'UUU', label: 'UUU', emoji: '😀' },
  { value: 'VVV', label: 'VVV', emoji: '😀' },
  { value: 'WWW', label: 'WWW', emoji: '😀' },
  { value: 'XXX', label: 'XXX', emoji: '😀' },
  { value: 'YYY', label: 'YYY', emoji: '😀' },
  { value: 'ZZZ', label: 'ZZZ', emoji: '😀' }
]

type Option = (typeof options)[number]
type MaybeOption = Option | null

/* ========================================================================
                    ControlledReactCreatableSelectDemo 
======================================================================== */

export const ControlledReactCreatableSelectDemo = () => {
  const selectRef = useRef<SelectInstance | null>(null)

  // react-select tyeps the value passed back from its onChange as unknown.
  // This is becasue it could be a single option, an array of options, or null.
  // If react-select typed it any narrower, it's possible that we would run
  // into type conflicts when consuming the component. That said, I've typed
  // it more strictly here, which then necessitates typecasting where the
  // setter is used.
  const [selectValue, setSelectValue] = useState<MaybeOption>(null) // ???
  const [selectTouched, setSelectTouched] = useState(false)
  const [selectError, setSelectError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = selectError !== ''
  const allTouched = selectTouched

  /* ======================
      validateSelect()
  ====================== */

  const validateSelect = (value?: MaybeOption) => {
    value = typeof value !== 'undefined' ? value : selectValue

    if (!value) {
      setSelectError('Selction required.')
      return 'Selction required'
    }

    setSelectError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = async () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [setSelectTouched]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: ((...args: any[]) => string | Promise<string>)[] = [
      validateSelect
    ]

    const validationResults = await Promise.all(
      validators.map((validator) => validator())
    )

    validationResults.forEach((error) => {
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      // console.log('Returning early from handleSubmit() because of errors.', errors)
      toast.error('Form validation errors found.')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    const { isValid } = await validate()
    if (!isValid) {
      return
    }

    const requestData = { selectValue }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    } finally {
      setSelectValue(null)
      setSelectTouched(false)
      setSelectError('')
      setIsSubmitting(false)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    console.log('selectValue is now:', selectValue)
  }, [selectValue])

  /* ======================
        useEffect()
  ====================== */
  // The ref that we get back from react-select is Select2.
  // react-select is built using a class-based component, which naturally provides
  // a different way of handling refs compared to function components with hooks.
  // Class-based components expose all sort of class methods that make it almost like
  // an API for programmatically interacting with the component.
  //
  // By default, function-based component refs are nothing like this.
  // To get similar logic from a function component, it needs to implement
  // useImperativeHandle

  useEffect(() => {
    if (!selectRef.current) {
      return
    }

    console.dir(selectRef.current)
  }, [])

  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The props CreatableSelect include all the props from the standard Select component.
  // as well as
  //
  //   allowCreateWhileLoading
  //   createOptionPosition
  //   formatCreateLabel
  //   isValidNewOption
  //   getNewOptionData
  //   onCreateOption
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <Fragment>
      <form
        className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <ReactCreatableSelect
          createOptionPosition='last'
          autoFocus={false} // eslint-disable-line
          // Here the default is true, when isClearable is true.
          // If isClearable is false, then the value is always false.
          backspaceRemovesValue={true}
          closeMenuOnSelect={true}
          // Passing true should work, but it doesn't. It's a known issue:
          // https://github.com/JedWatson/react-select/issues/5675
          // closeMenuOnScroll={(e) => {
          //   const target = e.target as HTMLElement
          //   if (target && target.className?.includes('MenuList')) {
          //     return false
          //   }
          //   return true
          // }}

          controlShouldRenderValue={true} // Default: true
          disabled={false}
          error={selectError}
          escapeClearsValue={false} // Default: false
          ///////////////////////////////////////////////////////////////////////////
          //
          // Gotcha: When you provide a custom filterOption, it overrides the
          // default filtering behavior, which can lead to unexpected results.
          // For example, this is a naive implementation that actually will break
          // the isSearchable default behavior:
          //
          //   filterOption={(option) => {
          //     return option.value !== 'vomit'
          //   }}
          //
          // Thus we also need to manually implement a search filter now.
          //
          ///////////////////////////////////////////////////////////////////////////

          filterOption={(option, inputValue) => {
            // Check if the option value is not 'vomit'
            const isNotVomit = option.value !== 'vomit'
            // Check if the option label includes the search input
            const matchesSearch = option.label
              .toLowerCase()
              .includes(inputValue.toLowerCase())
            return isNotVomit && matchesSearch
          }}
          formatOptionLabel={(data, _formatOptionLabelMeta) => {
            // Normally, the react-select would know what data and formatOptionLabelMeta are.
            // However, when we abstract the actual Select implementation into the ReactSelect,
            // then it breaks the communication. We can do a hacky workaround like this:
            const DATA = data as {
              value: string
              label: string
              emoji: string
            }

            return (
              <div style={{ display: 'flex', gap: 5, lineHeight: 1 }}>
                <div className='fw-bold text-secondary'>{DATA.label}</div>
                <div>{DATA.emoji}</div>
              </div>
            )
          }}
          formGroupClassName='mb-3'
          formGroupStyle={{}}
          formText=''
          formTextClassName=''
          formTextStyle={{}}
          hideSelectedOptions={false} // default is false
          id='top-level-container' // The id to set on the SelectContainer component.
          inputId='inputId' // The id of the search input
          ///////////////////////////////////////////////////////////////////////////
          //
          // Define an id prefix for the select components e.g. {your-id}-value
          //
          // https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
          // next-dev.js:20 Warning: Prop `id` did not match.
          // Server: "react-select-4-live-region" Client: "react-select-3-live-region"
          // By default, this will generate an id of react-select-xxx-input on the associated <input>.
          // Adding an id prop will not affect this, and is instead applied to the top-level container.
          // To add an id to the actual input, use the inputId prop.
          //
          ///////////////////////////////////////////////////////////////////////////
          instanceId={'instanceId'} // instanceId={useId()}
          isClearable={true} // default is false
          isDisabled={false} // alias for disabled
          // When true, shows a nifty triple-dot loadding animation.
          isLoading={false}
          isRtl={false} // Default: false
          isSearchable={true} // Default: true
          label='Select Ice Cream'
          labelRequired
          labelClassName='text-blue-500 font-bold'
          labelStyle={{}}
          // loadingMessage="It's loading..." // Async only!

          // ⚠️⚠️⚠️  I'm not sure what this does. It doesn't seem to actually set the minimum menu height.
          minMenuHeight={500}
          // maxMenuHeight={200} // Set the max menu height

          menuPlacement='auto' // Default: 'auto'
          // The default seems to be 'absolute'.
          // When 'absolute', it will scroll the viewport so the men is visible.
          // If fixed, it will flip the menu instead. The flipping only happens
          // when the menu is first opened.
          menuPosition='absolute'
          menuPortalTarget={null}
          menuShouldBlockScroll={false} // Default: false
          menuShouldScrollIntoView={true} // Default: true (at least when menuPosition is 'absolute').
          name='select'
          // This renders in the menu. Here we're assuming that if options is an
          // empty array, that the options are then loading. It would be better
          // to do this dynamically.
          noOptionsMessage={(_obj) => {
            // console.log(obj) // => {inputValue: ''}
            return (
              <div className='fw-bold text-primary text-center'>Loading...</div>
            )
          }}
          onBlur={async () => {
            await validateSelect()

            if (!selectTouched) {
              setSelectTouched(true)
            }

            // ✅ console.dir(e.target)
            // ❌ console.log(e.target)
          }}
          onChange={(value, _actionMeta) => {
            setSelectValue(value as MaybeOption)

            if (selectTouched) {
              validateSelect(value as MaybeOption)
            }
          }}
          onMenuOpen={() => {
            console.log('onMenuOpen')
          }}
          onMenuClose={() => {
            console.log('onMenuClose')
          }}
          openMenuOnFocus={false} // Default: false
          // By default you can also open/close the menu with spacebar/escape.
          openMenuOnClick={true} // Default: true
          options={options}
          // By default this is 1. On a Mac use up/down arrow keys wih the fn button pressed.
          pageSize={1}
          ref={selectRef}
          size='sm'
          style={{}}
          touched={selectTouched}
          placeholder={
            <div className='inline rounded-lg border border-neutral-300 bg-neutral-100 px-2 text-xs font-semibold'>
              <span className='text-red-500'>S</span>
              <span className='text-orange-500'>e</span>
              <span className='text-yellow-500'>l</span>
              <span className='text-green-500'>e</span>
              <span className='text-blue-500'>c</span>
              <span className='text-purple-500'>t</span>
              <span className='text-red-500'> </span>
              <span className='text-orange-500'>I</span>
              <span className='text-yellow-500'>c</span>
              <span className='text-green-500'>e</span>
              <span className='text-blue-500'> </span>
              <span className='text-purple-500'>C</span>
              <span className='text-red-500'>r</span>
              <span className='text-orange-500'>e</span>
              <span className='text-yellow-500'>a</span>
              <span className='text-green-500'>m</span>
              <span className='text-blue-500'>.</span>
              <span className='text-purple-500'>.</span>
              <span className='text-red-500'>.</span>
            </div>
          }
          value={selectValue}
        />

        {/* =====================
              Submit Button
        ===================== */}

        {isSubmitting ? (
          <button
            className='btn-green btn-sm block w-full'
            disabled
            type='button'
          >
            <span
              aria-hidden='true'
              className='spinner-border spinner-border-sm mr-2'
              role='status'
            ></span>
            Submitting...
          </button>
        ) : (
          <button
            className='btn-green btn-sm flex w-full'
            disabled={allTouched && isErrors ? true : false}
            onClick={handleSubmit}
            type='button'
          >
            {allTouched && isErrors ? (
              <Fragment>
                <TriangleAlert className='pointer-events-none size-[1.25em]' />{' '}
                Please Fix Errors...
              </Fragment>
            ) : (
              'Submit'
            )}
          </button>
        )}
      </form>

      <pre className='mx-auto mb-6 max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4'>
        {JSON.stringify(selectValue, null, 2)}
      </pre>
    </Fragment>
  )
}
