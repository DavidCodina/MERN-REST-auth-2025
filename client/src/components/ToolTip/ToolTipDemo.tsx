import { Fragment, useState, useEffect } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { Info } from 'lucide-react'

import { ToolTip } from './'

import { Button } from 'components/Button'

/* ========================================================================
                           TooltipDemo
======================================================================== */

export const TooltipDemo = () => {
  // https://github.com/mohsinulhaq/react-popper-tooltip/issues/85
  // https://github.com/mohsinulhaq/react-popper-tooltip/blob/a5255940cb7f7b2592ecd1a3cf0704ed5c829e2b/examples/controlled/src/index.js
  // If you want to have click and hover such that click will persist it
  // Then you need to make it controlled.
  const [controlledVisible, setControlledVisible] = useState(false)
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)

  // usePopperTooltip() always gets implemented on the consuming side.
  // It works fine until you've got a component that implements multiple
  // tooltips. In that case, it may make more sense to have a withTooltip
  // HOC... That said, this tooltip works like a charm (much cleaner than Tippy).
  const {
    getArrowProps, // Passed to Tooltip
    getTooltipProps, // Passed to Tooltip
    // Passed to Tooltip. Onc can also use triggerRef, but this causes
    // Typescript to complain about a ref type mismatch.
    setTooltipRef,
    setTriggerRef, // Pased to the trigger element, can also use tooltipRef
    visible // Passed to Tooltip
  } = usePopperTooltip(
    {
      offset: [0, 15],
      placement: 'top',
      trigger: null, // Set to null for controlled implementation.
      visible: controlledVisible
      // closeOnOutsideClick: false,  // For uncontrolled
      // closeOnTriggerHidden: false, // For uncontrolled: If the trigger element is out of view close tooltip.
      // delayHide: 500,              // For uncontrolled
      // delayShow: 500,              // For uncontrolled
      // defaultVisible: false,       // For uncontrolled
      // onVisibleChange: (state) => { console.log('onVisibleChange', state) }
      // followCursor: false
      // interactive: true, // For uncontrolled: Used in conjunction with delayHide
    },
    // popperOptions
    {
      // placement: 'bottom'
      // modifiers: [],
      // strategy
      // Gotcha: This can actually cause an infinite render cycle, freezing
      // up your app! Seems like a bug. Anyways, don't use this.
      // onFirstUpdate: (state) => {
      //   console.log('First update!', state])
      // }
      // createPopper: ...
    }
  )
  // console.log('rendered')

  /* ======================
        useEffect()
  ====================== */
  // Gotcha: you can't acutally set trigger to ['click', 'hover']. Why?
  // Because the hover will open it, but then the click will close it.
  // Thus if you want to be able to open a tooltip on hover, and keep
  // it open by clicking it then you have to make it controlled.
  // Set trigger: null to make sure it's ONLY being controlled manually.
  // Unfortunately, the logic for this will always have to happen on the
  // consuming side.

  useEffect(() => {
    if ((hover && open) || (!hover && open)) {
      return
    }
    if (hover && !open) {
      setControlledVisible(true)
    } else if (!hover && !open) {
      setControlledVisible(false)
    }
  }, [hover, open])

  /* ======================
          return  
  ====================== */

  return (
    <Fragment>
      <Button
        className='btn-green btn-sm mx-auto my-[100px] block'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen((v) => !v)}
        ref={setTriggerRef}
      >
        Tooltip Button
      </Button>

      <ToolTip
        // background='var(--color-pink-100)'
        // borderColor='var(--color-pink-500)'
        className=''
        ref={setTooltipRef}
        style={{}}
        visible={visible}
        getTooltipProps={getTooltipProps}
        getArrowProps={getArrowProps}
      >
        <div className='flex items-center'>
          <Info className='mr-1 text-lg text-blue-500' />
          <span>
            This is the content inside of the tooltip. It seems to get longer,
            and longer...
          </span>
        </div>
      </ToolTip>
    </Fragment>
  )
}
