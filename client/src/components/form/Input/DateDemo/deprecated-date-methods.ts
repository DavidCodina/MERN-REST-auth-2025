//! Why are these deprecated? Originally, I made them to correct for the 'off by 1' (day) effect
//! That occurs when you initialize a new Date with an ISO string. However, I've realized that
//! the 'off by 1' (day) effect is not really a bad thing. It's expected behavior when you treat
//! All dates as UTC dates. The solution is not to correct for the offset, but instead to use
//! UTC methods when rendering UI.

/* ======================
createDateFromStringValues()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha: Off by 1 (day).
//
// When you create a new date using an ISO string, JavaScript assumes that this value is UTC time.
//
//   const date = new Date('1978-05-09') // Same as using "1978-05-09T00:00:00Z"
//   => Mon May 08 1978 18:00:00 GMT-0600 (Mountain Daylight Time)
//
//
// Here's another example that uses the current date:
//
//   const date1 = new Date();             // Mon Jun 05 2023 09:14:00 GMT-0600 (Mountain Daylight Time) {}
//   const date2 = new Date('2023-06-05'); // Sun Jun 04 2023 18:00:00 GMT-0600 (Mountain Daylight Time) {}
//
//
// Both dates have the offset relative to UTC, but the one CREATED with an ISO seems like
// it's created as a UTC date, then compounded by being offset by UTC.
//
// Instead, ALWAYS create dates using this format: new Date(year,month,day)
//
//   const date = new Date(1978, 4, 9);
//
// The thing to remember here is that the month value is 0 indexed.
// One way to ensure this is to have a helper function:
//
///////////////////////////////////////////////////////////////////////////

export const createDateFromStringValues = (
  year: string,
  month: string,
  day: string,
  hours = '0', // type string is trivially inferred.
  minutes = '0',
  seconds = '0'
) => {
  // return early if one or more arguments is invalid.
  if (typeof year !== 'string' || year.trim() === '' || isNaN(parseInt(year))) {
    return
  }

  if (
    typeof month !== 'string' ||
    month.trim() === '' ||
    isNaN(parseInt(month))
  ) {
    return
  }

  if (typeof day !== 'string' || day.trim() === '' || isNaN(parseInt(day))) {
    return
  }

  if (
    typeof hours !== 'string' ||
    hours.trim() === '' ||
    isNaN(parseInt(hours))
  ) {
    return
  }

  if (
    typeof minutes !== 'string' ||
    minutes.trim() === '' ||
    isNaN(parseInt(minutes))
  ) {
    return
  }

  if (
    typeof seconds !== 'string' ||
    seconds.trim() === '' ||
    isNaN(parseInt(seconds))
  ) {
    return
  }

  const y = parseInt(year)
  const m = parseInt(month) - 1
  const d = parseInt(day)

  // By default, WE are setting the hours to 0, which is what it would do anyways.
  // Thus we are NOT setting it to UTC T00:00:00.000Z.
  // Instead the date will maintain a reference to local time (as offset against UTC).
  // This is NOT problematic. Rather it is intended and ideal
  const h = parseInt(hours)
  const min = parseInt(minutes)
  const s = parseInt(seconds)

  const date = new Date(y, m, d, h, min, s)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Example: createDateFromStringValues('1978', '5', '9')
  //
  // console.log('date:', date) // => 1978-05-09T06:00:00.000Z
  // console.log('date.toDateString():', date.toDateString()) // => Tue May 09 1978
  // console.log('date.toLocaleDateString():', date.toLocaleDateString()) // => 5/9/1978
  // console.log('date.toLocaleString():', date.toLocaleString()) // =>  5/9/1978, 12:00:00 AM
  // console.log('date.toTimeString():', date.toTimeString()) // => 00:00:00 GMT-0600 (Mountain Daylight Time)
  // console.log('date.toLocaleTimeString():', date.toLocaleTimeString()) // => 12:00:00 AM
  // console.log('date.getHours():', date.getHours()) // => 0
  //
  ///////////////////////////////////////////////////////////////////////////
  return date
}

/* ======================
   createDateFromISO()
====================== */
// Above the createDateFromStringValues() is useful primarily if
// the data is already parsed into year, month, day strings.
// However, if you're given an ISO, then use this because it
// will parse the ISO for you.

export const createDateFromISO = (value: string) => {
  if (typeof value !== 'string') {
    return
  }

  if (isNaN(Date.parse(value))) {
    return
  }

  // Everything has to be parsed using .split(). You can't use
  // .substring() because year is of variable length, and that
  // means no substring indices are gauranteed.
  const date = value.split('T')[0] || ''
  const year = date.split('-')[0] || ''
  const month = date.split('-')[1] || '01'
  const day = date.split('-')[2] || '01'

  const time = (value.split('T')[1] || '').split('.')[0]
  const hours = time?.split(':')[0] || '00'
  const minutes = time?.split(':')[1] || '00'
  const seconds = time?.split(':')[2] || '00'

  console.log({ date, time })

  // If year is '' it will result in NaN from parseInt(year).
  if (typeof year !== 'string' || year.trim() === '' || isNaN(parseInt(year))) {
    return
  }

  if (
    typeof month !== 'string' ||
    month.trim() === '' ||
    isNaN(parseInt(month))
  ) {
    return
  }

  if (typeof day !== 'string' || day.trim() === '' || isNaN(parseInt(day))) {
    return
  }

  if (
    typeof hours !== 'string' ||
    hours.trim() === '' ||
    isNaN(parseInt(hours))
  ) {
    return
  }

  if (
    typeof minutes !== 'string' ||
    minutes.trim() === '' ||
    isNaN(parseInt(minutes))
  ) {
    return
  }

  if (
    typeof seconds !== 'string' ||
    seconds.trim() === '' ||
    isNaN(parseInt(seconds))
  ) {
    return
  }

  const y = parseInt(year)
  const m = parseInt(month) - 1
  const d = parseInt(day)
  const h = parseInt(hours)
  const min = parseInt(minutes)
  const s = parseInt(seconds)
  const newDate = new Date(y, m, d, h, min, s)
  return newDate
}

/* ======================

====================== */

export const createDateFromISO_2 = (value: string) => {
  if (typeof value !== 'string' || isNaN(Date.parse(value))) {
    return
  }

  const date = new Date(value)
  const timeZoneOffset = new Date().getTimezoneOffset()
  const millisecondsOffset = timeZoneOffset * 60000
  date.setTime(date.getTime() + millisecondsOffset)
  return date
}

/* ======================

====================== */

export const createDateFromISO_3 = (value: string) => {
  if (typeof value !== 'string' || isNaN(Date.parse(value))) {
    return
  }
  const GMT = new Date().toString().split(' ')[5]
  const date = new Date(`${value} ${GMT}`)
  return date
}
