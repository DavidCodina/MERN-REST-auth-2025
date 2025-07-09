import {
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  createContext,
  useContext,
  useState
  // useEffect
} from 'react'

export interface AccordionItemContextValue {
  value: string
  setValue: Dispatch<SetStateAction<string>>

  // [key: string]: any
}

/* ========================================================================

======================================================================== */

export const AccordionItemContext = createContext(
  {} as AccordionItemContextValue
)
export const AccordionItemConsumer = AccordionItemContext.Consumer

export const AccordionItemProvider = ({ children }: PropsWithChildren) => {
  const [value, setValue] = useState('')
  /* ======================
          return
  ====================== */

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        setValue
      }}
    >
      {children}
    </AccordionItemContext.Provider>
  )
}

export function useAccordionItemContext() {
  const value = useContext(AccordionItemContext)
  return value
}
