import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef
} from 'react'

interface TabsContextValue {
  activeKey: string
  keepMounted: boolean
  setActiveKey: Dispatch<SetStateAction<string>>
  setTabCustomization: Dispatch<SetStateAction<string>>
  setTabKeys: Dispatch<SetStateAction<string[]>>
  tabCustomization: string
  tabKeys: string[]
  vertical: boolean
  // [key: string]: any
}

//# Document all of these
export interface ITabsProvider {
  children?: ReactNode
  defaultValue?: string
  keepMounted?: boolean
  onChange?: (activeKey: string) => void
  value?: string
  vertical?: boolean
}

/* ========================================================================

======================================================================== */

export const TabsContext = createContext({} as TabsContextValue)
export const TabsConsumer = TabsContext.Consumer

export const TabsProvider = ({
  children,
  defaultValue = '',
  keepMounted = true, // Inspired by https://mantine.dev/core/tabs/#unmount-inactive-tabs
  onChange,
  value = '',
  vertical = false
}: ITabsProvider) => {
  /* ======================
        state & refs
  ====================== */

  // Wrap onChange in useRef to bypass useEffect deps.
  const onChangeRef = useRef(onChange)

  // Set the active tab key.
  const [activeKey, setActiveKey] = useState(value || defaultValue)

  // tabKeys is used to automate setting the defaultActiveKey (i.e., initialKey).
  const [tabKeys, setTabKeys] = useState<string[]>([])

  // Will be '' or the associated class name for navFill / navJustified.
  const [tabCustomization, setTabCustomization] = useState('')

  /* ======================
        useEffect() 
  ====================== */
  // If no value || defaultValue on activeKey initialization,
  // then watch tabKeys, and set it to tabKeys[0].

  useEffect(() => {
    if (activeKey) {
      return
    }

    if (tabKeys[0] && typeof tabKeys[0] === 'string') {
      const defaultActiveKey = tabKeys[0]
      setActiveKey(defaultActiveKey)
    }
  }, [activeKey, tabKeys])

  /* ======================
        useEffect() 
  ====================== */
  // Two-way binding part 1:
  // When controlled value state changes in the consuming code,
  // update activeKey with value (i.e., activeKeyValue).

  useEffect(() => {
    // Must return early if !value. Otherwise, it will
    //  override the previous useEffect.
    if (!value) {
      return
    }
    setActiveKey(value)
  }, [value])

  /* ======================
        useEffect() 
  ====================== */
  // Two-way binding part 2:
  // Pass back activeKey to consuming code, so it can update controlled state setter.

  useEffect(() => {
    onChangeRef.current?.(activeKey)
  }, [activeKey])

  /* ======================
          return
  ====================== */

  return (
    <TabsContext.Provider
      value={{
        activeKey,
        keepMounted,
        setActiveKey,
        setTabCustomization,
        setTabKeys,
        tabCustomization,
        tabKeys,
        vertical
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export function useTabsContext() {
  const value = useContext(TabsContext)
  return value
}
