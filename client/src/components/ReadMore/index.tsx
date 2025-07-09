import { ComponentProps, useState, useEffect, useRef, useCallback } from 'react'
import { debounce } from './debounce'

interface IReadMore
  extends Omit<
    ComponentProps<'div'>,
    'onChange' | 'defaultValue' | 'onResize'
  > {
  /** The number of lines to show when the component is in the !open (i.e., clamped) state. */
  maxLines?: number
  /** A defaultValue for the initial value of ReadMore's internal open state. This
   * is only for uncontrolled implementations and defers to the value prop when
   * it is a boolean.
   */
  defaultValue?: boolean
  moreText?: string
  lessText?: string
  buttonInline?: boolean
  /** Permanently hides the read more/less button. This
   * could be useful in case where you want it to be purely
   * controlled through some external, programmatic function.
   */
  noButton?: boolean
  /** A standard value prop used for controlled implementations. */
  value?: boolean
  /** An optional callback that passes back the current value of ReadMore's internal open state.
   * This can be useful for keeping an external controlled implementation in sync with ReadMores'
   * internal open state.
   */
  onChange?: (newValue: boolean) => void
  /** An optional callback that passes back the current value of ReadMore's internal buttonNeeded state. */
  onResize?: (buttonNeeded: boolean) => void
}

/* ========================================================================
                                ReadMore
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// The nice thing about this implementation is that we can pass in a string
// or a series of paragraphs. Ultimately, I think this is a way better
// approach than any of the Javascript solutions which can ONLY work with strings.
//
// That said, there is another way of doing it that would entail doing something
// like truncateByMaxChars. In this case, we would look at children to see if
// it's a string, if it is then we simply cut the length. Otherwise if it's not
// a string, then we would assume that it's an element and get it's inner text.
//
// Yet another approach would be to have a prop called snippet/teaser/preview that
// allowed us to pass in some initial text. Thus, if the content was database-driven,
// we would receive the full content, but also a snippet/teaser/preview that we could
// show. Ultimately, this seems like the best approach. And if that were the case,
// there would obviously be no need for WebkitLineClamp.
//# To this end, it would be good to create a Preview component that either shows the
//# preview content or the children content based on the value of open.
//
///////////////////////////////////////////////////////////////////////////

export const ReadMore = ({
  children,
  maxLines = 3,
  defaultValue = false,
  moreText = 'Read More',
  lessText = 'Read Less',
  buttonInline = false,
  noButton = false,
  value,
  onChange,
  onResize,
  ...otherProps
}: IReadMore) => {
  /* ======================
        state & refs
  ====================== */

  const onChangeRef = useRef(onChange)
  const onResizeRef = useRef(onResize)

  const contentRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(() => {
    if (typeof value === 'boolean') {
      return value
    }
    return defaultValue
  })
  const [buttonNeeded, setButtonNeeded] = useState(true)

  /* ======================
  decideIfButtonIsNeeded()
  ====================== */

  const decideIfButtonIsNeeded = useCallback(() => {
    if (!contentRef.current || noButton || open) {
      return
    }

    const contentScrollHeight = contentRef.current.scrollHeight
    const contentOffsetHeight = contentRef.current.offsetHeight
    const isButtonNeeded = contentScrollHeight > contentOffsetHeight
    // console.log(`Calling setButtonNeeded(${isButtonNeeded})`)

    onResizeRef.current?.(isButtonNeeded)
    setButtonNeeded(isButtonNeeded)
  }, [noButton, open])

  /* ======================
        useEffect()
  ====================== */
  // Call decideIfButtonIsNeeded() on mount, resize and when open changes.

  useEffect(() => {
    decideIfButtonIsNeeded()
    const debouncedListener = debounce(decideIfButtonIsNeeded, 250)
    window.addEventListener('resize', debouncedListener)
    return () => window.removeEventListener('resize', debouncedListener)
  }, [decideIfButtonIsNeeded])

  /* ======================
        useEffect() 
  ====================== */
  // Two-way binding part 1:
  // When controlled value state changes in the consuming code,
  // update setOpen with value.

  useEffect(() => {
    if (typeof value !== 'boolean') {
      return
    }
    setOpen(value)
  }, [value])

  /* ======================
        useEffect() 
  ====================== */
  // Two-way binding part 2:
  // Pass back the value of open to consuming code, so it can update controlled state setter.
  // Arguably, this could also be done in both of the click handlers at the same time that
  // setOpen() is called, but this works nicely as the single place where onChange() is called.

  useEffect(() => {
    onChangeRef.current?.(open)
  }, [open])

  /* ======================
        renderButton()
  ====================== */

  const renderButton = () => {
    if (!buttonNeeded || noButton || (buttonInline && !open)) {
      return null
    }

    return (
      <button
        className='read-more-button'
        onClick={() => {
          setOpen((v) => {
            return !v
          })
        }}
      >
        {!open ? moreText : lessText}
      </button>
    )
  }

  /* ======================
    renderInlineButton()
  ====================== */

  const renderInlineButton = () => {
    if (!buttonNeeded || noButton || !buttonInline || (buttonInline && open)) {
      return null
    }

    return (
      <button
        className='read-more-inline-button'
        onClick={() => {
          setOpen((v) => {
            return !v
          })
        }}
      >
        {!open ? moreText : lessText}
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div {...otherProps}>
      <div
        // This makes more sense to be left as inline styles,
        // rather than adding to readMorePlugin.ts
        style={{
          display: !open ? '-webkit-box' : '',
          WebkitBoxOrient: 'vertical',
          // Dynamically changing lines did not actually work.
          WebkitLineClamp: maxLines, // WebkitLineClamp is designed to work in conjunction with '-webkit-box'
          overflow: !open ? 'hidden' : '',
          textOverflow: 'ellipsis', // This may be redundant, but doesn't hurt.
          position: 'relative'
        }}
      >
        <div ref={contentRef}>{children}</div>

        {renderInlineButton()}
      </div>

      {renderButton()}
    </div>
  )
}

///////////////////////////////////////////////////////////////////////////
//
// Note: I tried display: 'flex', flexDirection: 'column', and lineClamp: maxLines,
// but that didn't work. As noted here: https://css-tricks.com/almanac/properties/l/line-clamp/
// It actually works across all major browsers. See also:
//
//   https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp#browser_compatibility
//
// Chris Coyier has another article on the topic:
//
//  https://css-tricks.com/line-clampin/
//
// There he notes that:
//
//   "It’s extremely fragile. Let’s say you want the module (or the paragraph) to have some padding.
//   You can’t because the padding will expose extra lines. That’s what we get with sorta half-baked
//   originally-non-standardized properties."
//
/////////////////////////
//
// Another approach is to use Clamp.js (last publish over 8 years ago):
//
//   https://github.com/josephschmitt/Clamp.js
//   https://github.com/meandmax/clamp.js/blob/master/lib/index.js
//
// That said, I think these packagse looks promising:
//
//   https://www.npmjs.com/package/react-lines-ellipsis (103,294 weekly downloads)
//   Despite it's high weekly downloads, I wasn't super impressed with this package.
//   Mainly, it's lack of a 'read more' feature was kind of annoying. The other problem
//   as with many of these packages is that the text prop only accepts a string.
//
//   https://www.npmjs.com/package/react-read-more-read-less
//   read-more-read-less is interesting because it doesn't
//   actually clamp the lines. Instead, it allows you to
//   set a static character limit.
//
//   https://www.npmjs.com/package/react-text-truncate  (70,496 weekly downloads)
//   This one actually clamps the text to a specified number of lines AND
//   has a 'read more' feature. That said, it doesn't always get the line clamping
//   correct if/when the text size changes responsively.
//
//   https://www.npmjs.com/package/react-show-more-text (25,406 weekly downloads)
//   Resizing can be janky because of the 'Show More' element.
//
//   https://www.npmjs.com/package/react-clamp-lines    (16,844 weekly downloads) - responsive ???
//   This one puts the read more/less button on a separate line, which
//   completely bypasses the jankiness on resize. The downside here is that
//   you're limited to a single paragraph of text. What if we want the read
//   multiple paragraphs? Also, it doesn't expose any kind of callback for
//   when it's open or closed.
//
// This article of doing it with Tailwind also looks good:
//
//  https://notes.alexkehayias.csom/line-clamp-with-react-and-tailwindcss/
//
// Finally, Mafia Codes has a tutorial that was useful. Here is where I
// got the idea to add the decideIfButtonIsNeeded() function and resize handler.
//
//   https://www.youtube.com/watch?v=A65BUxIu-ZQ
//
///////////////////////////////////////////////////////////////////////////
