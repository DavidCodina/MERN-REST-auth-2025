import { useCallback, useState } from 'react'

export const useForceRender = (): VoidFunction => {
  const [, setForceRenderCount] = useState(0)
  return useCallback(() => {
    setForceRenderCount((v) => v + 1)
  }, [])
}

// See also: https://github.com/CharlesStover/use-force-update/blob/main/src/index.ts
// const useForceRender = (): VoidFunction => {
//   const createNewObject = (): Record<string, never> => ({})
//   const [, setValue] = useState<Record<string, never>>(createNewObject)
//   return useCallback((): void => {
//     setValue(createNewObject())
//   }, [])
// }
