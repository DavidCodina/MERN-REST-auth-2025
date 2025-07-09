import { NumericFormat } from 'react-number-format'
import { NumberFormatterProps } from './types'

/* ========================================================================
                            NumberFormatter           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component was taken from Mantine.
//
// https://mantine.dev/core/number-formatter/
// https://github.com/mantinedev/mantine/blob/master/src/mantine-core/src/components/NumberFormatter/NumberFormatter.tsx
//
// Essentially, it's just an abstraction on top of react-number-format:
// https://s-yadav.github.io/react-number-format/
//
// The real question here is what has Mantine decided to abstract
// OUT in the name of simplification that we might actually want?
//
//   I added defaultValue back in to the implementation.
//   I added displayType back in.
//
// Here are some other props that could be useful:
//
// - customInput              : https://s-yadav.github.io/react-number-format/docs/numeric_format/#custominput-reactcomponentany
// - getInputRef              : https://s-yadav.github.io/react-number-format/docs/numeric_format/#custominput-reactcomponentany
// - allowLeadingZeros        : https://s-yadav.github.io/react-number-format/docs/numeric_format/#allowleadingzeros-boolean
// - allowedDecimalSeparators : https://s-yadav.github.io/react-number-format/docs/numeric_format/#alloweddecimalseparators-arraystring
// - isAllowed                : https://s-yadav.github.io/react-number-format/docs/props#isallowed-values--boolean
// - valueIsNumericString     : https://s-yadav.github.io/react-number-format/docs/props#valueisnumericstring-boolean
// - onValueChange            : https://s-yadav.github.io/react-number-format/docs/props#onvaluechange-values-sourceinfo--
// - renderText               : https://s-yadav.github.io/react-number-format/docs/props#rendertext-formattedvalue-customprops--react-element
// - type                     : https://s-yadav.github.io/react-number-format/docs/props#type-string
// = format                   : https://s-yadav.github.io/react-number-format/docs/pattern_format#format-string
// etc.
//
// Usage:
//
//   <NumberFormatter
//     // If you literally put in '1000.50', then it wil output that way.
//     // However, if you put in 1000.5, it will not add the 0.
//     // You actually need to use fixedDecimalScale={true} & decimalScale={2}.
//     // value={'1000.50'}
//     value={-1000.5}
//     // defaultValue={1000.5}
//     // displayType='text'
//     allowNegative={false}
//     prefix='$'
//     // suffix=' USD'
//     fixedDecimalScale
//     decimalScale={2} // rounds to certain number of decimal places.
//     // Obviously, you would never want to do this, but you can.
//     // thousandSeparator='.'
//     // decimalSeparator=','
//     className='block text-center text-4xl font-black text-green-500'
//   />
//
// Ultimately, we'd probably want to expose some other props if we wanted
// to use react-number-format to create formeted number inputs and/or phone inputs.
// That said, I also understand why Mantine removed a lot of the possible options
// in order to not overwhelm the consumer.
//
//# Also, it would be nice to figure out how to use this component to simply return
//# a formmatted string. Alternatively, look at source code to see how it all works.
//# See here to start: https://s-yadav.github.io/react-number-format/docs/customization#intlnumberformat-based-formatting
//# It looks like he might be using Intl.NumberFormat under the hood.
//
///////////////////////////////////////////////////////////////////////////

export function NumberFormatter({
  displayType = 'text',
  value,
  defaultValue,
  ...others
}: NumberFormatterProps) {
  if (value === undefined && defaultValue === undefined) {
    return null
  }

  return (
    <NumericFormat
      displayType={displayType}
      value={value}
      defaultValue={defaultValue}
      {...others}
    />
  )
}
