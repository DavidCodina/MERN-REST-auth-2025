import { CSSProperties } from 'react'

export interface RatingProps {
  /** The value to increment rating when hovered or clicked. */
  precision?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
  /** The number of Icons to display. */
  count?: number
  shape?: 'star' | 'heart'
  activeColor?: string
  defaultColor?: string
  /** This is the value of the rating displayed by default.
   * Supply this if your rating is also a readOnly */
  defaultValue: number
  readOnly?: boolean

  className?: string //?^ Was misspelled classNames in original.
  size?: string
  /** This defines the fap between the Icons used. */
  spacing?: string
  titleArray?: string[]
  /** This defines whether to display the titles. It only works when !readOnly. */
  showTitle?: boolean
  /** This is the function that is called when the rating value changes, */
  onChange?: (newRating: number) => void
  onHover?: (hoveredRating: number) => void
}

export interface IconProps {
  svgStyle: SvgStyle
  activeColor?: string
  defaultColor: string
}

export interface SvgStyle extends Omit<CSSProperties, 'width' | 'height'> {
  width: string
  height: string
}
