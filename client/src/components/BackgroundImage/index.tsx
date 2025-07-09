import { ComponentProps, CSSProperties } from 'react'

type XPosition = `left` | 'center' | 'right'
type YPosition = 'top' | 'center' | 'bottom'

interface IBackgroundImage extends ComponentProps<'div'> {
  /** src will be interpolated into `url(${src})`. If you need to do something more complex
   * Then add the backgroundImage through the style prop. For example,
   * ```
   *   style={{
   *     backgroundImage: `linear-gradient(to right, rgb(109, 40, 217), rgb(56, 189, 248)), url(${teaTime})`,
   *     backgroundBlendMode: 'color'
   *   }}
   * ```
   */
  src?: string

  size?: 'cover' | 'contain' | 'auto'
  /** If you only specify one keyword, the other value will be "center".
   * For more fine-grained positional control with percents or pixels,
   * use the style tag instead: `{ backgroundPosition: ... }`
   */
  position?:
    | 'left'
    | 'center'
    | 'right'
    | 'top'
    | 'bottom'
    | `${XPosition} ${YPosition}`

  repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  attachment?: 'scroll' | 'fixed' | 'local'

  useContainer?: boolean
  containerStyle?: Omit<
    CSSProperties,
    'padding' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft'
  >
  containerClassName?: string
}

/* ========================================================================
                            BackgroundImage   
======================================================================== */

export const BackgroundImage = ({
  src,
  size = 'cover', // 99% of the time you'll want 'cover'
  position = 'center',
  repeat = 'no-repeat', // 99% of the time you'll want 'no-repeat'

  // 'scroll': The CSS default. The background image will scroll with the page.
  // 'fixed':  Useful when you want the background image to not scroll with the page.
  attachment = 'scroll',
  className,
  style,
  children
}: IBackgroundImage) => {
  return (
    <div
      className={`${className ? ` ${className}` : ''}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: size,
        backgroundPosition: position,
        backgroundRepeat: repeat,
        backgroundAttachment: attachment,
        ...style
      }}
    >
      {children}
    </div>
  )
}
