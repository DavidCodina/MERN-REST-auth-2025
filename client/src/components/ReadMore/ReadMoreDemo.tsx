import { Fragment, useState } from 'react'
import { ReadMore } from './'

/* ========================================================================
                                ReadMoreDemo
======================================================================== */

export const ReadMoreDemo = () => {
  const [value, setValue] = useState(false)
  const [buttonNeeded, setButtonNeeded] = useState(true)

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      {buttonNeeded && (
        <button
          className='btn-sky btn-xs mx-auto mb-6 block'
          onClick={() => {
            setValue((v) => !v)
          }}
          style={{ minWidth: 100 }}
        >
          {value ? 'Read Less' : 'Read More'}
        </button>
      )}

      <ReadMore
        className={`mb-6 rounded-lg border border-indigo-800 bg-white p-2 shadow-lg [--read-more-button-bg:white] [--read-more-button-color:theme(colors.indigo.700)] [--read-more-button-font-size:inherit]`}
        // Setting lineHeight and/or fontSize here is inherited by the 'Read More' button.
        // style={{ lineHeight: 2, fontSize: 20 }}
        maxLines={2}
        buttonInline
        moreText={'Read More ↓'}
        lessText={'Read Less ↑'}
        // noButton
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        onResize={(buttonNeeded) => {
          console.log('buttonNeeded:', buttonNeeded)
          setButtonNeeded(buttonNeeded)
        }}
      >
        <p
        // Setting lineHeight and/or fontSize here is NOT inherited by the 'Read More' button,
        // and would therefore require the consumer to manually set the 'Read More' button's
        // styles to match that of the children content.
        // style={{ fontSize: 20 }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga deleniti
          reprehenderit recusandae. Ipsa cum, aliquam harum veniam ratione eos
          obcaecati porro excepturi odio velit accusantium possimus, tempora
          vitae nam mollitia nesciunt illum consectetur deserunt non!{' '}
        </p>
        {/* <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga deleniti
          reprehenderit recusandae. Ipsa cum, aliquam harum veniam ratione eos
          obcaecati porro excepturi odio velit accusantium possimus, tempora
          vitae nam mollitia nesciunt illum consectetur deserunt non! Error
          numquam explicabo sed ex, dolorem debitis ratione fugit aut!
        </p>
        <p>
          Animi laboriosam ad dicta saepe maiores aliquid molestias repudiandae
          velit! Reprehenderit labore doloribus in cupiditate saepe rem vel
          nobis ducimus et dolorem, excepturi ullam magnam nulla suscipit autem
          eaque eveniet quos. Quae ipsum deserunt pariatur qui exercitationem.
          Sequi, optio, nobis ad aspernatur recusandae provident voluptas vitae
          omnis sed ullam earum fugit saepe minus ea odio.
        </p> */}
      </ReadMore>
    </Fragment>
  )
}
