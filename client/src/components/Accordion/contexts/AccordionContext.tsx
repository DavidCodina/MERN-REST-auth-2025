import {
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback
} from 'react'

export interface AccordionContextValue {
  activeItems: string[]
  updateActiveItems: (item: string) => void
  setDefaultValue: (defaultValue: string | string[]) => void

  setType: Dispatch<SetStateAction<'single' | 'multiple'>>
  setCollapsible: Dispatch<SetStateAction<boolean>>

  duration: number
  setDuration: Dispatch<SetStateAction<number>>

  disableTransition: boolean
  setDisableTransition: Dispatch<SetStateAction<boolean>>
  // [key: string]: any
}

/* ========================================================================

======================================================================== */

export const AccordionContext = createContext({} as AccordionContextValue)
export const AccordionConsumer = AccordionContext.Consumer

export const AccordionProvider = ({ children }: PropsWithChildren) => {
  const [activeItems, setActiveItems] = useState<string[]>([])
  // The rationale for 'single' is that it implies auto-closing when
  // a different item is selected. Conversely, 'multiple' will NOT
  // auto-close previous items.
  const [type, setType] = useState<'single' | 'multiple'>('single')
  const [collapsible, setCollapsible] = useState(true)
  const [duration, setDuration] = useState(300)
  const [disableTransition, setDisableTransition] = useState(false)

  /* ======================
    updateActiveItems()
  ====================== */
  // An abstraction around setActiveItems() setter.

  const updateActiveItems = useCallback(
    (item: string) => {
      setActiveItems((prevItems) => {
        // Handle !collapsible
        // Disallow collapsing entire accordion if there is only
        // one item and that item is THE item and !collapsible.
        if (
          prevItems.includes(item) &&
          !collapsible &&
          prevItems.length === 1
        ) {
          return prevItems
        }

        // Handle type === 'single'
        if (type === 'single') {
          if (prevItems.includes(item)) {
            // We could return []. However, there might be cases
            // where defaultValue begins with multiple values and
            // we want to close them one by one.
            return prevItems.filter((i) => i !== item)
          }
          return [item]
        }

        // Handle type === 'multiple'
        if (prevItems.includes(item)) {
          return prevItems.filter((i) => i !== item)
        }
        return [...prevItems, item]
      })
    },
    [collapsible, type]
  )

  /* ======================
      setDefaultValue()
  ====================== */

  const setDefaultValue = useCallback((defaultValue: string | string[]) => {
    defaultValue =
      typeof defaultValue === 'string' ? [defaultValue] : defaultValue
    setActiveItems(defaultValue)
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <AccordionContext.Provider
      value={{
        activeItems,
        updateActiveItems,
        setType,
        setCollapsible,
        setDefaultValue,
        duration,
        setDuration,
        disableTransition,
        setDisableTransition
      }}
    >
      {children}
    </AccordionContext.Provider>
  )
}

export function useAccordionContext() {
  const value = useContext(AccordionContext)
  return value
}
