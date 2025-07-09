import { Fragment, useEffect } from 'react'

import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import Select from 'react-select' //??? Why are we also importing Select.
import { TriangleAlert } from 'lucide-react'

import { ReactSelect } from '../.'
import { sleep } from 'utils'

/* ======================

====================== */

const options = [
  { value: 'chocolate', label: 'Chocolate', emoji: '😋' },
  { value: 'strawberry', label: 'Strawberry', emoji: '🤩' },
  { value: 'vanilla', label: 'Vanilla', emoji: '😀' }
]

/* ======================
        schema
====================== */
// This approach seems to work well enough.
// Because we want the inital value to be null
// We need to tell Typescript that it's okay:
//
//   const defaultValues: FormValues = {
//     dessert: null as unknown as FormValues['dessert']
//   }

const schema = z.object({
  dessert: z.object(
    {
      value: z.string(),
      label: z.string(),
      emoji: z.string()
    },
    {
      required_error: 'Required.',
      invalid_type_error: 'Required.'
    }
  )
})

// The alternative is to use z.custom(), but that comes with a bunch
// of gotchas as noted below.
const _schema = z.object({
  dessert: z
    .custom<{ value: string; label: string; emoji: string } | null>(
      (value) => {
        if (!value || typeof value !== 'object') {
          return false
        }

        return true
      },
      {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Gotcha: By default, returning false/undefined in the above function will
        // cause any .refine() methods OUTSIDE of the top-level z.object() to not run.
        //
        // This actually makes sense. Think about a simple z.string().nonempty().
        // If there is no string at all, then there's no reason to call nonempty().
        // So, what we need is a way to make the final .refine() functions always run.
        // The actual solution is to make this non-fatal. This should be done for ALL
        // z.custom() implementations.
        //
        // In this case, we don't actually have a refine() outside of the top-level
        // z.object(), but in the fileList example this occurred. I'm just adding the
        // note here as well, since it's a best practice.
        //
        ///////////////////////////////////////////////////////////////////////////
        fatal: false,
        message: 'Required.'
      }
    )
    .refine(
      (value) => {
        // This is probably as strict as we want the check to be. Why?
        // Because in some cases the Select may be creatable, in which
        // case we don't want to check for custom properties.
        if (value && (!('value' in value) || !('label' in value))) {
          return false
        }
        return true
      },
      { message: 'Invalid type.' }
    )
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  dessert: null as unknown as FormValues['dessert']
}

/* ========================================================================

======================================================================== */

export const RHFControlledReactSelectDemo = () => {
  const {
    getValues,
    reset,
    handleSubmit,
    control,
    formState: {
      errors,
      isValid,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
    }
  } = useForm<FormValues>({
    defaultValues: defaultValues,
    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field compoents are designed
    // to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    console.log('onSubmit called.', data)
    await sleep(1000) // await API call
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, _e) => {
    const values = getValues()
    console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
      toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          {/* Why do we need Controller if it's not literally a controlled component?
          In other words, we can freely omit value={value} below. The reason is because
          of the unique differences of the onChange, which allows you to directly send
          a value to the library. In other words, react-select's onChange looks like this:

            onChange?: ((newValue: unknown, actionMeta: ActionMeta<unknown>) => void) | undefined

          But if we are using react-hook-form's register function to spread the onChange

            {...register('dessert')}
          
          That onChange looks like this:
            
            onChange: (event: { target: any;  type?: any; }) => Promise<void | boolean>;

          Therefore, what we actually need to do is use Controller to get react-hook-form's 
          onChange, then use react-select's onChange to pass newValue to react-hook-form's onChange:

            onChange={(newValue, _actionMeta) => onChange(newValue)} 
          
          Admittedly, it gets a little confusing, but this is the way.
          */}
          <Controller
            ///////////////////////////////////////////////////////////////////////////
            //
            // name is then passed into render as field.name. From
            // there, it's applied to the Select as name={name}.
            // It ends up being applied to the <input type='hidden'>, which is
            // the other <input> within react-select.
            //
            ///////////////////////////////////////////////////////////////////////////
            name='dessert'
            control={control}
            render={({ field /*, fieldState, formState */ }) => {
              const { onChange, onBlur, name, ref /*, value */ } = field
              // const { invalid, isTouched, isDirty, error } = fieldState

              return (
                <ReactSelect
                  //^ 1.  Controller props from react-hook-form (ultimately used by react-select)...
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(newValue, _actionMeta) => onChange(newValue)} // Unlike a normal onChange(), you don't get e.
                  //^ 2. Props specific to the ReactSelect component...
                  style={{}}
                  formGroupClassName='mb-3'
                  formGroupStyle={{}}
                  formText=''
                  formTextClassName=''
                  formTextStyle={{}}
                  size='sm'
                  label='Select Ice Cream'
                  labelRequired
                  labelClassName=''
                  labelStyle={{}}
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // If defaultValues.dessert is an object, react-hook-form's Typescript THINKS
                  // that each property in the object represents an independent field.
                  // Thus if we look at the typing for touchedFields we see:
                  //
                  //   dessert?: {
                  //     value?: boolean | undefined;
                  //     label?: boolean | undefined;
                  //     emoji?: boolean | undefined;
                  //   } | undefined;
                  //
                  // However, the reality is that the entire object is associated to only one
                  // registered field with a name of 'dessert'. Thus, when touched react-hook-form
                  // will actually contain:
                  //
                  //   touchedFields: { dessert: true }
                  //
                  // One hack to get around this is to use:
                  //
                  //  touched={touchedFields?.dessert as unknown as boolean}
                  //
                  ///////////////////////////////////////////////////////////////////////////
                  touched={touchedFields?.dessert as unknown as boolean}
                  error={errors?.dessert?.message}
                  //^ 3. Props specific to react-select...

                  isDisabled={false} //# .........................
                  defaultValue={defaultValues.dessert}
                  options={options}
                  id='top-level-container'
                  ///////////////////////////////////////////////////////////////////////////
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
                  inputId='inputId'
                  isClearable={true} // default is false
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
                        <div className='font-bold text-neutral-500'>
                          {DATA.label}
                        </div>
                        <div>{DATA.emoji}</div>
                      </div>
                    )
                  }}
                  // This renders in the menu
                  noOptionsMessage={(_obj) => {
                    // console.log(obj) // => {inputValue: ''}
                    return (
                      <div className='text-center font-bold text-neutral-500'>
                        Loading...
                      </div>
                    )
                  }}
                  placeholder='Select Ice Cream...'
                  //# isMulti={true}
                  //# hideSelectedOptions={true} // default is false
                  //# isMulti={false}
                  //# isSearchable={true} // default is true
                  //# openMenuOnFocus={true} // default is false
                  //# openMenuOnClick={false} // default is true
                />
              )
            }}
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
              // You could also add || !isDirty. In the case of an update form,
              // it still makes sense because there's no need to send an update if
              // nothing's actually been updated.
              disabled={isSubmitted && !isValid ? true : false}
              onClick={handleSubmit(onSubmit, onError)}
              type='button'
            >
              {isSubmitted && !isValid ? (
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
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}

/* ========================================================================

======================================================================== */

type SelectProps = { test?: any } & React.ComponentProps<typeof Select>

export const StandAloneSelect = (_props: SelectProps) => {
  return (
    <Select
      name='abc123'
      // Unlike a normal onChange(), you don't get e.
      onChange={(newValue, actionMeta) => {
        console.log({ newValue, actionMeta })
      }}
      isMulti={true}
      // className is not applied to the <input> itself, but to the top-level container.
      //className='p-0 border border-0'
      // https://react-select.com/styles#the-classnames-prop
      // https://react-select.com/styles#inner-components
      // react-select does not actually use a <select>. Instead it uses <input type='text' />
      classNames={{
        // control is not the top-level container, nor is it the input.
        control: (_state) => {
          return 'form-control form-control-sm'
        }
      }}
      styles={{
        control: (baseStyles, state) => {
          const focusStyles = {
            backgroundColor: '#fff',
            borderColor: '#86b7fe',
            boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
            color: '#212529',
            minHeight: 0,
            outline: 0,
            '&:hover': {
              borderColor: '#86b7fe'
            }
          }

          let styles: any = {
            ...baseStyles,
            borderColor: '#ced4da',
            minHeight: 0,
            paddingRight: 6,
            '&:hover': {
              borderColor: '#ced4da' // 206, 212, 218
            }
          }

          if (state.isFocused) {
            styles = { ...baseStyles, ...focusStyles }
          }

          //# We may need need to handle state.isDisabled as well.

          return styles
        }
      }}
      id='top-level-container'
      // https://stackoverflow.com/questions/61290173/react-select-how-do-i-resolve-warning-prop-id-did-not-match
      // next-dev.js:20 Warning: Prop `id` did not match.
      // Server: "react-select-4-live-region" Client: "react-select-3-live-region"
      // By default, this will generate an id of react-select-xxx-input on the associated <input>.
      // Adding an id prop will not affect this, and is instead applied to the top-level container.
      // To add an id to the actual input, use the inputId prop.
      instanceId={'xxx'} // instanceId={useId()}
      inputId='the-actual-input'
      options={options}
      // defaultMenuIsOpen={true} // default is false
      // defaultValue={options[0]}
      // autoFocus={true}
      // blurInputOnSelect={false} // default is false
      // closeMenuOnSelect={true} // default is true
      // controlShouldRenderValue={true} // default is true
      isClearable={true} // default is false
      formatOptionLabel={(data, _formatOptionLabelMeta) => {
        return (
          <div style={{ display: 'flex', gap: 5, lineHeight: 1 }}>
            <div className='font-bold text-neutral-500'>{data.label}</div>
            <div>{data.emoji}</div>
          </div>
        )
      }}
      // hideSelectedOptions={true} // default is false
      // isDisabled={true}
      // isMulti={false}
      // isSearchable={true} // default is true

      // This renders in the menu
      noOptionsMessage={(_obj) => {
        // console.log(obj) // => {inputValue: ''}
        return (
          <div className='text-center font-bold text-blue-500'>Loading...</div>
        )
      }}
      // openMenuOnFocus={true} // default is false
      // openMenuOnClick={false} // default is true
      placeholder='Select Ice Cream...'
    />
  )
}
