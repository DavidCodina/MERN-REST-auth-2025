import React from 'react'

interface IRating {
  className?: string
  color?: string
  value: number
  text?: string
}

/* ============================================================================
                                    Rating                 
============================================================================ */
// This version is from a Traversy eCommerce project.

const Rating = ({
  className = '',
  color = 'rgb(255, 215, 0)',
  text,
  value
}: IRating) => {
  return (
    <div className={className}>
      {/* =====================
              Star 1
      ===================== */}

      <span>
        <i
          style={{ color }}
          className={
            value >= 1
              ? 'fas fa-star'
              : value >= 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
          }
        ></i>
      </span>

      {/* =====================
              Star 2
      ===================== */}

      <span>
        <i
          style={{ color }}
          className={
            value >= 2
              ? 'fas fa-star'
              : value >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
          }
        ></i>
      </span>

      {/* =====================
              Star 3
      ===================== */}

      <span>
        <i
          style={{ color }}
          className={
            value >= 3
              ? 'fas fa-star'
              : value >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
          }
        ></i>
      </span>

      {/* =====================
              Star 4
      ===================== */}

      <span>
        <i
          style={{ color }}
          className={
            value >= 4
              ? 'fas fa-star'
              : value >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
          }
        ></i>
      </span>

      {/* =====================
              Star 5
      ===================== */}

      <span className='me-2'>
        <i
          style={{ color }}
          className={
            value >= 5
              ? 'fas fa-star'
              : value >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
          }
        ></i>
      </span>

      {/* =====================
              Text
      ===================== */}

      {text && <span className='text-secondary'>{text}</span>}
    </div>
  )
}

export { Rating }
