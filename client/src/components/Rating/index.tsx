import React, { useState, useRef, useEffect, JSX } from 'react'
import { FullStar, EmptyStar, HeartEmptyIcon, HeartFullIcon } from './shapes'
import { RatingProps } from './types'

/* ========================================================================
                                Rating
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This was originally based off of react-custom-rating-component
// https://github.com/KimeraMoses/react-custom-rating-component/tree/master
// For a more full-featured solution see:
//
//  https://www.npmjs.com/package/@smastrom/react-rating
//  https://mui.com/material-ui/react-rating/
//
///////////////////////////////////////////////////////////////////////////

export const Rating = ({
  activeColor = 'orange', // ???
  className = '',
  count = 5,
  defaultColor = 'gray',
  defaultValue = 0,
  onChange,
  onHover,
  precision = 1,
  readOnly = false,
  shape = 'star',
  showTitle = false,
  size = '24px',
  spacing = '5px',
  titleArray = ['Poor', 'Good', 'Very Good', 'Best', 'Excellent']
}: RatingProps) => {
  if (showTitle && titleArray.length < count) {
    throw new Error('titleArray length must be greater than or equal to count.')
  }
  const [activeIcon, setActiveIcon] = useState<number>(defaultValue)
  const [hoverActiveIcon, setHoverActiveIcon] = useState<number>(-1)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const ratingContainerRef = useRef<HTMLDivElement | null>(null)

  /* ======================
      calculateRating())
  ====================== */

  const calculateRating = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): number => {
    const { width, left } = ratingContainerRef.current!.getBoundingClientRect()
    const percent = (e.clientX - left) / width
    const numberInStars = percent * count
    const nearestNumber =
      Math.round((numberInStars + precision / 2) / precision) * precision

    return Number(
      nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0)
    )
  }

  /* ======================
        handleClick()
  ====================== */

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (readOnly) {
      return
    }
    setIsHovered(false)
    setActiveIcon(calculateRating(e))

    if (typeof onChange === 'function') {
      onChange(calculateRating(e))
    }
  }

  /* ======================
      handleMouseMove()
  ====================== */

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (readOnly) {
      return
    }
    setIsHovered(true)
    setHoverActiveIcon(calculateRating(e))

    if (typeof onHover === 'function') {
      onHover(calculateRating(e))
    }
  }

  /* ======================
       handleMouseLeave()
  ====================== */

  const handleMouseLeave = (): void => {
    if (readOnly) {
      return
    }
    setHoverActiveIcon(-1) // Reset to default state
    setIsHovered(false)
  }

  /* ======================
          getShape()
  ====================== */

  const getShape = (style: string): JSX.Element => {
    switch (shape) {
      case 'heart':
        if (style === 'full') {
          return (
            <HeartFullIcon
              activeColor={activeColor}
              defaultColor={defaultColor}
              svgStyle={{ height: size, width: size }}
            />
          )
        }
        return (
          <HeartEmptyIcon
            activeColor={activeColor}
            defaultColor={defaultColor}
            svgStyle={{ height: size, width: size }}
          />
        )
      default:
        if (style === 'full') {
          return (
            <FullStar
              activeColor={activeColor}
              defaultColor={defaultColor}
              svgStyle={{ height: size, width: size }}
            />
          )
        }
        return (
          <EmptyStar
            activeColor={activeColor}
            defaultColor={defaultColor}
            svgStyle={{ height: size, width: size }}
          />
        )
    }
  }

  /* ======================
          useEffect()
  ====================== */
  // DC: The original version only used default value as the initial value.
  // This created an issue where the value never updated dynamically on rerender.

  useEffect(() => {
    setActiveIcon(defaultValue)
  }, [defaultValue])

  /* ======================
       renderItems()
  ====================== */

  const renderItems = () => {
    return new Array(count).fill('').map((_, index) => {
      const activeState = isHovered ? hoverActiveIcon : activeIcon
      const showEmptyIcon = activeState === -1 || activeState < index + 1

      ///////////////////////////////////////////////////////////////////////////
      //
      // For some reason in the original verions titleArray wass only shown when
      // isRatingWithPrecision. That seems like a strange decision. Consequently,
      // I've commented out that logic and the associated JSX.
      //
      //   const isActiveRating = activeState !== 1
      //   const isRatingWithPrecision = activeState % 1 !== 0
      //   const isRatingEqualToIndex = Math.ceil(activeState) === index + 1
      //   const showRatingWithPrecision = isActiveRating && isRatingWithPrecision && isRatingEqualToIndex
      //
      // Then I put title on a different <div>.
      //
      ///////////////////////////////////////////////////////////////////////////
      return (
        <div
          key={index}
          style={{
            position: 'relative'
          }}
        >
          {/* <div
            style={{
              width: showRatingWithPrecision
                ? `${(activeState % 1) * 100}%`
                : '0%',

              overflow: 'hidden',
              position: 'absolute',
            }}
            title={showTitle ? titleArray[index] : ''}
          >
            {getShape('full')}
          </div> */}
          <div title={showTitle ? titleArray[index] : ''}>
            {showEmptyIcon ? getShape('empty') : getShape('full')}
          </div>
        </div>
      )
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <div // eslint-disable-line
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ratingContainerRef}
      className={className}
      style={{
        // It's important that the container be only as long as the stars.
        // Otherwise the onMouseMove/onMouseLeave calculations will be off.
        display: 'inline-flex',
        gap: spacing,
        position: 'relative',
        cursor: readOnly ? 'default' : 'pointer',
        lineHeight: 0,
        boxSizing: 'border-box',
        padding: 0,
        margin: 0
      }}
    >
      {renderItems()}
    </div>
  )
}
