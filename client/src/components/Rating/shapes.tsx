import { IconProps } from './types'

/* ======================

====================== */

export const FullStar = ({ svgStyle, activeColor }: IconProps) => {
  return (
    <div style={{ color: activeColor }}>
      <svg viewBox={'0 0 51 48'} style={svgStyle}>
        <path
          d={'m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z'}
          fill='currentColor'
        ></path>
      </svg>
    </div>
  )
}

/* ======================

====================== */

export const EmptyStar = ({
  svgStyle,
  defaultColor = 'rgb(203, 211, 227)',
  activeColor
}: IconProps) => {
  const pathStyle = {
    fill: defaultColor,
    transition: 'fill .2s ease-in-out'
  }

  return (
    <div style={{ color: activeColor }}>
      <svg viewBox={'0 0 51 48'} style={svgStyle}>
        <path
          style={pathStyle}
          d={'m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z'}
        />
      </svg>
    </div>
  )
}

/* ======================

====================== */

export const HeartEmptyIcon = ({
  svgStyle,
  activeColor,
  defaultColor
}: IconProps) => {
  return (
    <div style={{ color: activeColor }}>
      <svg viewBox='0 0 24 24' style={svgStyle} fill={defaultColor}>
        <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'></path>
      </svg>
    </div>
  )
}

/* ======================

====================== */

export const HeartFullIcon = ({ svgStyle, activeColor }: IconProps) => {
  return (
    <div style={{ color: activeColor }}>
      <svg viewBox='0 0 24 24' style={svgStyle} fill='currentColor'>
        <path d='m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'></path>
      </svg>
    </div>
  )
}
