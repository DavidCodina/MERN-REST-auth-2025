// https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object

export const searchParamsToObject = (urlSearchParams: URLSearchParams) => {
  const entries = urlSearchParams.entries()
  const result: any = {}
  for (const [key, value] of entries) {
    result[key] = value
  }
  return result
}
