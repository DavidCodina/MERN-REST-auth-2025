'use client'

import { useRef } from 'react'

import { Pagination, PaginationItem } from '../Pagination'
import { IPaginator, OddNumberUpTo7 } from './types'

/* ========================================================================
                              Paginator
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Why Paginator? If you look at how React component libraries implement
// pagination related components, they might have something like:
//
//  Reactstrap: https://reactstrap.github.io/?path=/docs/components-pagination--pagination
//
//    <Pagination>
//      <PaginationItem>
//        <PaginationLink>1</PaginationLink>
//      </PaginationItem>
//      <PaginationItem>
//        <PaginationLink>2</PaginationLink>
//      </PaginationItem>
//    </Pagination>
//
// React Bootstrap: https://react-bootstrap.github.io/components/pagination/
//
//    <Pagination>
//      <Pagination.Item>1</Pagination.Item>
//      <Pagination.Item>1</Pagination.Item>
//    </Pagination>
//
// The general idea here is that you have <Pagination> and <PaginationItem>
// components, which are essentially dumb components. This means that all
// the business logic needs to be handled within the consuming environment.
// Ultimately, we also want to have dumb <Pagination> and <PaginationItem>
// because it means they can be reused as we see fit. However, we also want
// a reusable pagination implementation that abstract the business logic.
// That's why there is also a Paginator component. Paginator wraps
// <Pagination> and <PaginationItem> and handles all of the tricky stuff
// that we don't want to have to think about.
//
///////////////////////////////////////////////////////////////////////////

export const Paginator = ({
  onHoverButtonStyle = {},
  onFocusButtonStyle = {},
  activePaginationButtonClassName, // Do not add default value here.
  activePaginationButtonStyle, // Do not add default value here.
  activePaginationItemClassName, // Do not add default value here.
  activePaginationItemStyle, // Do not add default value here.
  activeOnHoverButtonStyle, // Do not add default value here.
  activeOnFocusButtonStyle, // Do not add default value here.
  paginationClassName = '',
  paginationStyle = {},
  paginationItemClassName = '',
  paginationItemStyle = {},
  paginationButtonClassName = '',
  paginationButtonStyle = {},
  page, // The page to start on
  itemsPerPage, // How many items to show per a page.
  itemCount, // This should always be: Array.isArray(items) ? items.length : 0
  numberedItems = 3,
  showFirstLast = true,
  showPrevNext = true,
  paginationSize,
  onClick
}: IPaginator) => {
  // If active styles and classNames are not defined, they will default to the non-active counterparts.
  // For this reason, it's important that the destructured props not be given default values.
  activePaginationButtonClassName =
    activePaginationButtonClassName || paginationButtonClassName
  activePaginationButtonStyle =
    activePaginationButtonStyle || paginationButtonStyle
  activePaginationItemClassName =
    activePaginationItemClassName || paginationItemClassName
  activePaginationItemStyle = activePaginationItemStyle || paginationItemStyle
  activeOnHoverButtonStyle = activeOnHoverButtonStyle || onHoverButtonStyle
  activeOnFocusButtonStyle = activeOnFocusButtonStyle || onFocusButtonStyle

  /* ======================

  ====================== */
  // Failsafe: If itemsPerPage is not set for some reason, then set it to itemCount.

  if (typeof itemsPerPage !== 'number' && typeof itemCount === 'number') {
    itemsPerPage = itemCount
  }

  /* ======================

  ====================== */

  const activeButtonRef = useRef<HTMLButtonElement | null>(null)
  // If itemCount is 0, then pages will also evaluate to 0.
  const pages = Math.ceil(itemCount / itemsPerPage)
  const isPrevious = page > 1
  const isNext = itemCount > page * itemsPerPage
  const lastPage = pages

  /* ======================
    Sanitize numberedItems
  ====================== */
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Paginator is designed for numberedItems to be an odd integer. More specifically,
  // it's designed to have a middle point. When the active PaginationItem reaches the
  // middle point (i.e., 3 is the middle point of 5), it stays there until it has no
  // choice but to continue past the middle point. This effect is broken when numberedItems
  // is even.
  //
  // Thus if the consuming code bypasses the Typescript check, this 'sanitization function'
  // will force numberedItems to be a number, an integer, odd, and less than or equal to 7.
  //
  // Typescript gets a little confused at some points below, which is why we type
  // n as number at the beginning and as OddNumberUpTo7 at the end. That said,
  // there's no way n is not actually OddNumberUpTo7.
  //
  // Why only 3, 5, and 7? It's an arbitrary decision, but even at around 500px, the Pagination
  // is barely within the bounds of the viewport when there numberedItems is 7. Moreover, the
  // Pagination gets even longer as additional double and triple digit numbers are rendered.
  // As a partial safeguard for this, Pagination has been given flex-wrap: wrap. One could
  // also wrap Pagination in a container that can horizontally scroll. That said, it's best
  // to avoid any situation where either of those solutions would be useful.
  //
  // One way of correcting for this is by programmatically updating numberedItems as the
  // viewport width increases/decreases. However, that task is best left to the code
  // in the consuming environment.
  //
  ////////////////////////////////////////////////////////////////////////////////

  numberedItems = (function sanitizeNumberedItems() {
    let n: number = numberedItems

    if (typeof n !== 'number') {
      n = 3
    }

    n = Math.floor(n)

    if (n % 2 === 0) {
      n += 1
    }

    if (n > 7) {
      n = 7
    }
    return n as OddNumberUpTo7
  })()

  /* ======================
        setBlur()
  ====================== */
  // I was doing this, but I prefer it without.

  // const setBlur = (e: any) => {
  //   const target = e.target
  //   setTimeout(() => {
  //     target.blur()
  //   }, 0)
  // }

  /* ======================
        updateFocus()
  ====================== */

  const setFocus = () => {
    // console.log('setFocus() called. Here is the activeButtonRef.current', activeButtonRef.current)
    if (!activeButtonRef.current) {
      return
    }
    activeButtonRef.current.focus()
  }

  /* ======================
        Headtrip Area
  ====================== */
  // Calculate the number of PaginationItems before/after the active PaginationItem.

  const maxItemsOnASide = numberedItems - 1
  const maxItemsOnASideWhenActiveItemIsInMiddle = maxItemsOnASide / 2
  const firstPage = 1

  const numberOfPrevPages = (() => {
    let numberOfPrevPages = 0

    // Initially, numberOfPrevPages should be something like this...
    for (let i = 0; i <= lastPage; i++) {
      if (page === firstPage + i) {
        numberOfPrevPages =
          i < maxItemsOnASideWhenActiveItemIsInMiddle
            ? i
            : maxItemsOnASideWhenActiveItemIsInMiddle
        break
      }
    }

    // At a certain point, we want to begin adding to numberOfPrevPages as
    // we get closer to lastPage. That point is difficult to describe, but
    // it seems to be: maxItemsOnASide / 2 - 1.
    // Even though numberedItems has been limited to very small range of
    // odd numbers, this formula has been tested up to numberedItems === 13,
    // and the resulting behavior is consistent.
    for (let i = 0; i <= maxItemsOnASide / 2 - 1; i++) {
      if (page === lastPage - i) {
        numberOfPrevPages = maxItemsOnASide - i
        break
      }
    }

    return numberOfPrevPages
  })()

  // Once we know what numberOfPrevPages is, it's easy to obtain numberOfNextPages
  const numberOfNextPages = maxItemsOnASide - numberOfPrevPages

  /* ======================
  renderPreviousPaginationItem()
  ====================== */

  const renderPreviousPaginationItem = () => {
    const elements = []

    for (
      let previousPage = page - 1;
      previousPage >= page - numberOfPrevPages;
      previousPage--
    ) {
      if (previousPage > 0) {
        elements.push(
          <PaginationItem
            disabled={false}
            key={previousPage}
            onClick={(e) => {
              setFocus()

              onClick?.(previousPage, page, e)
            }}
            onFocusButtonStyle={onFocusButtonStyle}
            onHoverButtonStyle={onHoverButtonStyle}
            //# onMouseDown={setBlur}
            paginationButtonClassName={paginationButtonClassName}
            paginationButtonStyle={paginationButtonStyle}
            paginationItemClassName={paginationItemClassName}
            paginationItemStyle={paginationItemStyle}
          >
            {previousPage}
          </PaginationItem>
        )
      }
    }

    return elements.reverse()
  }

  /* ======================
  renderNextPaginationItem()
  ====================== */

  const renderNextPaginationItem = () => {
    const elements = []

    for (
      let nextPage = page + 1;
      nextPage <= page + numberOfNextPages;
      nextPage++
    ) {
      if (nextPage <= lastPage) {
        elements.push(
          <PaginationItem
            disabled={false}
            key={nextPage}
            onClick={(e) => {
              setFocus()

              onClick?.(nextPage, page, e)
            }}
            onFocusButtonStyle={onFocusButtonStyle}
            onHoverButtonStyle={onHoverButtonStyle}
            //# onMouseDown={setBlur}
            paginationButtonClassName={paginationButtonClassName}
            paginationButtonStyle={paginationButtonStyle}
            paginationItemClassName={paginationItemClassName}
            paginationItemStyle={paginationItemStyle}
          >
            {nextPage}
          </PaginationItem>
        )
      }
    }

    return elements
  }

  /* ======================
          return 
  ====================== */
  // Probably should return null if other props are missing as well...

  if (!itemCount || itemCount === 0) {
    return null
  }

  return (
    <Pagination
      className={paginationClassName}
      paginationSize={paginationSize}
      style={paginationStyle}
    >
      {/* First Page: « */}
      {showFirstLast && (
        <PaginationItem
          disabled={!isPrevious}
          first // Adds the left chevron
          onFocusButtonStyle={onFocusButtonStyle}
          onHoverButtonStyle={onHoverButtonStyle}
          onClick={(e) => {
            // https://freshman.tech/snippets/typescript/fix-value-not-exist-eventtarget/
            const target = e.target as HTMLButtonElement
            if (target) {
              target.focus()
            }

            onClick?.(1, page, e)
          }}
          paginationButtonClassName={paginationButtonClassName}
          paginationButtonStyle={paginationButtonStyle}
          paginationItemClassName={paginationItemClassName}
          paginationItemStyle={paginationItemStyle}
        />
      )}

      {/* Previous Page: ‹ */}
      {showPrevNext && (
        <PaginationItem
          disabled={!isPrevious}
          onFocusButtonStyle={onFocusButtonStyle}
          onHoverButtonStyle={onHoverButtonStyle}
          onClick={(e) => {
            // Why are we doing this? Because by default Safari won't give focus to buttons.
            const target = e.target as HTMLButtonElement
            if (target) {
              target.focus()
            }
            const newPage = page - 1 > 1 ? page - 1 : 1

            onClick?.(newPage, page, e)
          }}
          paginationButtonClassName={paginationButtonClassName}
          paginationButtonStyle={paginationButtonStyle}
          paginationItemClassName={paginationItemClassName}
          paginationItemStyle={paginationItemStyle}
          previous // Adds the left arrow
        />
      )}

      {renderPreviousPaginationItem()}

      <PaginationItem
        active={true}
        disabled={false}
        onFocusButtonStyle={activeOnFocusButtonStyle}
        onHoverButtonStyle={activeOnHoverButtonStyle}
        paginationButtonClassName={activePaginationButtonClassName}
        paginationButtonStyle={activePaginationButtonStyle}
        paginationItemClassName={activePaginationItemClassName}
        paginationItemStyle={activePaginationItemStyle}
        ref={activeButtonRef}
        // title="I'm the active button"
      >
        {page}
      </PaginationItem>

      {renderNextPaginationItem()}

      {/* Next Page: › */}
      {showPrevNext && (
        <PaginationItem
          disabled={!isNext}
          next // Adds the right arrow
          onClick={(e) => {
            const target = e.target as HTMLButtonElement
            if (target) {
              target.focus()
            }
            const newPage = page + 1 < pages ? page + 1 : pages

            onClick?.(newPage, page, e)
          }}
          onFocusButtonStyle={onFocusButtonStyle}
          onHoverButtonStyle={onHoverButtonStyle}
          paginationButtonClassName={paginationButtonClassName}
          paginationButtonStyle={paginationButtonStyle}
          paginationItemClassName={paginationItemClassName}
          paginationItemStyle={paginationItemStyle}
        />
      )}

      {/* Last Page: » */}
      {showFirstLast && (
        <PaginationItem
          disabled={!isNext}
          last // Adds the right chevron
          onClick={(e) => {
            const target = e.target as HTMLButtonElement
            if (target) {
              target.focus()
            }

            onClick?.(lastPage, page, e)
          }}
          onFocusButtonStyle={onFocusButtonStyle}
          onHoverButtonStyle={onHoverButtonStyle}
          paginationButtonClassName={paginationButtonClassName}
          paginationButtonStyle={paginationButtonStyle}
          paginationItemClassName={paginationItemClassName}
          paginationItemStyle={paginationItemStyle}
        />
      )}
    </Pagination>
  )
}
