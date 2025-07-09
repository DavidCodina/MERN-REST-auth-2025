// Third-party imports
import './animate.css'
import { forwardRef, useEffect, useState } from 'react'

interface IAnimation {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  disableOnMount?: boolean
  duration?: number

  containerClassName?: string
  containerStyle?: React.CSSProperties
  removeContainer?: boolean
}

/* ========================================================================
                              Animation
======================================================================== */

export const Animation = forwardRef<HTMLDivElement, IAnimation>(
  (
    {
      children,
      className = '',
      delay = 0,
      duration = 1000,
      containerClassName = '',
      containerStyle = {},
      disableOnMount = true,
      style = {},
      removeContainer = false
    }: IAnimation,
    ref
  ) => {
    const [durationStyle, setDurationStyle] = useState<any>(() => {
      if (disableOnMount) {
        return {
          WebkitAnimationDuration: '0s',
          animationDuration: '0s'
        } as React.CSSProperties
      }
      return duration
        ? ({
            WebkitAnimationDuration: `${duration}ms`,
            animationDuration: `${duration}ms`,
            '--animate-duration': `${duration}ms`
          } as React.CSSProperties)
        : {}
    })

    const delayStyle = delay
      ? ({
          animationDelay: `${delay}ms`,
          '--animate-delay': `${delay}ms`,
          WebkitAnimationDelay: `${delay}ms`
        } as React.CSSProperties)
      : {}

    /* ======================
          useEffect()
    ====================== */
    // If disableOnMount is true, then durationStyle state will have been
    // initialized to zero seconds. This useEffect then lifts that
    // constraint, allowing the animation to function as normal.

    useEffect(() => {
      if (!disableOnMount) {
        return
      }

      const newDurationStyle = duration
        ? ({
            WebkitAnimationDuration: `${duration}ms`,
            animationDuration: `${duration}ms`,
            '--animate-duration': `${duration}ms`
          } as React.CSSProperties)
        : {}

      const buffer = 200
      const timeoutDuration = (duration || 1000) + delay + buffer

      const timeout = setTimeout(() => {
        setDurationStyle(newDurationStyle)
      }, timeoutDuration)

      return () => {
        clearTimeout(timeout)
      }
    }, [delay, disableOnMount, duration])

    /* ======================
            return
    ====================== */

    if (removeContainer) {
      return (
        <div
          className={`animate__animated${className ? ` ${className}` : ''}`}
          ref={ref}
          style={{
            ...style,
            ...delayStyle,
            ...durationStyle
          }}
        >
          {children}
        </div>
      )
    }
    // Why are there two <div>s? This is to prevent the actual animation from
    // affecting the value of entry.intersecting when applying an intersection observer.

    return (
      <div className={containerClassName} ref={ref} style={containerStyle}>
        <div
          className={`animate__animated${className ? ` ${className}` : ''}`}
          style={{
            ...style,
            ...delayStyle,
            ...durationStyle
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)
