import * as React from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import { cn } from 'utils'
import { Alert, Button, Spinner } from 'components'
import { getCurrentUser } from '../getCurrentUser'
import { updateUser } from '../updateUser'
import { UnsafeUser } from 'types'

type UpdateUserFormProps = React.ComponentProps<'form'>

/* ========================================================================
                              UpdateUserForm
======================================================================== */
// ✅ Eventually add in logic for updating password and for adding an image.

export const UpdateUserForm = ({
  className = '',
  style = {},
  ...otherProps
}: UpdateUserFormProps) => {
  const navigate = useNavigate()

  /* ======================
        state & refs
  ====================== */

  const [user, setUser] = React.useState<UnsafeUser>()
  const [userLoading, setUserLoading] = React.useState(false)
  const [userError, setUserError] = React.useState('')

  const [userName, setUserName] = React.useState('')
  const [userNameTouched, setUserNameTouched] = React.useState(false)
  const [userNameError, setUserNameError] = React.useState('')

  const [firstName, setFirstName] = React.useState('')
  const [firstNameTouched, setFirstNameTouched] = React.useState(false)
  const [firstNameError, setFirstNameError] = React.useState('')

  const [lastName, setLastName] = React.useState('')
  const [lastNameTouched, setLastNameTouched] = React.useState(false)
  const [lastNameError, setLastNameError] = React.useState('')

  const [email, setEmail] = React.useState('')
  const [emailTouched, setEmailTouched] = React.useState(false)
  const [emailError, setEmailError] = React.useState('')

  const [image, setImage] = React.useState<File>()
  const [imageTouched, setImageTouched] = React.useState(false)
  const [imageError, setImageError] = React.useState('')

  const [updatingUser, setUpdatingUser] = React.useState(false)

  const isErrors =
    firstNameError !== '' || lastNameError !== '' || emailError !== ''
  const allTouched = firstNameTouched && lastNameTouched && emailTouched

  /* ======================
    validateUserName()
  ====================== */
  // Note: Here we are requiring all fields prior to sending the request.
  // However, the underlying API endpoint only validates against defined fields.

  const validateUserName = (value?: string) => {
    value = typeof value === 'string' ? value : userName
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'User name is required.'
      setUserNameError(error)
      return error
    }

    setUserNameError('')
    return ''
  }

  /* ======================
      validateFirstName()
  ====================== */

  const validateFirstName = (value?: string) => {
    value = typeof value === 'string' ? value : firstName
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'First name is required.'
      setFirstNameError(error)
      return error
    }

    setFirstNameError('')
    return ''
  }

  /* ======================
      validateLastName()
  ====================== */

  const validateLastName = (value?: string) => {
    value = typeof value === 'string' ? value : lastName
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Last name is required.'
      setLastNameError(error)
      return error
    }

    setLastNameError('')
    return ''
  }

  /* ======================
      validateEmail()
  ====================== */
  // This validation function is used by validate(), which is called in handleSubmit().
  // It's also used within the email <input>'s onChange and onBlur handlers. When used
  // by the <input> the value is passed as an argument to avoid race conditions. When
  // used in the handleSubmit() the value argument is omitted, and the value is instead
  // derived from the local state.

  const validateEmail = (value?: string) => {
    // Gotcha: You can't do value = '' as a default parameter because that will cause
    // the following reassignment to fallback to email state, which in cases of
    // calling the function in the associated onChange will cause a race condition.
    value = typeof value === 'string' ? value : email
    let error = ''

    // This regex is taken directly from:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
    // However, you may still need to turn off ESLint's: no-useless-escape
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'An email is required.'
      setEmailError(error)
      return error
    }

    if (!regex.test(value)) {
      error = 'A valid email is required.'
      setEmailError(error)
      return error
    }

    setEmailError('')
    return ''
  }

  /* ======================
      validateImage()
  ====================== */

  const validateImage = (value?: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    value = value instanceof File ? value : image
    let error = ''

    // A helper to check a value against an array of allowedValues.
    const isOneOf = (value: unknown, allowedValues: unknown[]) => {
      if (allowedValues.indexOf(value) !== -1) {
        return true
      }
      return false
    }

    if (value && value instanceof File) {
      // Despite already having an accept attribute on the input,
      // it's a good idea to manually check file types, etc.
      const isAllowedFileType = isOneOf(value.type, allowedTypes)

      if (!isAllowedFileType) {
        error = `${value.name} uses file type of ${value.type}, which is not allowed.`
        setImageError(error)
        return error
      }
    }

    setImageError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
      setUserNameTouched,
      setFirstNameTouched,
      setLastNameTouched,
      setEmailTouched,
      setImageTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [
      validateUserName,
      validateFirstName,
      validateLastName,
      validateEmail,
      validateImage
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
      handleUpdateUser()
  ====================== */

  const handleUpdateUser = async () => {
    setUpdatingUser(true)

    const requestBody = {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Only send values if they are not empty strings.
      // This is important because the server-side Zod uses .optiona(), but if '' is passed
      // then validation will run against it, and in the case of userName, firstName and lastName
      // they all have a min of 1. Additionally, if '' is passed for email, Zod will validate it.
      //
      ///////////////////////////////////////////////////////////////////////////

      ...(userName ? { userName } : {}),
      ...(firstName ? { firstName } : {}), // Or do: firstName: firstName || undefined,
      ...(lastName ? { lastName } : {}),
      ...(email ? { email } : {})
      //# ...(image ? { image } : {})
    }

    // No need for try/catch here because the API function catches internally.
    const result = await updateUser(requestBody)

    const { success, data, errors } = result

    if (success == true && data) {
      setUserName('')
      setUserNameTouched(false)
      setUserNameError('')

      setFirstName('')
      setFirstNameTouched(false)
      setFirstNameError('')

      setLastName('')
      setLastNameTouched(false)
      setLastNameError('')

      setEmail('')
      setEmailTouched(false)
      setEmailError('')

      // ⚠️ Note: This will not actually clear the image form field, since
      // it's uncontrolled. For that, you would need a different approach.
      // However, it doesn't really matter since we're redirecting.
      setImage(undefined)
      setImageTouched(false)
      setImageError('')

      toast.success('The user has been updated!')

      navigate(`/profile`)
    } else {
      if (errors) {
        if (errors.userName) {
          setUserNameError(errors.userName)
        }

        if (errors.firstName) {
          setFirstNameError(errors.firstName)
        }

        if (errors.lastName) {
          setLastNameError(errors.lastName)
        }

        if (errors.email) {
          setEmailError(errors.email)
        }

        if (errors.image) {
          setImageError(errors.image)
        }
      }

      toast.error('Unable to update the user!')
    }

    setUpdatingUser(false)
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

    handleUpdateUser()
  }

  /* ======================
    handleGetCurrentUser()
  ====================== */

  const handleGetCurrentUser = async () => {
    setUserLoading(true)
    setUserError('')

    // No need for try/catch here because the API function catches internally.
    const { success, data } = await getCurrentUser()

    if (success == true && data) {
      setUser(data)

      if (data.userName) {
        setUserName(data.userName)
      }

      if (data.firstName) {
        setFirstName(data.firstName)
      }

      if (data.lastName) {
        setLastName(data.lastName)
      }

      if (data.email) {
        setEmail(data.email)
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // Here we could also check if success === false.
      // That would always work because the API function catches internally,
      // and ALWAYS returns a success property. However, as a general practice,
      // it makes more sense just to set a generic error without even checking
      // for success. Why? Supppose the API function DID NOT have a standardized response.
      // What if the request then failed because the server or internet was down?
      // In that case, we wouldn't even get a response body back from the server.
      //
      ///////////////////////////////////////////////////////////////////////////
    } else {
      setUserError('Unable to get current user.')
    }

    setUserLoading(false)
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    handleGetCurrentUser()
  }, [])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    if (userError) {
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
              onClick={handleGetCurrentUser}
            >
              Retry
            </Button>
          }
        >
          <Alert.Heading>Error:</Alert.Heading>

          <p className='text-sm'>
            {userError ? userError : 'Unable to get the user!'}
          </p>
        </Alert>
      )
    }

    if (userLoading) {
      return (
        <div className='flex min-h-[300px] items-center justify-center'>
          <Spinner className='border-[2.5px] text-violet-800' size={50} />
        </div>
      )
    }

    // Here we are mostly trusting that if not error, then resource will exist.
    // However, we also return null at the very bottom as a fallback.
    if (user && typeof user === 'object') {
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
            <label
              className='text-sm font-bold text-blue-500'
              htmlFor='userName'
            >
              User Name
            </label>

            <input
              autoComplete='off'
              className={cn(
                'form-control form-control-sm',
                userNameError && 'is-invalid',
                userNameTouched && !userNameError && 'is-valid'
              )}
              id='userName'
              name='userName'
              onBlur={(e) => {
                if (!userNameTouched) {
                  setUserNameTouched(true)
                }
                validateUserName(e.target.value)
              }}
              onChange={(e) => {
                setUserName(e.target.value)

                if (userNameTouched) {
                  validateUserName(e.target.value)
                }
              }}
              placeholder='User Name...'
              spellCheck={false}
              type='text'
              value={userName}
            />

            <div className='invalid-feedback'>{userNameError}</div>
          </div>

          {/* ============================== */}

          <div className='mb-4'>
            <label
              className='text-sm font-bold text-blue-500'
              htmlFor='firstName'
            >
              First Name
            </label>

            <input
              autoComplete='off'
              className={cn(
                'form-control form-control-sm',
                firstNameError && 'is-invalid',
                firstNameTouched && !firstNameError && 'is-valid'
              )}
              id='firstName'
              name='firstName'
              onBlur={(e) => {
                if (!firstNameTouched) {
                  setFirstNameTouched(true)
                }
                validateFirstName(e.target.value)
              }}
              onChange={(e) => {
                setFirstName(e.target.value)

                if (firstNameTouched) {
                  validateFirstName(e.target.value)
                }
              }}
              placeholder='First Name...'
              spellCheck={false}
              type='text'
              value={firstName}
            />

            <div className='invalid-feedback'>{firstNameError}</div>
          </div>

          {/* ============================== */}

          <div className='mb-4'>
            <label
              className='text-sm font-bold text-blue-500'
              htmlFor='lastName'
            >
              Last Name
            </label>

            <input
              autoComplete='off'
              className={cn(
                'form-control form-control-sm',
                lastNameError && 'is-invalid',
                lastNameTouched && !lastNameError && 'is-valid'
              )}
              id='lastName'
              name='lastName'
              onBlur={(e) => {
                if (!lastNameTouched) {
                  setLastNameTouched(true)
                }
                validateLastName(e.target.value)
              }}
              onChange={(e) => {
                setLastName(e.target.value)

                if (lastNameTouched) {
                  validateLastName(e.target.value)
                }
              }}
              placeholder='Last Name...'
              spellCheck={false}
              type='text'
              value={lastName}
            />

            <div className='invalid-feedback'>{lastNameError}</div>
          </div>

          {/* ============================== */}

          <div className='mb-4'>
            <label className='text-sm font-bold text-blue-500' htmlFor='email'>
              Email:
            </label>
            <input
              autoComplete='off'
              className={cn(
                'form-control form-control-sm',
                emailError && 'is-invalid',
                emailTouched && !emailError && 'is-valid'
              )}
              id='email'
              name='email'
              onBlur={(e) => {
                if (!emailTouched) {
                  setEmailTouched(true)
                }
                validateEmail(e.target.value)
              }}
              onChange={(e) => {
                setEmail(e.target.value)

                if (emailTouched) {
                  validateEmail(e.target.value)
                }
              }}
              placeholder='Email...'
              type='email'
              value={email}
            />

            <div className='invalid-feedback'>{emailError}</div>
          </div>

          {/* ============================== */}

          <div className='mb-4'>
            <label className='text-sm font-bold text-blue-500' htmlFor='image'>
              Image:
            </label>
            <input
              accept='image/png, image/jpeg, image/jpg'
              autoComplete='off'
              className={cn(
                'form-control form-control-sm',
                imageError && 'is-invalid',
                imageTouched && !imageError && 'is-valid'
              )}
              id='image'
              name='image'
              onBlur={(e) => {
                const currentTarget = e.currentTarget
                const activeElement = document.activeElement

                if (activeElement === currentTarget) {
                  console.log('A blur event occurred but on the currentTarget.')
                  e.preventDefault()
                  e.stopPropagation()
                  return
                } else {
                  console.log('A true blur event occurred.')
                }

                const file = e.target.files?.[0]

                if (!imageTouched) {
                  setImageTouched(true)
                }
                validateImage(file)
              }}
              onChange={(e) => {
                const file = e.target.files?.[0]

                setImage(file)

                if (imageTouched) {
                  validateImage(file)
                }
              }}
              // placeholder='Image...'
              // spellCheck={false}
              type='file'
            />

            <div className='invalid-feedback'>{imageError}</div>
          </div>

          {/* ============================== */}

          {updatingUser ? (
            <Button
              className='btn-green btn-sm flex w-full'
              loading={updatingUser}
              type='button'
            >
              Updating User...
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
                'Update User'
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

  return renderForm()
}
