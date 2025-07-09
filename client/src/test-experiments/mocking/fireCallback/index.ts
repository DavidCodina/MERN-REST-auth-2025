type Callback = (str: string) => string

export const fireCallback = (str: string, callback: Callback) => {
  return callback?.(str)
}
