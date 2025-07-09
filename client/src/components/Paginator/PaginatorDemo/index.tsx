import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Paginator } from '../index'
import { debounce } from './lodash.debounce'

/* ======================
          data
====================== */

// const data: any = []
// for (let i = 1; i <= 100; i++) {
//   data.push({ id: i.toString(), title: `Item ${i}` })
// }

// const data = Array.from(Array(50).keys()).map((i) => ({
//   id: i.toString(),
//   title: `Item ${i}`
// }))

const data = [...Array(93)].map((_, index) => {
  const n = index + 1
  return {
    id: n.toString(),
    title: `Item ${n}`
  }
})

/* ======================
      mainStemLogo
====================== */

const mainStemLogo = (
  <svg style={{ width: '100%' }} x='0px' y='0px' viewBox='0 0 168.8 191.6'>
    <g>
      <g>
        <g>
          <path
            fill='#3b128d'
            d='M168.8,54.7c0,31,0,61,0,91.4c-6,3.5-12.1,7-19.1,11.1c0-23,0-45.1,0-68.3c-4.2,2.4-7.4,4.2-10.7,6.1
				c0,22.8,0,45.5,0,68.4c-6.2,3.6-12.3,7.1-19.2,11.1c0-22.9,0-45,0-68.3c-4.1,2.3-7.4,4.1-10.7,6c0,22.9,0,45.5,0,68.4
				c-6.3,3.6-12.5,7.2-19.2,11.1c0-30.8,0-60.9,0-91.4C115.8,85.3,141.9,70.2,168.8,54.7z'
          ></path>
          <path
            fill='#3b128d'
            d='M54.5,17.2c26.3,15.1,52.4,30.2,79.3,45.7c-6.6,3.9-12.9,7.5-19.5,11.3c-26.1-15-52.4-30.2-79.3-45.7
				C41.8,24.6,48.1,20.9,54.5,17.2z'
          ></path>
          <path
            fill='#3b128d'
            d='M163.7,45.7c-6.8,3.9-13,7.5-19.5,11.2c-26.1-15-52.3-30.1-79.3-45.6c6.8-3.9,13-7.5,19.4-11.3
				C110.6,15.2,136.9,30.3,163.7,45.7z'
          ></path>
          <path
            fill='#3b128d'
            d='M103.8,80.2C97,84.1,91,87.6,84.4,91.4c-26-15-52.3-30.1-79.3-45.7c6.8-3.9,13.1-7.6,19.4-11.2
				C50.9,49.7,77,64.7,103.8,80.2z'
          ></path>
          <path
            fill='#00affa'
            d='M59.1,88.8c7,4.1,13.3,7.7,19.6,11.4c0,29.3,0,58.2,0,85.8C52.4,158.6,59,123.5,59.1,88.8z'
          ></path>
          <path
            fill='#00affa'
            d='M61.4,181.5C41.6,170.1,20.9,158.2,0,146.2c0-7.2,0-14.3,0-22.3C25.1,139.1,55.7,147.5,61.4,181.5z'
          ></path>
          <path
            fill='#00affa'
            d='M48.9,132.6c-9.4-20.4-24.8-36.7-17.9-60c5.6,3.2,11.8,6.8,17.9,10.3C48.9,99.1,48.9,114.9,48.9,132.6z'
          ></path>
          <path
            fill='#00affa'
            d='M0,90.4c22.3,5,27.8,24.6,37.4,42.8c-13.3-7.6-25.3-14.6-37.4-21.5C0,104.3,0,97.2,0,90.4z'
          ></path>
          <path
            fill='#00affa'
            d='M0,54.8c6.8,3.9,12.9,7.5,19.2,11.1c0,7.3,0,14.4,0,22.4C12.5,84.5,6.3,80.9,0,77.3C0,70,0,62.9,0,54.8z'
          ></path>
        </g>
      </g>
    </g>
  </svg>
)

/* ========================================================================
                              PaginatorDemo
======================================================================== */

export const PaginatorDemo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = searchParams.get('page')
    // If there is no key/value for currentPage query string, it will be null.
    if (currentPage && typeof currentPage === 'string') {
      return parseInt(currentPage)
    }
    return 1
  })

  const totalSize = Array.isArray(data) ? data.length : 0

  const [numberedItems, setNumberedItems] = useState<1 | 3 | 5 | 7>(1)

  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    const itemsPerPage = searchParams.get('itemsPerPage')
    if (itemsPerPage && typeof itemsPerPage === 'string') {
      return parseInt(itemsPerPage)
    }
    return 10
  })

  /* ======================
        useEffect()
  ====================== */
  // Update the number of numbered PaginationItems responsively by
  // setting numberedItems based on viewport width.

  useEffect(() => {
    // 'this' or 'e' could be used to get innerWidth when the function is called
    // from within the listener, but we also want to call it outside of the listener...
    function updateNumberedItems(/*this: any, e: any */) {
      if (window.innerWidth < 576) {
        setNumberedItems(1)
      } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        setNumberedItems(3)
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        setNumberedItems(5)
      } else if (window.innerWidth >= 992) {
        setNumberedItems(7)
      }
    }

    const debouncedUpdateNumberedItems: any = debounce(updateNumberedItems, 250)
    updateNumberedItems() // Call once on mount
    window.addEventListener('resize', debouncedUpdateNumberedItems)

    return () => {
      window.removeEventListener('resize', debouncedUpdateNumberedItems)
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // WDS:          https://www.youtube.com/watch?v=VenLRGHx3D4
  //               https://www.youtube.com/watch?v=oZZEI23Ri6E
  // ByteGrad:     https://www.youtube.com/watch?v=ukpgxEemXsk&t=2s
  // CoderOne:     https://www.youtube.com/watch?v=h9hYnDe8DtI&t=145s
  // Sam Selikoff: https://www.youtube.com/watch?v=sFTGEs2WXQ4
  //               https://www.youtube.com/watch?v=fYqMPvPvVAc
  // Theo:         https://www.youtube.com/watch?v=t3FUkq7yoCw
  //
  // John Reilly:  https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
  //               https://johnnyreilly.com/react-usesearchparamsstate
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    navigate(`?page=${currentPage}`)
  }, [currentPage, navigate])

  // Check to make sure that navigate isn't triggering a remount.
  // useEffect(() => { console.log('Page Mounted!')}, [])

  /* ======================
  renderSelectItemsPerPage()
  ====================== */

  const renderSelectItemsPerPage = () => {
    return (
      <div
        className='input-group'
        style={{
          margin: '0 auto 15px auto',
          maxWidth: 300
        }}
      >
        <span
          className='input-group-text'
          style={{
            borderColor: '#409',
            backgroundColor: '#409',
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            maxHeight: '100%'
          }}
        >
          Items Per Page
        </span>

        {/* Using <select> is much less error prone than
        allowing a user-defined value through a text input. */}
        <select
          className='form-select form-select-sm'
          style={{
            borderColor: '#409',
            color: '#00b5e2',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
            maxHeight: '100%',
            textAlign: 'center'
          }}
          onChange={(e) => {
            const value: any = parseFloat(e.target.value)
            setItemsPerPage(parseFloat(value))
            setCurrentPage(1)
          }}
          value={itemsPerPage}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    )
  }

  /* ======================
    renderPaginatedData()
  ====================== */

  const renderPaginatedData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const filterItemsByIndexRange = (_item: any, index: number) => {
      const firstIndex = currentPage * itemsPerPage - itemsPerPage
      const lastIndex = firstIndex + (itemsPerPage - 1)
      return index >= firstIndex && index <= lastIndex
    }

    return (
      <div
        style={{
          margin: '0 auto 15px auto',
          maxWidth: 300,
          position: 'relative'
        }}
      >
        <ul className='list-group shadow-sm'>
          {data.filter(filterItemsByIndexRange).map((item) => {
            return (
              <li // eslint-disable-line
                className={`list-group-item flex items-center justify-between border-[#409] px-4 py-2 text-sm font-bold text-[#00b5e2] hover:bg-[rgba(0,181,226,0.75)] hover:text-white`}
                key={item.id}
                onClick={() => {
                  //# navigate(`/item/${item.id}`)
                }}
              >
                <div>{item.title}</div>

                <div style={{ width: 15 }}>{mainStemLogo}</div>
              </li>
            )
          })}
        </ul>

        {/* <Ribbon>DEMO</Ribbon> */}
      </div>
    )
  }

  /* ======================
      renderPagination()
  ====================== */

  const renderPagination = () => {
    if (typeof totalSize === 'number' && totalSize > 0) {
      return (
        <Fragment>
          <nav
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 5
            }}
          >
            <div
            // The borderRadius is defined by the buttons that are inside
            // of the pagination items <li>s. For that reason, it's a little
            // tricky to modify the borderRadius. This is a workaround for that.
            // It works in conjunciton with paginationStyle={{margin: -1 }}
            // But then the top and bottom of the focus shadow are cut off.
            // This is one of those situations where styled components would be
            // very useful.
            // style={{ borderRadius: 10, border: '1px solid #409', overflow: 'hidden' }}
            >
              <Paginator
                onClick={(newPage, prevPage, e) => {
                  console.log({ newPage, prevPage, e })
                  if (typeof newPage === 'number') {
                    setCurrentPage(newPage)
                  }
                }}
                // Note: when active variants are not defined, they default to
                // the non-active counterparts. The active variants overwrite and
                // entirely REPLACE the non-active variants, rather than merging with them.
                // activePaginationButtonClassName=''
                activePaginationButtonStyle={{
                  // Console warning: Removing a style property during rerender (border) when a conflicting
                  // property is set (borderColor) can lead to styling bugs. To avoid this, don't mix
                  // shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.
                  backgroundColor: '#00b5e2',
                  border: '1px solid #409',
                  color: '#fff'
                }}
                // activePaginationItemClassName=''
                // activePaginationItemStyle={{}}

                // activeOnFocusButtonStyle={{
                //   backgroundColor: '#00b5e2',
                //   border: '1px solid #409',
                //   color: '#fff'
                // }}
                activeOnHoverButtonStyle={{
                  backgroundColor: '#00b5e2',
                  border: '1px solid #409',
                  color: '#fff'
                }}
                paginationClassName=''
                paginationSize='small'
                paginationStyle={{
                  margin: 0
                }}
                paginationItemClassName=''
                paginationItemStyle={{}}
                paginationButtonClassName=''
                paginationButtonStyle={{
                  border: '1px solid #409',
                  color: '#409'
                }}
                onFocusButtonStyle={{
                  boxShadow: '0 0 0 0.25rem rgba(0, 181, 226, 0.5)',
                  transition: 'none'
                }}
                onHoverButtonStyle={{ backgroundColor: '#409', color: '#fff' }}
                numberedItems={numberedItems}
                page={currentPage}
                itemsPerPage={
                  typeof itemsPerPage === 'number' ? itemsPerPage : 10
                }
                itemCount={Array.isArray(data) ? data.length : 0}
                showFirstLast={true}
                showPrevNext={true}
              />
            </div>
          </nav>

          <div style={{ color: '#00b5e2', fontSize: 10, textAlign: 'center' }}>
            Showing Page{' '}
            <span style={{ color: '#409', fontWeight: 'bold' }}>
              {currentPage}
            </span>{' '}
            of{' '}
            <span style={{ color: '#409', fontWeight: 'bold' }}>
              {Math.ceil(totalSize / itemsPerPage)}
            </span>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h3
          style={{
            color: '#333',
            fontWeight: 'bold',
            margin: 0,
            textAlign: 'center'
          }}
        >
          {/* https://unicode.org/emoji/charts/full-emoji-list.html */}
          🎱 Reply hazy, try again...
        </h3>
        <div
          className='text-bold text-center'
          style={{ color: '#333', fontSize: 12 }}
        >
          (No Results)
        </div>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */
  return (
    <>
      {renderSelectItemsPerPage()}
      {renderPaginatedData()}
      {renderPagination()}
    </>
  )
}
