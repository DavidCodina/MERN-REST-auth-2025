import * as React from 'react'
import { toast } from 'react-toastify'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'

import { cn } from 'utils'
import { Button } from 'components'
import { useAuthContext } from 'contexts'
import { createUser } from '../createUser'

type RegisterFormProps = React.ComponentProps<'form'>

/* ========================================================================
                              RegisterForm 
======================================================================== */

const RegisterForm = ({
  style = {},
  className = '',
  ...otherProps
}: RegisterFormProps) => {
  /* ======================
        state & refs
  ====================== */

  const { handleAuthSuccess } = useAuthContext()

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

  const [password, setPassword] = React.useState('')
  const [passwordTouched, setPasswordTouched] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState('')
  const [passwordType, setPasswordType] = React.useState('password')

  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    React.useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('')
  const [confirmPasswordType, setConfirmPasswordType] =
    React.useState('password')

  const [creatingUser, setCreatingUser] = React.useState(false)

  // Derived state - used to conditionally disable submit button
  const isErrors =
    userNameError !== '' ||
    firstNameError !== '' ||
    lastNameError !== '' ||
    emailError !== '' ||
    passwordError !== '' ||
    confirmPasswordError !== ''

  const allTouched =
    userNameTouched &&
    firstNameTouched &&
    lastNameTouched &&
    emailTouched &&
    passwordTouched &&
    confirmPasswordTouched

  /* ======================
      validateUserName()
  ====================== */

  const validateUserName = (value?: string) => {
    // Gotcha: You can't do value = '' as a default parameter because that will cause
    // the following reassignment to fallback to name state, which in cases of
    // calling the function in the associated onChange will cause a race condition.
    value = typeof value === 'string' ? value : userName
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'User name is required.'
      setUserNameError(error)
      return error
    }

    // Otherwise unset the password error in state and return ''
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
    validatePassword()
  ====================== */

  const validatePassword = (value?: string) => {
    // Gotcha: You can't do value = '' as a default parameter because that will cause
    // the following reassignment to fallback to password state, which in cases of
    // calling the function in the associated onChange will cause a race condition.
    value = typeof value === 'string' ? value : password
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'A password is required.'
      setPasswordError(error)
      return error
    }

    setPasswordError('')
    return ''
  }

  /* ======================
  validateConfirmPassword()
  ====================== */

  const validateConfirmPassword = (value?: string, passwordValue?: string) => {
    // value represents the confirmPassword value,
    // while password is the original password value.
    value = typeof value === 'string' ? value : confirmPassword
    passwordValue = typeof passwordValue === 'string' ? passwordValue : password
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Password confirmation is required.'
      setConfirmPasswordError(error)
      return error
    }

    if (value !== passwordValue) {
      error = 'The passwords must match.'
      setConfirmPasswordError(error)
      return error
    }

    setConfirmPasswordError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
      setUserNameTouched,
      setFirstNameTouched,
      setLastNameTouched,
      setEmailTouched,
      setPasswordTouched,
      setConfirmPasswordTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [
      validateUserName,
      validateFirstName,
      validateLastName,
      validateEmail,
      validatePassword,
      validateConfirmPassword
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
      handleCreateUser()
  ====================== */

  const handleCreateUser = async () => {
    setCreatingUser(true)

    //# There's no reason to use then syntax here...
    createUser({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    })
      .then((result) => {
        const { success, data: session, errors, code } = result

        if (success === true && session) {
          handleAuthSuccess(session)

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

          setPassword('')
          setPasswordTouched(false)
          setPasswordError('')

          setConfirmPassword('')
          setConfirmPasswordTouched(false)
          setConfirmPasswordError('')
          toast.success('Registration successful!')
          // Rather than calling navigate('/todos') here, there's a check on
          // the RegisterPage that will then call <Navigate to='/todos' replace />
        }

        if (success === false && errors && code === 'FORM_ERRORS') {
          if (errors && typeof errors === 'object') {
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

            if (errors.password) {
              setPasswordError(errors.password)
            }

            if (errors.confirmPassword) {
              setConfirmPasswordError(errors.confirmPassword)
            }
          }

          setPassword('')
          setConfirmPassword('')

          // if (import.meta.env.DEV === true) {
          //   console.log(errors)
          // }

          toast.error('Unable to register user!')
        }

        return result
      })

      .catch((_err) => {
        setPassword('')
        setConfirmPassword('')
        toast.error('Unable to register user!')
      })
      .finally(() => {
        setPasswordType('password')
        setConfirmPasswordType('password')
        setCreatingUser(false)
      })
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const { isValid } = validate()

    // Comment this block out to test server-side validation
    if (!isValid) {
      setPassword('')
      setPasswordType('password')
      setConfirmPassword('')
      setConfirmPasswordType('password')
      return
    }

    handleCreateUser()
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      {...otherProps}
      className={cn(
        'mx-auto mb-4 overflow-hidden rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow',
        className
      )}
      style={{ maxWidth: 500, ...style }}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='userName'>
          User Name: <sup className='text-red-500'>*</sup>
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
          type='text'
          value={userName}
        />

        <div className='invalid-feedback'>{userNameError}</div>
      </div>

      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='firstName'>
          First Name: <sup className='text-red-500'>*</sup>
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
          type='text'
          value={firstName}
        />

        <div className='invalid-feedback'>{firstNameError}</div>
      </div>

      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='lastName'>
          Last Name: <sup className='text-red-500'>*</sup>
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
          type='text'
          value={lastName}
        />

        <div className='invalid-feedback'>{lastNameError}</div>
      </div>

      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='email'>
          Email: <sup className='text-red-500'>*</sup>
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

      <div className='mb-4'>
        <label className='text-sm font-bold text-blue-500' htmlFor='password'>
          Password: <sup className='text-red-500'>*</sup>
        </label>

        <div className='input-group'>
          <input
            autoComplete='off'
            className={cn(
              'form-control form-control-sm',
              passwordError && 'is-invalid',
              passwordTouched && !passwordError && 'is-valid'
            )}
            id='password'
            name='password'
            onBlur={(e) => {
              if (!passwordTouched) {
                setPasswordTouched(true)
              }
              validatePassword(e.target.value)

              if (confirmPasswordTouched) {
                // Call validateConfirmPassword(), passing in both values as args.
                // This keeps the validation synced at all times.
                validateConfirmPassword(confirmPassword, e.target.value)
              }
            }}
            onChange={(e) => {
              setPassword(e.target.value)

              if (passwordTouched) {
                validatePassword(e.target.value)
              }

              if (confirmPasswordTouched) {
                // Call validateConfirmPassword(), passing in both values as args.
                // This keeps the validation synced at all times.
                validateConfirmPassword(confirmPassword, e.target.value)
              }
            }}
            placeholder='Password...'
            type={passwordType}
            value={password}
          />

          <Button
            className='btn-outline-blue btn-sm bg-white shadow-none'
            onClick={() => {
              setPasswordType((previousValue) => {
                if (previousValue === 'password') {
                  return 'text'
                }
                return 'password'
              })
            }}
            type='button'
          >
            {passwordType === 'password' ? (
              <Eye className='pointer-events-none mr-1 size-[1.25em]' />
            ) : (
              <EyeOff className='pointer-events-none mr-1 size-[1.25em]' />
            )}
          </Button>
        </div>

        <div className={cn('invalid-feedback', passwordError && 'block')}>
          {passwordError}
        </div>
      </div>

      <div className='mb-3'>
        <label
          className='text-sm font-bold text-blue-500'
          htmlFor='confirm-password'
        >
          Confirm Password: <sup className='text-red-500'>*</sup>
        </label>

        <div className='input-group'>
          <input
            autoComplete='off'
            className={cn(
              'form-control form-control-sm',
              confirmPasswordError && 'is-invalid',
              confirmPasswordTouched && !confirmPasswordError && 'is-valid'
            )}
            id='confirm-password'
            name='confirmPassword'
            onBlur={(e) => {
              if (!confirmPasswordTouched) {
                setConfirmPasswordTouched(true)
              }
              validateConfirmPassword(e.target.value)
            }}
            onChange={(e) => {
              setConfirmPassword(e.target.value)

              if (confirmPasswordTouched) {
                validateConfirmPassword(e.target.value)
              }
            }}
            placeholder='Confirm Password...'
            type={confirmPasswordType}
            value={confirmPassword}
          />

          <Button
            className='btn-outline-blue btn-sm bg-white shadow-none'
            onClick={() => {
              setConfirmPasswordType((previousValue) => {
                if (previousValue === 'password') {
                  return 'text'
                }
                return 'password'
              })
            }}
            type='button'
          >
            {confirmPasswordType === 'password' ? (
              <Eye className='pointer-events-none mr-1 size-[1.25em]' />
            ) : (
              <EyeOff className='pointer-events-none mr-1 size-[1.25em]' />
            )}
          </Button>
        </div>

        <div
          className={cn('invalid-feedback', confirmPasswordError && 'block')}
        >
          {confirmPasswordError}
        </div>
      </div>

      {creatingUser ? (
        <Button
          loading={creatingUser}
          className='btn-green btn-sm flex w-full'
          type='button'
        >
          Registering...
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
            'Register'
          )}
        </Button>
      )}
    </form>
  )
}

export { RegisterForm }
