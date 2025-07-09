import * as React from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { cn } from 'utils'
import { Alert, Button, Spinner } from 'components'
import { getTodo } from '../getTodo'
import { updateTodo } from '../updateTodo'
import { Todo } from 'types'

type UpdateTodoFormProps = React.ComponentProps<'form'>

/* ========================================================================
                              UpdateTodoForm
======================================================================== */

export const UpdateTodoForm = ({
  className = '',
  style = {},
  ...otherProps
}: UpdateTodoFormProps) => {
  const navigate = useNavigate()
  const { id: todoId } = useParams()

  /* ======================
        state & refs
  ====================== */

  const [loading, setLoading] = React.useState(false)
  const [todo, setTodo] = React.useState<Todo>()
  const [error, setError] = React.useState('')

  const [title, setTitle] = React.useState('')
  const [titleTouched, setTitleTouched] = React.useState(false)
  const [titleError, setTitleError] = React.useState('')

  const [body, setBody] = React.useState('')
  const [bodyTouched, setBodyTouched] = React.useState(false)
  const [bodyError, setBodyError] = React.useState('')

  const [completed, setCompleted] = React.useState(false)
  const [completedTouched, setCompletedTouched] = React.useState(false)
  const [completedError, setCompletedError] = React.useState('')

  const [updatingTodo, setUpdatingTodo] = React.useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors =
    titleError !== '' || bodyError !== '' || completedError !== ''
  const allTouched = titleTouched && bodyTouched && completedTouched

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
    // it allows us to reset errors that were set by the server.
    // It's just good because it future proofs the form.

    setBodyError('')
    return ''
  }

  /* ======================
      validateCompleted()
  ====================== */

  const validateCompleted = (_value?: boolean) => {
    // value = typeof value === 'boolean' ? value : completed

    // if (value === false) {
    //   setCompletedError('The checkbox must be checked!')
    //   return 'The checkbox must be checked!'
    // }

    setCompletedError('')
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
      setBodyTouched,
      setCompletedTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [
      validateTitle,
      validateBody,
      validateCompleted
    ]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      toast.error('Form validation errors found!')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
      handleUpdateTodo()
  ====================== */

  const handleUpdateTodo = async () => {
    setUpdatingTodo(true)

    const requestBody = {
      id: todoId,
      // Only send `title` if it's not empty. This is important because the server-side Zod specifies
      // that title is optional. However, if it's anything but undefined, validation will run against it.
      // And in this case, '' is not allowed. `body` is also optional, but does not have a min requirement.

      ...(title ? { title } : {}),
      body
    }

    // No need for try/catch here because the API function catches internally.
    const result = await updateTodo(requestBody)

    const { success, data, errors } = result

    if (success == true && data) {
      setTitle('')
      setTitleTouched(false)
      setTitleError('')
      setBody('')
      setBodyTouched(false)
      setBodyError('')
      setCompleted(false)
      setCompletedTouched(false)
      setCompletedError('')
      toast.success('The todo has been updated!')
      navigate(`/todos/${todoId}`)
    } else {
      if (errors) {
        if (errors.title) {
          setTitleError(errors.title)
        }

        if (errors.body) {
          setBodyError(errors.body)
        }

        if (errors.completed) {
          setCompletedError(errors.completed)
        }
      }

      toast.error('Unable to update the todo!')
    }

    setUpdatingTodo(false)
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

    handleUpdateTodo()
  }

  /* ======================
      handleGetTodo()
  ====================== */

  const handleGetTodo = React.useCallback(async () => {
    setLoading(true)
    setError('')

    // No need for try/catch here because the API function catches internally.
    const { success, data } = await getTodo(todoId || '')

    if (success === true && data) {
      setTodo(data)

      if (data.title) {
        setTitle(data.title)
      }

      if (data.body) {
        setBody(data.body)
      }

      if (typeof data.completed === 'boolean') {
        setCompleted(data.completed)
      }
    } else {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Here we could also check if success === false.
      // That would always work because the API function catches internally,
      // and ALWAYS returns a success property. However, as a general practice,
      // it makes more sense just to set a generic error without even checking for
      // for success. Why? Supppose the API function DID NOT have a standardized response.
      // What if the request then failed because the server or internet was down?
      // In that case, we wouldn't even get a response body back from the server.
      //
      ///////////////////////////////////////////////////////////////////////////
      setError('Unable to get todo.')
    }

    setLoading(false)
  }, [todoId])

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    handleGetTodo()
  }, [handleGetTodo])

  /* ======================
    renderUpdateTodoForm()
  ====================== */
  // In this case, we only want to render the form once the data is
  // there to be injected into the form.

  const renderUpdateTodoForm = () => {
    if (error) {
      return (
        <Alert
          className='alert-red mx-auto mb-12 max-w-2xl'
          centerClassName='flex-1'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
          rightClassName='flex items-center'
          rightSection={
            <Button
              className={`${Alert.redButtonFix} min-w-[100px]`}
              onClick={handleGetTodo}
            >
              Retry
            </Button>
          }
        >
          <Alert.Heading>Error:</Alert.Heading>

          <p className='text-sm'>{error ? error : 'Unable to get the todo!'}</p>
        </Alert>
      )
    }

    if (loading) {
      return (
        <div className='flex min-h-[300px] items-center justify-center'>
          <Spinner className='border-[2.5px] text-violet-800' size={50} />
        </div>
      )
    }

    // Here we are mostly trusting that if not error, then todo will exist.
    // However, we also return null at the very bottom as a fallback.
    if (todo && typeof todo === 'object') {
      return (
        <form
          {...otherProps}
          className={cn(
            'mx-auto mb-4 overflow-hidden rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow',
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

          {/* ============================== */}

          <div className='form-check mb-4'>
            <input
              checked={completed}
              className={cn(
                'form-control form-control-sm',
                completedError && 'is-invalid',
                completedTouched && !completedError && 'is-valid'
              )}
              id='completed'
              name='completed'
              onBlur={(e) => {
                if (!completedTouched) {
                  setCompletedTouched(true)
                }
                validateCompleted(e.target.checked)
              }}
              onChange={(e) => {
                setCompleted(e.target.checked)

                if (completedTouched) {
                  validateCompleted(e.target.checked)
                }
              }}
              type='checkbox'
            />

            <label
              htmlFor='completed'
              className='text-sm font-bold text-blue-500'
            >
              Completed
            </label>

            <div className='invalid-feedback'>{completedError}</div>
          </div>

          {/* ============================== */}

          {updatingTodo ? (
            <Button
              className='btn-green btn-sm flex w-full'
              loading={updatingTodo}
              type='button'
            >
              Updating Todo...
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
                'Update Todo'
              )}
            </Button>
          )}
        </form>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return renderUpdateTodoForm()
}
