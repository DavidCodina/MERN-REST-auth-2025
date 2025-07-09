// export const sum = (n1: number, n2: number): number => {
//   return n1 + n2
// }

export const sum = (...numbers: number[]): number => {
  return numbers.reduce((total, number) => total + number, 0)
}
