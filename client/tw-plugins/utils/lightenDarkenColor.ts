///////////////////////////////////////////////////////////////////////////
//
// lightenDarkenColor() was originally taken from:
//
//   https://css-tricks.com/snippets/javascript/lighten-darken-color/
//
// However, as many have pointed out, it had several bugs.
// This version seeks to improve on that original formula...
//
// This function takes in a hex or rgb string and derives the rgb numbers.
// Then it adds amt to each r, g, and b and returns an object with the new { hex, rgb }.
//
// Thus given a color arg of '#15C213', it converts it to r = 21, g = 194 , b = 19.
// If we lighten by 20 we get:  { hex: '#29D627', rgb: 'rgb(41,214,39)' }
// If we darken by -20 we get:  { hex: '#01AE00', rgb: 'rgb(1,174,0)'   }
//
//
// One could also use https://polished.js.org/docs/
// Polished has darken() and lighten() functions.
//
//   https://github.com/styled-components/polished/blob/main/src/color/lighten.js
//   https://github.com/styled-components/polished/blob/main/src/color/darken.js
//
// See also: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
//
///////////////////////////////////////////////////////////////////////////

export const lightenDarkenColor = (color: string, amt: number) => {
  /* ======================
  If string startsWith 'rgb'
  ====================== */

  const isRGB = color.substring(0, 3) === 'rgb'
  let isValidRGB = false
  let rgbObject = { r: 0, g: 0, b: 0 }

  if (isRGB) {
    const arr = color
      .split('(')[1]
      ?.split(')')[0]
      ?.split(',')
      ?.map((value) => {
        return value.trim()
      })

    const R = parseInt(arr?.[0] as string)
    const G = parseInt(arr?.[1] as string)
    const B = parseInt(arr?.[2] as string)

    if (!isNaN(R) && !isNaN(G) && !isNaN(B)) {
      isValidRGB = true
      rgbObject = { r: R, g: G, b: B }
    }
  }

  /* ======================
  If string !startsWith 'rgb'
  ====================== */

  let usePound = false
  if (color[0] === '#') {
    color = color.slice(1)
    usePound = true
  }

  /* ======================
  Define r,g,b and add amt to each.
  ====================== */

  const num = parseInt(color, 16)

  let r = isValidRGB ? rgbObject.r + amt : (num >> 16) + amt
  if (r > 255) {
    r = 255
  } else if (r < 0) {
    r = 0
  }

  let g = isValidRGB ? rgbObject.g + amt : ((num >> 8) & 0x00ff) + amt
  if (g > 255) {
    g = 255
  } else if (g < 0) {
    g = 0
  }

  let b = isValidRGB ? rgbObject.b + amt : (num & 0x0000ff) + amt
  if (b > 255) {
    b = 255
  } else if (b < 0) {
    b = 0
  }

  /* ======================
  return object with { hex, rgb }
  ====================== */

  const rgb = `rgb(${r},${g},${b})`

  // const hex = ((usePound ? '#' : '') + String('000000' + (b | (g << 8) | (r << 16)).toString(16)).slice(-6))
  const hex =
    (usePound ? '#' : '') +
    (r.toString(16).length === 1 ? '0' + r.toString(16) : r.toString(16)) +
    (g.toString(16).length === 1 ? '0' + g.toString(16) : g.toString(16)) +
    (b.toString(16).length === 1 ? '0' + b.toString(16) : b.toString(16))

  return { hex, rgb, rgbObject: { r, g, b } }
}
