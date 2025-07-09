import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'

export interface ThemeContextValue {
  mode: 'light' | 'dark'
  setMode: Dispatch<SetStateAction<'light' | 'dark'>>
  // [key: string]: any
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tailwind             : https://tailwindcss.com/docs/dark-mode
// John Komarnicki      : https://www.youtube.com/watch?v=oMOe_32M6ss
// Tom Is Loading       : https://www.youtube.com/watch?v=vIBKSmWAdIA - A more sophisticated approach.
// See also next-themes : https://github.com/pacocoursey/next-themes
//
/////////////////////////
//
// The Tailwind light/dark theme feature works in conjunction with several other files.
// - tailwind.config.js sets: darkMode: 'selector'. // ❌ not 'class'
// - <ThemeProvider> is consumed in contexts/Providers.tsx
// - <MainLayout/> consumes:  const { mode } = useThemeContext()
// - const { mode, setMode } = useThemeContext() is also consumed in MainLayout/components/Menu.tsx
//
// - useThemeContext() might also be baked into various custom components like
//   Title, HR, Card, Modal, Spinner, Tabs (?), etc. However, I want to move away from doing that
//   because it means they can no longer be part of a separate component library.
//
// Ultimately, Whether a website will need a 'light/dark' feature is something that should
// ideally be determined from the outset. Otherwise, adding it in later is kind of
// a pain because you have to go back and update a bunch of component styles.
//
///////////////////////////////////////////////////////////////////////////

export const ThemeContext = createContext({} as ThemeContextValue)
export const ThemeConsumer = ThemeContext.Consumer

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const firstRenderRef = useRef(true)

  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  // Initially, mode will be set based on the presence of a 'mode' key in localStorage.
  // If no 'mode' key exists, then we check for a system preference.
  // If dark is not set as a system preference, then ultimately we default to light.
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const maybeMode = localStorage.getItem('mode')
    if (maybeMode === 'light' || maybeMode === 'dark') {
      return maybeMode
    }
    return prefersDarkMode ? 'dark' : 'light'
  })

  /* ======================
        useEffect()
  ====================== */
  // On mount, set up an event listener that watches for changes to the user's system preference.

  useEffect(() => {
    const mediaWatcher = window.matchMedia('(prefers-color-scheme: dark)')

    // https://betterprogramming.pub/using-window-matchmedia-in-react-8116eada2588
    // When the user changes changes their system preference for dark mode,
    // then update mode accordingly.
    const handleChange = (e: any) => {
      if (e.currentTarget.matches === true) {
        // console.log('The user now prefers a prefers a dark color scheme.')
        setMode('dark')
      } else {
        // console.log('The user now does NOT prefer a dark color scheme.')
        setMode('light')
      }
    }
    mediaWatcher.addEventListener('change', handleChange)
    return () => {
      mediaWatcher.removeEventListener('change', handleChange)
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // Update the <html> element's classList and localStorage whenenver the value
  // of mode changes. There was a flash that occurs on mount when the theme switches.
  // This is one of those rare cases where useLayoutEffect() is needed.

  useLayoutEffect(() => {
    const html = document.getElementsByTagName('html')?.[0]
    if (firstRenderRef.current === true && html) {
      // .transition-none-all is hardcoded into index.html to prevent
      // the light/dark transition on mount.
      setTimeout(() => {
        html.classList.remove('transition-none-all')
      }, 1000)
    }
    firstRenderRef.current = false

    if (html) {
      if (mode === 'dark') {
        localStorage.setItem('mode', 'dark')
        if (!html.classList.contains('dark')) {
          html.classList.add('dark')
        }
      } else {
        localStorage.setItem('mode', 'light')
        html.classList.remove('dark')
      }
    }
  }, [mode])

  /* ======================
          return
  ====================== */

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const value = useContext(ThemeContext)
  return value
}
