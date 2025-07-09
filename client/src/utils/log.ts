/* ======================
          log()
====================== */
type LogOptions = {
  background?: string
  border?: string
  borderRadius?: string
  color?: string
  fontSize?: string
  fontStyle?: string
  fontWeight?: string
  lineHeight?: string | number
}

// A Better version of this would simply take in React.CSSProperties,
// then parse it into a usable style attribute. That said, this works for now.
export const log = (message: string, options: LogOptions = {}) => {
  options.background = options.background || '#15c213' // Jest green.
  options.border = options.border || '1px solid rgba(0,0,0,0.25)'
  options.borderRadius = options.borderRadius || '5px'
  options.color = options.color || '#fff'
  options.fontSize = options.fontSize || '12px'
  options.fontStyle = options.fontStyle || 'normal'
  options.fontWeight = options.fontWeight || 'bold'
  options.lineHeight = options.lineHeight || '1.5'

  const {
    background,
    border,
    borderRadius,
    color,
    fontSize,
    fontStyle,
    fontWeight,
    lineHeight
  } = options

  console.log(
    `%c${message}`,
    `
     border:${border};
     border-radius:${borderRadius};
     color:${color}; 
     background: ${background}; 
     font-size:${fontSize}; 
     font-style:${fontStyle};
     font-weight:${fontWeight};
     line-height:${lineHeight};
    `
  )
}
