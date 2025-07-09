import { getExchangeRate } from '../utils'

export const getPriceInCurrency = (price: number, currency: string): number => {
  const rate = getExchangeRate('USD', currency)
  return price * rate
}
