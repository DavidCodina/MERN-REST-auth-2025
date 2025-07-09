import { ComponentProps, Fragment } from 'react'
import { RadixModal } from '../../'

type UncontrolledModalProps = ComponentProps<typeof RadixModal>

/* ========================================================================
                              UncontrolledModal
======================================================================== */

export const UncontrolledModal = ({
  trigger,
  ...otherProps
}: UncontrolledModalProps) => {
  /* ======================
          return
  ====================== */

  return (
    <RadixModal
      centered
      scrollable
      // defaultOpen
      // disableAnimation
      // Obviously don't set width or --radix-modal-rem-spacing on dialogClassName
      // if you want it to be fullscreen
      fullscreen
      trigger={trigger}
      // dialogClassName='w-[800px] [--radix-modal-rem-spacing:1.5625rem]'
      headerClassName='flex flex-col items-center'
      title='Uncontrolled Modal'
      titleClassName='text-violet-800 text-2xl font-black text-center'
      description='Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi, eligendi.'
      descriptionClassName='text-sm text-sky-500 text-center'
      bodyClassName='rounded-none'
      bodyStyle={{ boxShadow: 'inset 0px 0px 1px 0.5px rgba(0,0,0,0.35)' }}
      closeButton={true}
      contentClassName=''
      footer={
        <Fragment>
          <RadixModal.Close asChild>
            <button
              className='btn-sky btn-sm min-w-[100px]'
              type='button'
              style={{}}
            >
              Accept
            </button>
          </RadixModal.Close>
        </Fragment>
      }
      footerClassName='justify-end '
      // footerClassName='bg-stone-100'
      {...otherProps}
    >
      <p className='text-sm'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        eaque numquam culpa, quisquam commodi explicabo dignissimos deleniti
        obcaecati accusantium necessitatibus id provident pariatur eum officiis
        sunt distinctio itaque libero. Qui excepturi provident odit quos eaque
        quasi vitae, dolore quo dolores maxime mollitia dolorum recusandae,
        labore aperiam ratione facilis delectus dolorem!
      </p>

      <p className='text-sm'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        eaque numquam culpa, quisquam commodi explicabo dignissimos deleniti
        obcaecati accusantium necessitatibus id provident pariatur eum officiis
        sunt distinctio itaque libero. Qui excepturi provident odit quos eaque
        quasi vitae, dolore quo dolores maxime mollitia dolorum recusandae,
        labore aperiam ratione facilis delectus dolorem!
      </p>

      <p className='text-sm'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        eaque numquam culpa, quisquam commodi explicabo dignissimos deleniti
        obcaecati accusantium necessitatibus id provident pariatur eum officiis
        sunt distinctio itaque libero. Qui excepturi provident odit quos eaque
        quasi vitae, dolore quo dolores maxime mollitia dolorum recusandae,
        labore aperiam ratione facilis delectus dolorem!
      </p>
    </RadixModal>
  )
}
