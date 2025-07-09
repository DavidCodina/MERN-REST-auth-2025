import { Fragment } from 'react'

/* ========================================================================
                              FormPluginDemo
======================================================================== */

export const FormPluginDemo = () => {
  /* ======================
        inputGroupForm
  ====================== */

  const _inputGroupForm = (
    <form
      className='mx-auto mb-6 max-w-[800px] rounded-lg border border-gray-400 bg-[#fafafa] p-4 shadow-lg'
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
      }}
      style={{ backgroundColor: 'floralWhite' }}
    >
      <h5 className='text-blue-500'>Basic Example</h5>
      <div className='input-group mb-4'>
        <span className='input-group-text' id='basic-addon1'>
          @
        </span>
        <input
          type='text'
          className='form-control'
          placeholder='Username'
          aria-label='Username'
          aria-describedby='basic-addon1'
        />
      </div>

      <div className='input-group mb-4'>
        <input
          type='text'
          className='form-control'
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby='basic-addon2'
        />
        <span className='input-group-text' id='basic-addon2'>
          @example.com
        </span>
      </div>

      <div className='mb-4'>
        <label htmlFor='basic-url' className='form-label'>
          Your vanity URL
        </label>
        <div className='input-group'>
          <span className='input-group-text' id='basic-addon3'>
            https://example.com/users/
          </span>
          <input
            type='text'
            className='form-control'
            id='basic-url'
            aria-describedby='basic-addon3 basic-addon4'
          />
        </div>
        <div className='form-text' id='basic-addon4'>
          Example help text goes outside the input group.
        </div>
      </div>

      <div className='input-group mb-3'>
        <span className='input-group-text'>$</span>
        <input
          type='text'
          className='form-control'
          aria-label='Amount (to the nearest dollar)'
        />
        <span className='input-group-text'>.00</span>
      </div>

      <div className='input-group mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Username'
          aria-label='Username'
        />
        <span className='input-group-text'>@</span>
        <input
          type='text'
          className='form-control'
          placeholder='Server'
          aria-label='Server'
        />
      </div>

      <div className='input-group mb-4'>
        <span className='input-group-text'>With textarea</span>
        <textarea
          className='form-control'
          aria-label='With textarea'
        ></textarea>
      </div>

      <h5 className='text-blue-500'>Sizing</h5>

      <div className='input-group input-group-sm mb-3'>
        <span className='input-group-text' id='inputGroup-sizing-sm'>
          Small
        </span>
        <input
          type='text'
          className='form-control'
          aria-label='Sizing example input'
          aria-describedby='inputGroup-sizing-sm'
        />
      </div>

      <div className='input-group mb-3'>
        <span className='input-group-text' id='inputGroup-sizing-default'>
          Default
        </span>
        <input
          type='text'
          className='form-control'
          aria-label='Sizing example input'
          aria-describedby='inputGroup-sizing-default'
        />
      </div>

      <div className='input-group input-group-lg mb-4'>
        <span className='input-group-text' id='inputGroup-sizing-lg'>
          Large
        </span>
        <input
          type='text'
          className='form-control'
          aria-label='Sizing example input'
          aria-describedby='inputGroup-sizing-lg'
        />
      </div>

      <h5 className='text-blue-500'>Checkboxes and radios</h5>

      <div className='input-group mb-4'>
        <div className='input-group-text'>
          <input
            className='form-check-input mt-0'
            type='checkbox'
            value=''
            aria-label='Checkbox for following text input'
          />
        </div>
        <input
          type='text'
          className='form-control'
          aria-label='Text input with checkbox'
        />
      </div>

      <div className='input-group mb-4'>
        <div className='input-group-text'>
          <input
            className='form-check-input mt-0'
            type='radio'
            value=''
            aria-label='Radio button for following text input'
          />
        </div>
        <input
          type='text'
          className='form-control'
          aria-label='Text input with radio button'
        />
      </div>

      <h5 className='text-blue-500'>Multiple inputs</h5>

      <div className='input-group mb-4'>
        <span className='input-group-text'>First and last name</span>
        <input type='text' aria-label='First name' className='form-control' />
        <input type='text' aria-label='Last name' className='form-control' />
      </div>

      <h5 className='text-blue-500'>Multiple addons </h5>

      <div className='input-group mb-3'>
        <span className='input-group-text'>$</span>
        <span className='input-group-text'>0.00</span>
        <input
          type='text'
          className='form-control'
          aria-label='Dollar amount (with dot and two decimal places)'
        />
      </div>

      <div className='input-group mb-4'>
        <input
          type='text'
          className='form-control'
          aria-label='Dollar amount (with dot and two decimal places)'
        />
        <span className='input-group-text'>$</span>
        <span className='input-group-text'>0.00</span>
      </div>

      <h5 className='text-blue-500'>Button addons</h5>

      <div className='input-group input-group-sm mb-4 rounded bg-white'>
        <button
          className='btn-outline-gray shadow-none'
          type='button'
          id='button-addon1'
        >
          Button
        </button>
        <input
          type='text'
          className='form-control'
          placeholder='Small...'
          aria-label='Example text with button addon'
          aria-describedby='button-addon1'
        />
      </div>

      <div className='input-group mb-4 rounded bg-white'>
        <button
          className='btn-outline-gray shadow-none'
          type='button'
          id='button-addon1'
        >
          Button
        </button>
        <input
          type='text'
          className='form-control'
          placeholder='Default...'
          aria-label='Example text with button addon'
          aria-describedby='button-addon1'
        />
      </div>

      <div className='input-group input-group-lg mb-4 rounded bg-white'>
        <button
          className='btn-outline-gray shadow-none'
          type='button'
          id='button-addon1'
        >
          Button
        </button>
        <input
          type='text'
          className='form-control'
          placeholder='Large...'
          aria-label='Example text with button addon'
          aria-describedby='button-addon1'
        />
      </div>

      <div className='input-group mb-4 rounded bg-white'>
        <input
          type='text'
          className='form-control'
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby='button-addon2'
        />
        <button
          className='btn-outline-gray shadow-none'
          type='button'
          id='button-addon2'
        >
          Button
        </button>
      </div>

      <div className='input-group mb-3 rounded bg-white'>
        <button className='btn-outline-gray shadow-none' type='button'>
          Button
        </button>
        <button className='btn-outline-gray shadow-none' type='button'>
          Button
        </button>
        <input
          type='text'
          className='form-control'
          placeholder=''
          aria-label='Example text with two button addons'
        />
      </div>

      <div className='input-group mb-4 rounded bg-white'>
        <input
          type='text'
          className='form-control'
          placeholder="Recipient's username"
          aria-label="Recipient's username with two button addons"
        />
        <button className='btn-outline-gray shadow-none' type='button'>
          Button
        </button>
        <button className='btn-outline-gray shadow-none' type='button'>
          Button
        </button>
      </div>

      <h5 className='text-blue-500'>Custom Forms</h5>

      <div className='input-group mb-4'>
        <label className='input-group-text' htmlFor='inputGroupSelect01'>
          Options
        </label>
        <select className='form-select' id='inputGroupSelect01'>
          <option selected>Choose...</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>
      </div>

      <div className='input-group mb-4'>
        <select className='form-select' id='inputGroupSelect02'>
          <option selected>Choose...</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>
        <label className='input-group-text' htmlFor='inputGroupSelect02'>
          Options
        </label>
      </div>

      <div className='input-group mb-4'>
        <button
          className='btn-outline-neutral bg-white shadow-none'
          type='button'
        >
          Button
        </button>
        <select
          className='form-select'
          id='inputGroupSelect03'
          aria-label='Example select with button addon'
        >
          <option selected>Choose...</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>
      </div>

      <div className='input-group mb-4'>
        <select
          className='form-select'
          id='inputGroupSelect04'
          aria-label='Example select with button addon'
        >
          <option selected>Choose...</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>
        <button
          className='btn-outline-neutral bg-white shadow-none'
          type='button'
        >
          Button
        </button>
      </div>

      <h5 className='text-blue-500'>Custom File Input</h5>

      <div className='input-group mb-3'>
        <label className='input-group-text' htmlFor='inputGroupFile01'>
          Upload
        </label>
        <input type='file' className='form-control' id='inputGroupFile01' />
      </div>

      <div className='input-group mb-3'>
        <input type='file' className='form-control' id='inputGroupFile02' />
        <label className='input-group-text' htmlFor='inputGroupFile02'>
          Upload
        </label>
      </div>

      <div className='input-group mb-3'>
        <button
          className='btn-outline-neutral bg-white shadow-none'
          type='button'
          id='inputGroupFileAddon03'
        >
          Button
        </button>
        <input
          type='file'
          className='form-control'
          id='inputGroupFile03'
          aria-describedby='inputGroupFileAddon03'
          aria-label='Upload'
        />
      </div>

      <div className='input-group'>
        <input
          type='file'
          className='form-control'
          id='inputGroupFile04'
          aria-describedby='inputGroupFileAddon04'
          aria-label='Upload'
        />
        <button
          className='btn-outline-neutral bg-white shadow-none'
          type='button'
          id='inputGroupFileAddon04'
        >
          Button
        </button>
      </div>
    </form>
  )

  const _floatingForm = (
    <form
      className='mx-auto mb-6 max-w-[800px] rounded-lg border border-gray-400 bg-[#fafafa] p-4 shadow-lg'
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className='form-floating mb-4'>
        <input
          autoComplete='off'
          id='firstName'
          name='firstName'
          className='form-control'
          spellCheck={false}
          type='text'
          placeholder='First Name...'
        />
        <label className='form-label' htmlFor='firstName'>
          First Name
        </label>
      </div>

      <div className='form-floating mb-4'>
        <input
          autoComplete='off'
          className='form-control'
          disabled
          id='lastName'
          name='lastName'
          spellCheck={false}
          type='text'
          placeholder='Last Name...'
        />

        <label className='form-label' htmlFor='lastName'>
          Last Name
        </label>
      </div>

      <div className='form-floating mb-4'>
        <textarea
          autoComplete='off'
          className='form-control'
          id='message'
          name='message'
          placeholder='Leave a comment here'
          spellCheck={false}
        />
        <label htmlFor='message'>Message</label>
      </div>

      <div className='form-floating mb-4'>
        <select
          className='form-select'
          id='select1'
          name='select1'
          // multiple
          // size={2}
          // disabled
        >
          <option value=''>Open this select menu</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>

        <label htmlFor='select1'>Works with selects</label>
      </div>

      <button className='btn-green flex w-full' type='button'>
        Submit
      </button>
    </form>
  )

  /* ======================
        validationForm
  ====================== */

  const validationForm = (
    <form
      className='mx-auto mb-6 max-w-[800px] rounded-lg border border-gray-400 bg-[#fafafa] p-4 shadow-lg'
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className='mb-4'>
        <label className='form-label' htmlFor='firstName'>
          First Name!!!
        </label>
        <input
          autoComplete='off'
          id='firstName'
          name='firstName'
          className='form-control is-valid'
          spellCheck={false}
          type='text'
          placeholder='First Name...'
        />
        <div className='form-text'>Your first name.</div>

        <div className='valid-feedback'>Looks good!</div>
        <div className='invalid-feedback'>Looks like crap!</div>
      </div>
      <div className='mb-4'>
        <label className='form-label' htmlFor='lastName'>
          Last Name
        </label>
        <input
          // disabled
          //  readOnly
          // defaultValue='Codina'
          autoComplete='off'
          id='lastName'
          name='lastName'
          className='form-control is-invalid'
          spellCheck={false}
          type='text'
          placeholder='Last Name...'
          // style={{ outline: '1px dashed red' }}
        />

        <div className='form-text'>Your last name.</div>
        <div className='valid-feedback'>Looks good!</div>
        <div className='invalid-feedback'>Looks like crap!</div>
      </div>
      <div className='mb-4'>
        <label className='form-label' htmlFor='image'>
          Image
        </label>
        <input
          id='image'
          name='image'
          className='form-control is-invalid'
          type='file'
          placeholder='Image...'
        />

        <div className='valid-feedback'>Looks good!</div>
        <div className='invalid-feedback'>Looks like crap!</div>
      </div>

      <div className='mb-4'>
        <label htmlFor='message' className='form-label'>
          Message
        </label>
        <textarea
          autoComplete='off'
          className='form-control is-invalid'
          id='message'
          name='message'
          spellCheck={false}
        />

        <div className='valid-feedback'>Looks good!</div>
        <div className='invalid-feedback'>Looks like crap!</div>
      </div>
      <div className='mb-4'>
        <select
          className='form-select is-invalid'
          // multiple
          // size={2}
          // disabled
        >
          <option value=''>Open this select menu</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>

        <div className='valid-feedback'>Looks good!</div>
        <div className='invalid-feedback'>Looks like crap!</div>
      </div>

      <div className='mb-4'>
        <div className='form-check'>
          <input
            className='form-check-input is-invalid'
            id='check1'
            name='check1'
            type='checkbox'
            value='check1'
          />
          <label className='form-check-label' htmlFor='check1'>
            Check Item 1
          </label>

          <div className='valid-feedback'>Looks good!</div>
          <div className='invalid-feedback'>Looks like crap!</div>
        </div>

        <div className='form-check'>
          <input
            className='form-check-input is-valid'
            id='check2'
            name='check2'
            type='checkbox'
            value='check2'
            // checked
            // disabled
          />
          <label className='form-check-label' htmlFor='flexCheckChecked'>
            Check Item 2
          </label>

          <div className='valid-feedback'>Looks good!</div>
          <div className='invalid-feedback'>Looks like crap!</div>
        </div>
      </div>

      <div className='mb-4'>
        <div className='form-check'>
          <input
            className='form-check-input is-invalid'
            id='radio1'
            name='radio-group-1'
            type='radio'
          />
          <label className='form-check-label' htmlFor='radio1'>
            Radio Item 1
          </label>
        </div>

        <div className='form-check'>
          <input
            className='form-check-input'
            disabled
            id='radio2'
            name='radio-group-1'
            type='radio'
          />
          <label className='form-check-label' htmlFor='radio2'>
            Radio Item 2
          </label>

          <div className='valid-feedback'>Looks good!</div>
          <div className='invalid-feedback'>Looks like crap!</div>
        </div>
      </div>

      <div className='mb-4'>
        <div className='form-check form-switch'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckDefault'
          />
          <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>
            Default switch
          </label>
        </div>

        <div className='form-check form-check-reverse form-switch'>
          <input
            className='form-check-input is-invalid'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckChecked'
            checked
          />
          <label className='form-check-label' htmlFor='flexSwitchCheckChecked'>
            Checked switch checkbox input
          </label>
        </div>
        <div className='form-check form-switch'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckDisabled'
            disabled
          />
          <label className='form-check-label' htmlFor='flexSwitchCheckDisabled'>
            Disabled switch checkbox input
          </label>
        </div>
        <div className='form-check form-switch'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckCheckedDisabled'
            checked
            disabled
          />
          <label
            className='form-check-label'
            htmlFor='flexSwitchCheckCheckedDisabled'
          >
            Disabled checked switch checkbox input
          </label>
        </div>
      </div>
      <div className='mb-4'>
        <label htmlFor='range1' className='form-label'>
          Example range
        </label>
        <input
          // disabled
          type='range'
          className='form-range is-valid' // ???
          id='range1'
          name='range1'
        />
      </div>
      <button className='btn-green flex w-full' type='button'>
        Submit
      </button>
    </form>
  )

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      {/* {inputGroupForm} */}

      {/* {floatingForm} */}

      {validationForm}
    </Fragment>
  )
}
