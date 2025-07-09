import * as React from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { cn } from 'utils'
import { Button } from 'components'
import { createTodo } from '../createTodo'

type CreateTodoFormProps = React.ComponentProps<'form'>

/* ========================================================================
                              CreateTodoForm
======================================================================== */

const CreateTodoForm = ({
  className = '',
  style = {},
  ...otherProps
}: CreateTodoFormProps) => {
  const navigate = useNavigate()

  const [title, setTitle] = React.useState('')
  const [titleTouched, setTitleTouched] = React.useState(false)
  const [titleError, setTitleError] = React.useState('')

  const [body, setBody] = React.useState('')
  const [bodyTouched, setBodyTouched] = React.useState(false)
  const [bodyError, setBodyError] = React.useState('')

  const [creatingTodo, setCreatingTodo] = React.useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors = titleError !== '' || bodyError !== ''
  const allTouched = titleTouched && bodyTouched

  /* ======================
      validateTitle()
  ====================== */

  const validateTitle = (value?: string) => {
    value = typeof value === 'string' ? value : title
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'A title is required.'
      setTitleError(error)
      return error
    }

    // Otherwise unset the title error in state and return ''
    setTitleError('')
    return ''
  }

  /* ======================
      validateBody()
  ====================== */

  const validateBody = (_value?: string) => {
    // value = typeof value === 'string' ? value : body
    // let error = ''

    // If there were validation rules, they'd go here.
    // It's still a good idea to create this function because
    // it allows us reset errors that were set by the server.
    // It's just good because it future proofs the form

    setBodyError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
      setTitleTouched,
      setBodyTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateTitle, validateBody]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      // console.log('Returning early from handleSubmit() because of errors.', errors)
      toast.error('Form validation errors found!')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
      handleCreateTodo()
  ====================== */

  const handleCreateTodo = async () => {
    setCreatingTodo(true)

    const requestBody = {
      title,
      ...(body ? { body } : {})
    }

    // No need for try/catch here because the API function catches internally.
    const { success, data, errors } = await createTodo(requestBody)

    if (success == true && data) {
      setTitle('')
      setTitleTouched(false)
      setTitleError('')
      setBody('')
      setBodyTouched(false)
      setBodyError('')
      toast.success('The todo has been created!')
      navigate('/todos')
    } else {
      if (errors) {
        if (errors.title) {
          setTitleError(errors.title)
        }

        if (errors.body) {
          setBodyError(errors.body)
        }
      }

      toast.error('Unable to create the todo!')
    }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const { isValid } = validate()

    if (!isValid) {
      return
    }

    handleCreateTodo()
  }

  /* ======================
    renderCreateTodoForm()
  ====================== */

  const renderCreateTodoForm = () => {
    return (
      <form
        {...otherProps}
        className={cn(
          'mx-auto mb-6 overflow-hidden rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow',
          className
        )}
        style={{ maxWidth: 800, ...style }}
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className='mb-4'>
          <label className='text-sm font-bold text-blue-500' htmlFor='title'>
            Title <sup className='text-red-500'>*</sup>
          </label>

          <input
            autoComplete='off'
            className={cn(
              'form-control form-control-sm',
              titleError && 'is-invalid',
              titleTouched && !titleError && 'is-valid'
            )}
            id='title'
            name='title'
            onBlur={(e) => {
              if (!titleTouched) {
                setTitleTouched(true)
              }
              validateTitle(e.target.value)
            }}
            onChange={(e) => {
              setTitle(e.target.value)

              if (titleTouched) {
                validateTitle(e.target.value)
              }
            }}
            placeholder='Title...'
            spellCheck={false}
            type='text'
            value={title}
          />

          <div className='invalid-feedback'>{titleError}</div>
        </div>

        <div className='mb-4'>
          <label className='text-sm font-bold text-blue-500' htmlFor='body'>
            Body
          </label>

          <textarea
            autoComplete='off'
            className={cn(
              'form-control form-control-sm',
              bodyError && 'is-invalid',
              bodyTouched && !bodyError && 'is-valid'
            )}
            id='body'
            name='body'
            onBlur={(e) => {
              if (!bodyTouched) {
                setBodyTouched(true)
              }
              validateBody(e.target.value)
            }}
            onChange={(e) => {
              setBody(e.target.value)

              if (bodyTouched) {
                validateBody(e.target.value)
              }
            }}
            placeholder='Optional description...'
            spellCheck={false}
            style={{ height: 150 }}
            value={body}
          />

          <div className='invalid-feedback'>{bodyError}</div>
        </div>

        {creatingTodo ? (
          <Button
            className='btn-green btn-sm flex w-full'
            loading={creatingTodo}
            type='button'
          >
            Creating Todo...
          </Button>
        ) : (
          <Button
            className='btn-green btn-sm flex w-full'
            // The submit button is disabled here when there are errors, but
            // only when all fields have been touched. All fields will have
            // been touched either manually or after the first time the button
            // has been clicked.
            disabled={allTouched && isErrors ? true : false}
            onClick={handleSubmit}
            type='button'
          >
            {allTouched && isErrors ? (
              <>
                <TriangleAlert className='pointer-events-none size-[1.25em]' />{' '}
                Please Fix Errors...
              </>
            ) : (
              'Create Todo'
            )}
          </Button>
        )}
      </form>
    )
  }

  /* ======================
          return
  ====================== */

  return renderCreateTodoForm()
}

export { CreateTodoForm }
