import { useState } from 'react'
import { Pagination, PaginationItem } from './index'

const items = [1, 2, 3, 4, 5]

/* ========================================================================
                              PaginationDemo
======================================================================== */

export const PaginationDemo = () => {
  const [activeItem, setActiveItem] = useState(0)

  /* ======================
            return
    ====================== */

  return (
    <Pagination
      style={{}}
      className='flex justify-center'
      paginationSize='small'
    >
      <PaginationItem
        first
        onClick={() => {
          setActiveItem(1)
        }}
      />
      <PaginationItem
        previous
        onClick={() => {
          setActiveItem((prev) => {
            if (prev === 1) {
              return prev
            }

            return prev - 1
          })
        }}
      />

      {items.map((item) => {
        return (
          <PaginationItem
            active={activeItem === item}
            key={item}
            disabled={false}
            onClick={() => {
              setActiveItem(item)
            }}
            // onFocusButtonStyle={{
            //   outline: '2px dashed green'
            // }}

            // onHoverButtonStyle={{
            //   outline: '2px dashed red'
            // }}

            // paginationButtonClassName='font-bold'
            // paginationButtonStyle={{fontWeight: 'bold'}}

            // paginationItemClassName={{}}
            // paginationItemStyle=''
          >
            {item}
          </PaginationItem>
        )
      })}

      <PaginationItem
        next
        onClick={() => {
          setActiveItem((prev) => {
            if (prev === items.length) {
              return prev
            }

            return prev + 1
          })
        }}
      />
      <PaginationItem
        last
        onClick={() => {
          setActiveItem(items.length)
        }}
      />
    </Pagination>
  )
}
