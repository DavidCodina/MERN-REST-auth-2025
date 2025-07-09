import * as React from 'react'

export type DropDownContextType = {
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void
}

export const DropDownContext = React.createContext<DropDownContextType | null>(
  null
)
