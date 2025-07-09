import { Fragment } from 'react'

import { Alert } from './'

/* ========================================================================

======================================================================== */

export const AlertDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <Alert
        className='alert-red mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8' />
            <path d='M9.653 5.496A2.986 2.986 0 0 0 8 5c-.61 0-1.179.183-1.653.496L4.694 2.992A5.972 5.972 0 0 1 8 2c1.222 0 2.358.365 3.306.992zm1.342 2.324a2.986 2.986 0 0 1-.884 2.312 3.01 3.01 0 0 1-.769.552l1.342 2.683c.57-.286 1.09-.66 1.538-1.103a5.986 5.986 0 0 0 1.767-4.624l-2.994.18Zm-5.679 5.548 1.342-2.684A3 3 0 0 1 5.005 7.82l-2.994-.18a6 6 0 0 0 3.306 5.728ZM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0' />
          </svg>
        }
      >
        <Alert.Heading>Danger!</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.redButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        className='alert-yellow mx-auto mb-12 max-w-2xl'
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
      >
        <Alert.Heading>Warning!</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.yellowButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        // before:hidden to remove left bar.
        className='alert-green mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0' />
            <path d='M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z' />
          </svg>
        }
        // leftClassName='self-center'

        // rightSection={
        //   <button className='btn-green border-green-800 bg-green-700 hover:border-green-800 hover:bg-green-700'>
        //     Confirm
        //   </button>
        // }
        // rightClassName='self-center'
      >
        <Alert.Heading>Success!</Alert.Heading>

        <p className='text-sm'>
          The biggest problem with the <code>Alert</code> is that the Button
          colors don't match the text color. This same issue arises in Bootstrap
          because the text color is always going to be darker than the normal
          button colors. One way around this is to append fix classNames on the
          compound component (e.g. <code>Alert.greenButtonFix</code>), etc.
        </p>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.greenButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        className='alert-blue mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
            <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
          </svg>
        }
      >
        <Alert.Heading>Info! (Blue)</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.blueButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        className='alert-sky mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
            <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
          </svg>
        }
      >
        <Alert.Heading>Info! (Sky)</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.skyButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        className='alert-cyan mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
            <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
          </svg>
        }
      >
        <Alert.Heading>Info! (Cyan)</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.cyanButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>

      <Alert
        className='alert-teal mx-auto mb-12 max-w-2xl'
        leftSection={
          <svg
            style={{ height: '3em' }}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
            <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
          </svg>
        }
      >
        <Alert.Heading>Info! (Teal)</Alert.Heading>

        <p className='text-sm'>
          Quidem quo expedita alias suscipit blanditiis obcaecati cumque quos{' '}
          <Alert.Link href='https://www.google.com/'>google.com</Alert.Link>{' '}
          esse, reprehenderit ullam, soluta, ipsa dolorum accusamus animi
          mollitia sint voluptate minima aliquid iste magni. Obcaec ati sed
          beatae facere itaque amet vero.
        </p>

        <button
          className={`${Alert.tealButtonFix} flex w-full active:scale-[0.99]`}
        >
          Confirm
        </button>

        <Alert.CloseButton
          onClick={() => {
            alert('Trigger unmount in consuming component!')
          }}
        />
      </Alert>
    </Fragment>
  )
}
