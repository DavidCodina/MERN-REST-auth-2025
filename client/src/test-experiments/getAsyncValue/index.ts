export const getAsyncValue = async (value: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Promise.resolve(value)
}
