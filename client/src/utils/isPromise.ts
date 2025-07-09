// isPromise won't actually check the value of T. Rather, it merely checks if
// value is a Promise. The use of `value is Promise<T>` allows TypeScript to understand
// that if isPromise() returns true, the value is a Promise that will resolve to type T.
// However, this does not guarantee that the Promise has resolved or that the
// data is valid at the time of the check.

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}
