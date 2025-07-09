export const getExchangeRate = (from: string, to: string): number => {
  console.log(`Getting the exchange rate ${from}-${to}...`)
  return Math.random()
}

export const getMyName = (): string => {
  return 'David'
}
