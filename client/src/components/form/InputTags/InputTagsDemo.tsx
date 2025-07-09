import { useEffect, useState, useRef } from 'react'
import { InputTags, TagsInputAPI } from './'

/* ========================================================================

======================================================================== */

export const InputTagsDemo = () => {
  const apiRef = useRef<TagsInputAPI | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [isDisabled, setIsDisabled] = useState(false)

  const [initialValue, setInitialValue] = useState<string[]>([])

  /* ======================
          useEffect()
  ====================== */

  useEffect(() => {
    setTimeout(() => {
      setInitialValue(['React', 'Angular', 'Svelte', 'Solid'])
    }, 2500)
  }, [])

  /* ======================
          useEffect()
  ====================== */

  // useEffect(() => {
  //   console.log('\ninputRef.current:')
  //   console.dir(inputRef.current)
  // }, [])

  /* ======================
       renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div className='mb-6 flex justify-center gap-4'>
        <button
          className='btn-blue btn-sm'
          onClick={() => {
            apiRef.current?.clear()
            setTags([])
          }}
          style={{ minWidth: 100 }}
        >
          Clear Tags
        </button>

        <button
          className='btn-blue btn-sm'
          onClick={() => {
            setIsDisabled((v) => !v)
          }}
          style={{ minWidth: 100 }}
        >
          {isDisabled ? 'Enable' : 'Disable'}
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderControls()}

      <form
        className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
        style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <InputTags
          apiRef={apiRef}
          // ref={inputRef}
          ref={(node) => {
            inputRef.current = node
          }}
          inputId='input-id'
          className=''
          disabled={isDisabled}
          editable={true}
          formGroupClassName='mb-4'
          formText='Add one or more tags.'
          formTextClassName='text-xs'
          initialValue={initialValue}
          label='Frameworks:'
          labelClassName='text-sm font-bold text-blue-500'
          labelRequired
          onBlur={(_e) => {
            // console.log('onBlur triggered.')
          }}
          onChange={(newValue) => {
            setTags(newValue)
          }}
          max={10}
          onMaxExceeded={(max) => {
            alert(`Maximum tags allowed: ${max}.`)
          }}
          placeholder='Add a tag...'
          size='sm'
          tagClassName='bg-neutral-50 data-[highlighted]:bg-blue-50'
          // touched={true}
          // error={'Your tags suck!'}
        />

        {/* =====================
              Submit Button
        ===================== */}

        <button
          className='btn-green btn-sm block w-full'
          // You could also add || !isDirty. In the case of an update form,
          // it still makes sense because there's no need to send an update if
          // nothing's actually been updated.
          // disabled={isSubmitted && !isValid ? true : false}
          //# onClick={handleSubmit(onSubmit, onError)}
          type='button'
        >
          Submit
        </button>
      </form>

      <div
        className={`mx-auto max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4 text-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}
      >
        {JSON.stringify(tags, null, 2)}
      </div>
    </>
  )
}
