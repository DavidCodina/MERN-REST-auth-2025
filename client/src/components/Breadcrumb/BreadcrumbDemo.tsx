import { Breadcrumb /*, BreadcrumbItem */ } from './index'

const _Separator = () => {
  return (
    <svg
      className=''
      width='1.5em'
      height='1.5em'
      fill='currentColor'
      viewBox='0 0 16 16'
    >
      <path
        fill-rule='evenodd'
        d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8'
      />
    </svg>
  )
}

/* ========================================================================
                              BreadcrumbDemo
======================================================================== */

export const BreadcrumbDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <Breadcrumb
    // separator={<Separator />}
    // separator='›'
    // className={` [--breadcrumb-link-color:theme(colors.green.500)] [--breadcrumb-link-hover-color:theme(colors.sky.500)]`}
    >
      <Breadcrumb.Item
        onClick={() => {
          console.log('Item 1 clicked.')
        }}
        underline='hover'
        // className='border-2 border-red-500'
        // linkClassName='border-2 border-green-500'
        // style={{ border: '2px solid red' }}
        // linkStyle={{ border: '2px solid orange' }}
      >
        Item 1
      </Breadcrumb.Item>
      <Breadcrumb.Item
        onClick={() => {
          console.log('Item 2 clicked.')
        }}
      >
        Item 2
      </Breadcrumb.Item>
      <Breadcrumb.Item
        active
        onClick={() => {
          console.log('Item 3 clicked.')
        }}
      >
        Item 3
      </Breadcrumb.Item>
    </Breadcrumb>
  )
}
