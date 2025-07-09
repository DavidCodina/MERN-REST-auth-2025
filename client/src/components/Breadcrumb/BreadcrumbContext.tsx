import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode
} from 'react'

export interface BreadcrumbContextValue {
  items: { current: HTMLLIElement | null }[]
  setItems: Dispatch<
    SetStateAction<
      {
        current: HTMLLIElement | null
      }[]
    >
  >
  separator: ReactNode
  // [key: string]: any
}

interface IBreadcrumbProvider extends PropsWithChildren {
  separator?: ReactNode
}

/* ========================================================================

======================================================================== */

export const BreadcrumbContext = createContext({} as BreadcrumbContextValue)

export const BreadcrumbProvider = ({
  children,
  // separator gets passed in as a prop, then gets passed straight through to the context value.
  separator
}: IBreadcrumbProvider) => {
  const [items, setItems] = useState<{ current: HTMLLIElement | null }[]>([])

  /* ======================
          return
  ====================== */

  return (
    <BreadcrumbContext.Provider
      value={{
        items,
        setItems,
        separator
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbContext() {
  const value = useContext(BreadcrumbContext)
  return value
}
