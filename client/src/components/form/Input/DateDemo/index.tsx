// Third-party imports
import { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { TriangleAlert } from 'lucide-react'

import dayjs from 'dayjs' // "dayjs": "^1.11.8",
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// Custom imports
import { sleep } from 'utils'
import { Input } from '../'

dayjs.extend(utc)
dayjs.extend(timezone) // timezone depends on utc.

const schema = z.object({
  ///////////////////////////////////////////////////////////////////////////
  //
  // Below, defaultValues will complain if you set date: ''.
  // To get around this I initially did this:
  //
  //   date: z.union([
  //     z.string().nonempty('Required.'),
  //     z.date({
  //       required_error: 'Required.',
  //       invalid_type_error: "That's not a date."
  //     })
  //   ]),
  //
  // The problem with that approach is that this now makes it okay if the final
  // value is a string, which I don't want! Thus, the best way around this is to
  // simply use typecasting:
  //
  //   date: '' as unknown as Date,
  //
  // Note: Normally, we probably won't be using z.date(). Instead, we'll just use z.string()...
  // Why? Because we're probably going to be sending the value to the server anyways.
  //
  ///////////////////////////////////////////////////////////////////////////
  date: z.date({
    required_error: 'Required.',
    invalid_type_error: 'Required.'
  })
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  date: '' as unknown as Date
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// If we set the date as '1978-05-09 GMT-0600' it will seem to look correct,
// but that's a naive approach. All you would need to do is go one timezone back
// and it would be May 8 again.
// So for dates, it seems you alayws want to render them as UTC
// Or convert to ISO and parse it.
//
// const bday = new Date('1978-05-09'); // Mon May 08 1978 18:00:00 GMT-0600 (Mountain Daylight Time)
// console.log(bday.toISOString().slice(0, 10));
//
// However, things seem to get much more complicaed when it comes to setting a precise time.
// In this case, you probably need to get timezone information from the user.
// This means creating a date with a timezone, then adding the hours.
//
// In this case, you may run into the opposite problem, whereby if you output the date using
// UTC date methods (toUTCString(), toISOString(), etc.) it will seem to look wrong.
// This time it will be ahead by a day.
//
// What does this mean? Essentially, it means that sometimes dates should be rendered with
// UTC methods, and sometimes they shouldn't. If you're only given a 10 character string like
// '1978-05-09' or you're given a full ISO with time info like '1978-05-09T00:00:00.000Z' then
// that's a pretty good indication that you should render it as a UTC date for it to look correct
// to the end user.
//
// However, if you're given a date with precice time information, that's a pretty good indication
// that the time matters and the date should be rendered using non-UTC methods.
//
//////////////////////
//
// The next thing you may be asking yourself is how to create a Date with precise time info.
// One way to do this is by creating a date with the GMT info as demonstrated above, then adding time
//
//   const date = new Date('1978-05-09 GMT-0600')
//   date.setHours(17)
//
// You can also do this:
//
//   const date = new Date('1978-05-09T00:00:00-06:00')
//   date.setHours(17)
//
//
// However, I've also seen people use actual timezones.
//
//   // https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone
//   // If you can limit your usage to modern web browsers, you can now do the following without any special libraries:
//
//   const dateWithTimeZone = (timeZone, year, month, day, hour = 0, minute = 0, second = 0) => {
//     let date = new Date(Date.UTC(year, month, day, hour, minute, second));
//     let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
//     let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
//     let offset = utcDate.getTime() - tzDate.getTime();
//     date.setTime( date.getTime() + offset );
//     return date;
//   }
//
// I modified it to this:
//
// const updateTimezone = (date, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
//   let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
//   let tzDate  = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
//   let offset  = utcDate.getTime() - tzDate.getTime();
//   date.setTime( date.getTime() + offset );
//   return date;
// };
//
// There was some commentary that this might not be a good idea:
//
//   This is a bad idea as the format of toLocaleString is not specified, and the built–in
//   parser is not required to parse it, especially when options have been included. Further,
//   it may produce unreliable results in areas that observe daylight saving where the date and
//   time to be parsed either doesn't exist (going into DST) or exists twice (goint out of DST),
//   where implementations must make a choice as how to resolve those issues.
//
///////////////////////////////////////////////////////////////////////////

// const userTimezone = dayjs.tz.guess(
// const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

// Converting to a timezone
const ISO = '1978-05-09'
///////////////////////////////////////////////////////////////////////////
//
// dayjs will output an object with the following keys:
// '$L', '$d', '$x', '$y', '$M', '$D', '$W', '$H', '$m', '$s', '$ms', '$offset', '$u'
// However, I don't think it's intended that you access them direcly.
//
// Instead, use a getter (e.g., .day(), .hour(), etc.),
// or use a display method like .format(), .toDate(), etc.
//
///////////////////////////////////////////////////////////////////////////

const _d = dayjs(ISO).tz('America/Denver')

///////////////////////////////////////////////////////////////////////////
//
// By default, .format() outputs the current date in ISO8601, without fraction seconds e.g.
// Note also that it bakes the offset into the end of the time statement, rather than
// modifying the original T00:00:00 directly. This is interesting in that if you were
// going to build your own timezone select from scratch it means that the values
// of the select would only need to be '-06:00', '-07:00', etc. Then you can simply
// manipulate the ISO as needed:
//
// // List of time zones:
// // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
// // https://www.iana.org/time-zones
// const getOffsetFromTimeZone = (timeZone) => {
//   // The problem with using getTimezoneOffset() is that it's always relative
//   // to the local time, not the specifice timezone. Thus instead,
//   // we can calculate it manually
//   const utcDate             = new Date(new Date().toLocaleString('en-US', { timeZone: "UTC" }));
//   const tzDate              = new Date(new Date().toLocaleString('en-US', { timeZone: timeZone }));
//   const offsetMilliseconds  = utcDate.getTime() - tzDate.getTime();
//   const offsetMinutes       = offsetMilliseconds / 60000
//   const operator            = offsetMinutes >= 0 ? '-' : '+'
//   const offsetHours         = offsetMinutes / 60
//   const absoluteOffsetHours = Math.abs(offsetHours);
//   const prependZero         = absoluteOffsetHours < 10
//   const offset              = `${operator}${prependZero ? '0' : ''}${(absoluteOffsetHours)}:00`
//   return offset
// }
//
//
// // This returns a new Date object, modified with the new time zone.
// const createDateWithOffset = (date, offset) => {
//   const ISO             = date.toISOString().slice(0, 19); // ISO with no milliseconds
//   const ISO_with_offset = `${ISO}${offset}`
//   const updated_date    = new Date(ISO_with_offset);
//   return updated_date;
// }
//
// let date1       = new Date('2023-06-06');
// const timeZone1 = 'America/Denver' // "-06:00"
// const offset1   = getOffsetFromTimeZone(timeZone1);
// date1            = createDateWithOffset(date1, offset1);
// console.log({ date1, offset1 });
//
// let date2        = new Date('2023-06-06');
// const timeZone2  = 'Africa/Algiers'  // "+01:00"
// const offset2    = getOffsetFromTimeZone(timeZone2);
// date2             = createDateWithOffset(date2, offset2);
// console.log({ date2, offset2 })
//
// That said, the calculation for getting the offset, may not be correct
// when it comes to daylight savings time...
//
//   https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone
//   ...It may produce unreliable results in areas that observe daylight saving where the date and
//   time to be parsed either doesn't exist (going into DST) or exists twice (going out of DST),
//   where implementations must make a choice as how to resolve those issues.
//
// This is why I feel more comfortable using dayjs.
//
///////////////////////////////////////////////////////////////////////////

// const dayjs_ISO = d.format() // "1978-05-09T00:00:00-06:00"
// const dayjs_US_format = d.format('MM-DD-YYYY') // "1978-05-09T00:00:00-06:00"
// const dayjs_Date = d.toDate() // Tue May 09 1978 00:00:00 GMT-0600 (Mountain Daylight Time) {}
// const dayjs_string = d.toString() // "Tue, 09 May 1978 06:00:00 GMT"
// console.log({ dayjs_ISO, dayjs_US_format, dayjs_Date, dayjs_string })

export const DateDemo = () => {
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    watch,
    formState: {
      errors,
      isValid,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
    }
  } = useForm<FormValues>({
    defaultValues: defaultValues,

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
      Date Form Text
  ====================== */
  // This is just a function that is output in the date's formText prop.
  // It's meant for demo purposes only.

  const date = watch('date')

  const getDateFormText = (date: any) => {
    if (!(date instanceof Date)) {
      return ''
    }

    const year = date.getUTCFullYear()
    // const month = date.getUTCMonth() + 1 // Return Value is 0 indexed

    const monthName = (() => {
      switch (date.getUTCMonth()) {
        case 0:
          return 'January'
        case 1:
          return 'February'
        case 2:
          return 'March'
        case 3:
          return 'April'
        case 4:
          return 'May'
        case 5:
          return 'June'
        case 7:
          return 'July'
        case 8:
          return 'August'
        case 9:
          return 'September'
        case 10:
          return 'October'
        case 11:
          return 'November'
        default:
          return 'December'
      }
    })()

    const day = date.getUTCDate()

    const dayName = (() => {
      switch (date.getUTCDay()) {
        case 0:
          return 'Sunday'
        case 1:
          return 'Monday'
        case 2:
          return 'Tuesday'
        case 3:
          return 'Wednesday'
        case 4:
          return 'Thursday'
        case 5:
          return 'Friday'
        case 6:
          return 'Saturday'
        default:
          return 'Sunday'
      }
    })()

    return `You selected ${dayName}, ${monthName} ${day}, ${year}. 
    The actual date looks like it's off by 1. ${date.toString()}. 
    That is how it's supposed to be (i.e., nothing wrong). 
    Make sure to use UTC date methods when rendering in UI.`
  }

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    console.log('onSubmit called.', data)
    await sleep(1000) // await API call
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, _e) => {
    const values = getValues()
    console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
      toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          {/* <Input type='date' /> works perfectly! There's really no need to have a
          react-datepicker, unless you just want it for convenience, or you also want
          the time specification to be baked into the date. */}

          <Input
            className=''
            error={errors?.date?.message}
            formGroupClassName='mb-4'
            formText={getDateFormText(date)}
            id='date'
            label='Date'
            labelRequired
            size='sm'
            type='date'
            touched={touchedFields?.date}
            {...register('date', {
              ///////////////////////////////////////////////////////////////////////////
              //
              // Note that react-hook-form will take the ISO
              // and use it to create a new Date. '2023-06-05' is
              // actually short for "2023-06-05T00:00:00.000Z". When you see
              // the date object, it will read:
              //
              //   Sun Jun 04 2023 18:00:00 GMT-0600 (Mountain Daylight Time) {}
              //
              // In other words, you're creating a UTC date of June 5, 2023 at 12 AM.
              // Is this problematic? For the longest time, I thought it WAS a problem, and I
              // created a bunch of utility functions that would correct for this.
              //
              // However, the 'off by 1' (day) issue is not a problem with the date
              // construction, but with how you choose to output it. Storing all dates
              // as UTC is the CORRECT THING TO DO!. Your company SHOULD have a convention
              // of treating all dates coming/going from the server as UTC. Thus, it's important
              // when rendering the date to use UTC methods. Alternatively, you can convert it
              // to an ISO string and then parse it.
              //
              // Admittedly, looking at a date that SEEMS off by 1 is very confusing, but just know that
              // it's not REALLY off by one, but also YOU MUST REMEMBER to access it using
              // UTC methods or by parsing the ISO string.
              //
              // const date  = new Date('1978-05-09T00:05:15');
              // const year  = date.getUTCFullYear();
              // const month = date.getUTCMonth() + 1; // Return Value is 0 indexed
              //
              // const monthName = (() => {
              //   switch(date.getUTCMonth()) {
              //     case 0: return 'January';
              //     case 1: return 'February';
              //     case 2: return 'March';
              //     case 3: return 'April';
              //     case 4: return 'May';
              //     case 5: return 'June';
              //     case 7: return 'July';
              //     case 8: return 'August';
              //     case 9: return 'September';
              //     case 10: return 'October';
              //     case 11: return 'November';
              //     default: return 'December'
              //   }
              // })();
              //
              // const day = date.getUTCDate();
              //
              // const dayName = (() => {
              //   switch(date.getUTCDay()) {
              //     case 0: return 'Sunday';
              //     case 1: return 'Monday';
              //     case 2: return 'Tuesday';
              //     case 3: return 'Wednesday';
              //     case 4: return 'Thursday';
              //     case 5: return 'Friday';
              //     case 6: return 'Saturday';
              //     default: return 'Sunday'
              //   }
              // })();
              //
              // const militaryHours = date.getUTCHours();
              // const hours         = militaryHours > 12 ? militaryHours - 12 : militaryHours
              // const minutes       = date.getUTCMinutes();
              // const seconds       = date.getUTCSeconds();
              // const AMPM          = hours < 12 ? 'AM' : 'PM'
              //
              // const message = `Your appointement is scheduled on ${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes < 10 ? `0${minutes}`  : minutes } ${AMPM}.`
              // console.log(message);
              //
              // See here for more info: https://dev.to/zachgoll/a-complete-guide-to-javascript-dates-and-why-your-date-is-off-by-1-day-fi1
              //
              // Another great approach would be to use a library like dayjs:
              //
              //   import dayjs from 'dayjs'
              //   import utc from 'dayjs/plugin/utc'
              //
              //   dayjs.extend(utc)
              //   const bday = new Date('1978-05-09')
              //   console.log(dayjs.utc(bday).format('MM-DD-YYYY'))   // => 05-09-1978
              //   console.log(dayjs.utc(bday).format('MMMM D, YYYY')) // => May 9, 1978
              //
              //
              // For very basic use cases you could also do:
              //
              //   const d = new Date('1978-05-09');
              //   const simpleFormat = d.toUTCString().substring(0, 16);
              //   console.log(simpleFormat); // => Tue, 09 May 1978
              //
              // By far the easiest approach I've found is to do this:
              //
              // const formatDate = (
              //   date: Date,
              //   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
              //   options: Intl.DateTimeFormatOptions = {
              //     year: 'numeric', // "numeric" | "2-digit" | undefined
              //     month: 'long', //  "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined'
              //     day: 'numeric', // 'numeric' | '2-digit' | undeined
              //     weekday: 'long', // "long" | "short" | "narrow" | undefined'
              //     hour: 'numeric', // "numeric" | "2-digit" | undefined
              //     minute: '2-digit', // '"numeric" | "2-digit" | undefined
              //     // second: '2-digit', // '"numeric" | "2-digit" | undefined
              //     // dayPeriod: 'long' // "long" | "short" | "narrow" | undefined
              //     timeZone: 'UTC'
              //     // Using timeZoneName makes it more confusing.
              //     // timeZoneName: 'short' // "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined
              //   }
              // ) => {
              //   if (!(date instanceof Date) || isNaN(Date.parse(date.toISOString()))) {
              //     return
              //   }
              //   return date.toLocaleDateString('en-US', options)
              // }
              // See utils/index.ts
              //
              ///////////////////////////////////////////////////////////////////////////

              // The docs say that valueAsDate: true  won't tranform the defaultValue, but it does.
              // A similar issue is raised here: https://github.com/react-hook-form/react-hook-form/issues/6287
              // Instead we can use setValueAs. Normally, we probably won't even be using this because we'll
              // be sending the date to the server as an ISO string.
              setValueAs: (value) => {
                if (typeof value !== 'string' || isNaN(Date.parse(value))) {
                  return value
                }
                return new Date(value)
              }
            })}
          />

          {/* =====================
                Submit Button
          ===================== */}

          {isSubmitting ? (
            <button
              className='btn-green btn-sm block w-full'
              disabled
              type='button'
            >
              <span
                aria-hidden='true'
                className='spinner-border spinner-border-sm mr-2'
                role='status'
              ></span>
              Submitting...
            </button>
          ) : (
            <button
              className='btn-green btn-sm flex w-full'
              // You could also add || !isDirty. In the case of an update form,
              // it still makes sense because there's no need to send an update if
              // nothing's actually been updated.
              disabled={isSubmitted && !isValid ? true : false}
              onClick={handleSubmit(onSubmit, onError)}
              type='button'
            >
              {isSubmitted && !isValid ? (
                <Fragment>
                  <TriangleAlert className='pointer-events-none size-[1.25em]' />{' '}
                  Please Fix Errors...
                </Fragment>
              ) : (
                'Submit'
              )}
            </button>
          )}
        </form>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return (
    <Fragment>
      {renderForm()}

      <article
        className='mx-auto mb-6 rounded-lg border border-gray-500 bg-white p-4'
        style={{ maxWidth: 800 }}
      >
        <h3 className='font-bold text-blue-500'>About Dates:</h3>

        <p>
          If a date or (ISO date string) comes from the server, and doesn't have
          any specific time information (e.g., <code>'1978-05-09'</code>
          ), then we should probably render it using some kind of UTC date
          method. Why? Because if you use non-UTC methods, you'll likely run
          into an 'off by one' (day) problem.
        </p>

        <p>
          If a date (i.e., ISO string) comes from the server and has full date
          and time info (e.g., <code>'2023-06-15T12:15:00.000Z</code>) then
          that's a possible situation where we <em>might</em> want to render it
          using a 'local' approach. When specific time information is provided
          it generally implies that we're pointing at a precise time. In this
          case, using a 'local' approach to rendering the date is important.
          Why? Because the date is meant to be presented to the user{' '}
          <strong>
            <em>relative to their local time</em>
          </strong>
          . Thus if they were in the Pacific time zone the rendered value would
          look different than if they were in the Central time zone.
        </p>

        <p className='mb-4'>
          The <strong>gotcha</strong> is that it's also possible that the date
          was created with time information, but that the time information
          doesn't actually matter. For example, a normal{' '}
          <code>&#60;input type='date'/&#62;</code> outputs a{' '}
          <code>YYYY-MM-DD</code> string, but if the date was created using{' '}
          <code>new Date(n, n, n, ...)</code> it would outputs an actual{' '}
          <code>Date</code> object based on the user's <strong>local</strong>{' '}
          timezone! To make matters worse, if you then take that{' '}
          <code>Date</code> and convert it to an ISO string, it could very
          likely be{' '}
          <strong>
            <em>off by one day</em>
          </strong>
          .
        </p>

        <h6 className='font-bold text-blue-500'>React DatePicker:</h6>

        <p>
          The <code>react-datepicker</code> component is a good example of the
          above issue. This is a <strong>known issue</strong> with React
          DatePicker as discussed{' '}
          <a
            className='text-blue-500 underline'
            href='https://stackoverflow.com/questions/71646357/force-react-datepicker-to-use-utc'
            target='_blank'
            rel='noreferrer'
          >
            here
          </a>
          . The{' '}
          <a
            className='text-blue-500 underline'
            href='https://github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md'
            target='_blank'
            rel='noreferrer'
          >
            React Date Picker Props
          </a>{' '}
          supposedly has a <code>utcOffset</code> prop, but actually it seems to
          no longer be included in the Typescript typings (See{' '}
          <a
            className='text-blue-500 underline'
            href='https://github.com/Hacker0x01/react-datepicker/issues/1647'
            target='_blank'
            rel='noreferrer'
          >
            here
          </a>
          ). The only thing you can do about it is convert the data prior to
          sending it to the server:
        </p>

        <pre
          className='mx-auto mb-4 w-11/12 rounded-lg border border-black'
          style={{ backgroundColor: 'rgb(245, 245, 245)' }}
        >
          <code>{`
  // This function takes a Date object (like the one generated from React DatePicker)
  // and convertes it to a short UTC ISO (i.e., YYYY-MM-DD), like the kind output
  // by <input type='date' />


  const dateToUTCShortISO = (date: Date) => {
    // Even if the date is an instance of Date, it might still be an 'Invalid Date'
    if (!(date instanceof Date) || isNaN(Date.parse(date.toISOString()))) { return }
  
    const year          = date.getFullYear()
    const month         = date.getMonth()
    const day           = date.getDate()
    const UTC_Date      = new Date(Date.UTC(year, month, day))
    const UTC_ISO       = UTC_Date.toISOString()
    const UTC_SHORT_ISO = UTC_ISO.substring(0, 10)

    return UTC_SHORT_ISO
  }
          `}</code>
        </pre>

        <p>
          In any case, it's{' '}
          <strong>
            <em>super important</em>
          </strong>{' '}
          that your dev team establish conventions for handling these type of
          situations. Otherwise, you'll almost definitely run into issues.
        </p>

        <h6 className='font-bold text-blue-500'>But is it an issue?</h6>

        <p>
          Suppose we had a <code>react-datepicker</code> that also had the time
          part implemented. In other words, we're prompting the user to pick a
          specific date{' '}
          <strong>
            <em>and time</em>
          </strong>
          . In this case, the behavior of outputting a <code>Date</code> object
          against the user's local timezone is actually the correct behavior.
          Why? Because that gives a us a precise <code>Date</code> that is
          always relative to UTC, but renders locally in the correct manner no
          matter where in the world the user is.
        </p>

        <p>
          Thus <code>react-datepicker</code> does not really have an{' '}
          <em>issue</em> per se. The issue is that as the developer, we have to
          think very carefully about what our intention is, and then build out
          the logic accordingly. When it comes to dates,{' '}
          <strong>
            <em>
              {' '}
              there's just not one solution that will work all of the time
            </em>
          </strong>
          .
        </p>
      </article>
    </Fragment>
  )
}
