import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { Paginator } from '../index'
import { debounce } from './lodash.debounce'
import { fetchPeople } from './fetchPeople'

// SWAPI always only returns 10 items per a page.
const itemsPerPage = 10

/* ========================================================================
                              SWAPIDemo
======================================================================== */
//# It might be nice to show a loading spinner inside of the active pagination item
//# if/when loading is passed to paginator, and loading is true.
//# This would help the user understand why they can't click on new items when
//# pagination is disabled by a 'pending' state.

//! This all seems a bit over-engineered.
//! See PageStore --> Store --> ProductLIst for a better example.
export const SWAPIDemo = () => {
  /* ======================
       state & refs
  ====================== */

  const firstRenderRef = useRef(true)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<any>(null) //! Temporary any....................
  const [itemCount, setItemCount] = useState(0)

  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = searchParams.get('page')
    // If there is no key/value for currentPage query string, it will be null.
    if (currentPage && typeof currentPage === 'string') {
      return parseInt(currentPage)
    }
    return 1
  })

  const [prevPage, setPrevPage] = useState(0)

  // currentPage updates before currentData is necessarily available.
  // Use the previousData when currrentData is not available yet.
  //# However, if there's no previous page show a loader...
  const currentSubset = data?.[currentPage] || null
  const prevSubset = data?.[prevPage] || null

  const isCurrentSubset = currentSubset ? true : false
  const subset = currentSubset || prevSubset

  const isSubset = Array.isArray(subset) && subset.length > 0

  const [numberedItems, setNumberedItems] = useState<1 | 3 | 5 | 7>(1)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  /* ======================
      handleFetchPeople()
  ====================== */

  const handleFetchPeople = useCallback(async (pageNumber: number) => {
    setStatus('pending')
    try {
      const result = await fetchPeople(
        'https://swapi.dev/api/people',
        pageNumber
      )

      if (
        Array.isArray(result.data) &&
        typeof result.currentPage === 'number'
      ) {
        //! Temporary any...
        setData((prevData: any) => {
          return {
            ...prevData,
            [result.currentPage]: result.data
          }
        })
      }

      if (typeof result.count === 'number') {
        setItemCount(result.count)
      }

      if (result.success === true) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')

      return err
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // On first render fetch the data associated to currentPage.
  // After that handleFetchPeople() is triggered by pagination clicks.

  useEffect(() => {
    if (firstRenderRef.current !== true) {
      return
    }
    firstRenderRef.current = false
    handleFetchPeople(currentPage)
  }, [currentPage, handleFetchPeople])

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
    renderPaginatedData()
  ====================== */

  // Delete stale data. This prevents stale data from appearing when
  // the 'error' status is removed, which would be very confusing.

  // setData((prevData: any) => {
  //   if (!prevData?.[pageNumber]) {
  //     return prevData
  //   }
  //   const newData = { ...prevData }
  //   delete newData[pageNumber]
  //   return newData
  // })

  const renderPaginatedData = () => {
    if (status === 'error' && data?.[currentPage]) {
      //# Toast message
      toast.error(
        'Unable to fetch fresh results. Currently showing stale data.',
        {
          autoClose: false
        }
      )
    } else if (status === 'error') {
      return (
        <div className='mx-auto mb-6 flex h-[371px] max-w-[500px] flex-col items-center rounded-xl border border-red-800 bg-red-50 p-4 shadow'>
          <p className='mb-0 text-lg font-semibold text-red-700'>
            Whoops! Something went wrong. Click the 'Try Again' button to retry
            the same page, or click a pagination item (if available).
          </p>

          <div className='flex flex-1 items-center'>
            <button
              className='btn-red btn-sm mx-auto -mt-8 block min-w-[150px]'
              onClick={() => {
                handleFetchPeople(currentPage)
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    if (status === 'pending' && !isSubset) {
      return (
        <div className='mx-auto mb-6 flex h-[371px] max-w-[500px] items-center justify-center'>
          <span className='text-3xl font-black text-blue-500'>Loading...</span>
        </div>
      )
    } else if (!isSubset) {
      return null
    }

    return (
      <div className='relative mx-auto mb-6 max-w-[500px]'>
        <ul className='list-group shadow-sm'>
          {subset.map((item: any, index) => {
            // This is a super hacky way to generate numbered items for this demo.
            const itemNumber = isCurrentSubset
              ? index + 1 + (currentPage - 1) * itemsPerPage
              : index + 1 + (prevPage - 1) * itemsPerPage

            return (
              <li // eslint-disable-line
                className={`list-group-item flex items-center justify-between border-[#409] px-4 py-2 text-sm font-bold text-[#00b5e2] hover:bg-[rgba(0,181,226,0.75)] hover:text-white`}
                key={item.name}
                onClick={() => {
                  //# ...
                }}
              >
                <div>
                  {itemNumber}: {item.name}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  /* ======================
      renderPagination()
  ====================== */

  const renderPagination = () => {
    if (itemCount < 1) {
      return null
    }

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
              onClick={(newPage, prevPage, _e) => {
                if (status === 'pending') {
                  return
                }
                if (typeof newPage === 'number') {
                  setCurrentPage(newPage)
                  handleFetchPeople(newPage)
                }

                ///////////////////////////////////////////////////////////////////////////
                //
                // Initially, I was setting prevPage as a side effect of currentPage changing.
                //
                //   useLayoutEffect(() => {
                //     return () => { setPrevPage(currentPage) }
                //   }, [currentPage])
                //
                // However, that's not necessary because Paginator's onClick now gives us prevPage
                // back, so we can set it at the same time as currentPage.
                //
                ///////////////////////////////////////////////////////////////////////////

                if (typeof prevPage === 'number') {
                  setPrevPage(prevPage)
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
              itemCount={itemCount}
              showFirstLast={true}
              showPrevNext={true}
            />
          </div>
        </nav>

        <div style={{ color: '#00b5e2', fontSize: 12, textAlign: 'center' }}>
          Showing Page{' '}
          <span style={{ color: '#409', fontWeight: 'bold' }}>
            {currentPage}
          </span>{' '}
          of{' '}
          <span style={{ color: '#409', fontWeight: 'bold' }}>
            {Math.ceil(itemCount / itemsPerPage)}
          </span>
        </div>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */
  return (
    <>
      {renderPaginatedData()}
      {renderPagination()}
    </>
  )
}
