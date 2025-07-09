///////////////////////////////////////////////////////////////////////////
//
// A simple formatting approach would be ${price.toLocaleString()}
//
// See WDS at 24:30 for a basic currency formatter function.
// https://www.youtube.com/watch?v=lATafp15HWA
//
// See also Dave Gray at 38:00 : https://www.youtube.com/watch?v=6Qqb2GBGgGc
//
// See also this WDS tutorial at 28:45
// https://www.youtube.com/watch?v=iqrgggs0Qk0
//
///////////////////////////////////////////////////////////////////////////

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency'
})

export const formatCurrency = (value: number) => {
  if (typeof value !== 'number') {
    return value
  }
  return CURRENCY_FORMATTER.format(value)
}
