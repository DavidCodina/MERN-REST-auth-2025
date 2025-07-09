import plugin from 'tailwindcss/plugin'

/* ========================================================================
                                    basePlugin
======================================================================== */
// Base styles can be changed through the plugin: https://tailwindcss.com/docs/plugins#adding-base-styles
// However, you can also extend preflight: https://tailwindcss.com/docs/preflight#extending-preflight

export const basePlugin = plugin(function (pluginApi) {
  const { addBase /*, theme */, config } = pluginApi

  addBase({
    ///////////////////////////////////////////////////////////////////////////
    //
    // The basic setup for font sizes is to set the root html
    // element to 16px. Then set body to 0.75rem (12px). Then
    // Add a couple of media queries on body that successively
    // increase fontSize. In this way, we have a general style
    // for responsive text. However, neither html, body, or the
    // associated media queries are strong enough in specificity
    // to block other rules like 'text-sm', 'text-lig', etc.
    // This is the way.
    //
    // Update: Rather, than doing this:
    //
    //   body: { fontSize: '0.75rem' },
    //   '@media screen and (min-width: 576px)': {
    //     body: { fontSize: '0.875rem' }
    //   },
    //   '@media screen and (min-width: 768px)': {
    //     body: { fontSize: '1rem' }
    //   },
    //
    // It's easier to just do this
    //
    //   body: { fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }
    //
    // The other benefit here, is that the body's fontSize and the h6 fontSize
    // will now always be in sync.
    //
    ///////////////////////////////////////////////////////////////////////////
    html: {
      fontSize: '16px'
    },

    body: {
      // This works as a default. However,
      // MainLayout overrides it based on light/dark theme.
      backgroundColor: 'var(--body-color)',
      color: '#212529', // ???
      fontSize: '1rem', // fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
      fontWeight: '400',
      lineHeight: '1.5', // Preflight will already do this on html element, then body inherits it.
      margin: '0px', // Preflight already does this.
      textAlign: 'left'
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // By default, Tailwind Preflight does this:
    // h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
    //
    // For each of the heading classes, the max has been set to the
    // Bootstrap v4 size. The min 0.75 of max. Thus h6 is 'clamp(0.75rem, 1vw, 1rem).
    // This means that h6 will never go below 12px (assuming a root font size of 16px).
    // After playing around with this a bit further, I decided to make h1 .7 of max.
    // This gives it a little bit more fluidity, which is useful for page headings, etc.
    // You probably don't want to dip down below .7. Otherwise, the spread starts becoming
    // negligible at mobile sizes. For specific cases where you need the headings to be
    // a different size, use case-specific styles.
    //
    // For each clamp() font size, the ideal value is a rough estimate, but
    // is somewhat less important than the lower and upper bounds.
    //
    // https://web.dev/min-max-clamp/
    //
    // Note that using vw with clamp() also helps mitigate the issues related to
    // zooming. With pure vw units, adjusting the zoom doesn't change the text size,
    // which can be super annoying to end users who are intentionally trying to make
    // that text smaller or larger.
    //
    ///////////////////////////////////////////////////////////////////////////
    h1: {
      // Change occurs between roughly 680 and 1000px.
      // max 2.5rem : never go above 40px.
      // min 1.75rem : never go below 28px. (2.5rem .70)
      // fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },

    h2: {
      // Change occurs between 680 and 910px.
      // max 2 rem : never go above 32px.
      // min 1.5rem : never go below 24px.
      // fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
      fontSize: '2rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },
    h3: {
      // Change occurs between roughly 695 and 940px.
      // max 1.75rem : never to above 28px.
      // min 1.3125rem : never go below 21px.
      // fontSize: 'clamp(1.3125rem, 3vw, 1.75rem)',
      fontSize: '1.75rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },
    h4: {
      // Change occurs between roughly 715 and 960px.
      // max 1.5rem : never go above 24px
      // min 1.125rem : never go below 18px.
      // fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },
    h5: {
      // Change occurs between roughly 750 and 1000px
      // max 1.25rem : never go above 20px.
      // min 0.9375rem : never go below 15px.
      // fontSize: 'clamp(0.9375rem, 2vw, 1.25rem)',
      fontSize: '1.25rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },
    h6: {
      // Change occurs between 795 roughly and 1070px
      // max 1rem : never go above 16px.
      // min 0.75rem : never go below 12px.
      // fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
      fontSize: '1rem',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '0.5rem',
      marginTop: '0px'
    },
    p: {
      marginTop: '0px',
      marginBottom: '1rem'
    },
    'p:last-child': {
      marginBottom: '0px'
    },
    hr: {
      margin: '1rem 0',
      color: 'inherit',
      backgroundColor: 'currentColor',
      border: '0px',
      opacity: '0.25'
    },

    a: {
      color: config('theme.colors.blue.500')
      // Don't set underline. It will conflict with <Anchor />.
      // Actually, it won't since for underline="hover" we use
      // '!no-underline hover:!underline'. Still, I prefer not
      // to do this here.
      // textDecoration: 'underline'
    },

    //^ Changed my mind on this. It's too intrusive in many cases.
    // 'a:hover': {
    //   color: config('theme.colors.blue.600')
    //   // This would also conflict with <Anchor /> except when
    //   // underline="never" the !no-underline class is used.
    //   // textDecoration: 'underline'
    // },
    'a:not([href]):not([class])': {
      color: 'inherit',
      textDecoration: 'none'
    },
    'a:not([href]):not([class]):hover': {
      color: 'inherit',
      textDecoration: 'none'
    },

    ///////////////////////////////////////////////////////////////////////////
    pre: {
      display: 'block',
      marginTop: '0px',
      marginBottom: '1rem',
      overflow: 'auto',
      fontSize: '0.875em'
    },
    'pre code': {
      fontSize: 'inherit',
      color: 'inherit',
      wordBreak: 'normal'
    },
    code: {
      color: config('theme.colors.pink.500'),
      wordWrap: 'break-word'
    },
    'a > code': {
      color: 'inherit'
    },
    button: {
      borderRadius: '0px',
      lineHeight: 'inherit',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: '0px',
      textTransform: 'none'
    },
    'button:focus:not(:focus-visible)': {
      outline: '0px'
    },
    'button:not(:disabled)': {
      cursor: 'pointer'
    },
    "[role='button']": {
      cursor: 'pointer'
    },
    "[type='button']:not(:disabled)": {
      cursor: 'pointer'
    },
    "[type='reset']:not(:disabled)": {
      cursor: 'pointer'
    },
    "[type='submit']:not(:disabled)": {
      cursor: 'pointer'
    },
    table: {
      captionSide: 'bottom'
    },
    th: {
      textAlign: 'inherit',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    td: {
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    tr: {
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    thead: {
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    tbody: {
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    tfoot: {
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px'
    },
    label: {
      display: 'inline-block'
    },
    input: {
      margin: '0px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit'
    },
    textarea: {
      margin: '0px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      resize: 'vertical'
    },
    optgroup: {
      margin: '0px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit'
    },
    select: {
      margin: '0px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      wordWrap: 'normal',
      textTransform: 'none'
    },
    'select:disabled': {
      opacity: '1'
    },
    fieldset: {
      border: '0px',
      margin: '0px',
      minWidth: '0px',
      padding: '0px'
    },
    iframe: {
      border: '0px'
    },
    summary: {
      display: 'list-item',
      cursor: 'pointer'
    },
    output: {
      display: 'inline-block'
    }
  })
})

export default basePlugin
