import { CSSProperties } from 'react'
import { useThemeContext } from 'contexts'
import './styles.css'

interface IHR {
  color?: string
  style?: React.CSSProperties
}

/* ========================================================================
                                    HR
======================================================================== */

export const HR = ({ color = '', style = {} }: IHR) => {
  const { mode } = useThemeContext()
  return (
    <div
      className='xx-horizontal-ruler'
      style={
        {
          // One can pass CSS custom properties inline, but Typescript needs reassurance.
          '--hr-color': color
            ? color
            : mode === 'dark'
              ? 'var(--dark-primary-color)'
              : '#409',
          ...style
        } as CSSProperties
      }
    >
      {[...Array(39)].map((_value, index) => {
        return <hr key={index} />
      })}
    </div>
  )
}
