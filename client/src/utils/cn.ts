import { twMerge } from 'tailwind-merge'
import { clsx, ClassValue } from 'clsx'

/* ======================
Tailwind Conditional Classes
====================== */
///////////////////////////////////////////////////////////////////////////
//
// ShadCDN:           https://github.com/shadcn-ui/ui/blob/main/apps/www/lib/utils.ts
// Josh Tried Coding: https://www.youtube.com/watch?v=iWNhFHZ129s
// Medium:            https://medium.com/@nomanfareed681/simplify-your-tailwind-css-class-management-with-merge-and-clsx-42f1e2458fd8
// ByteGrad:          https://www.youtube.com/watch?v=re2JFITR7TI
// simonswiss:        https://www.youtube.com/watch?v=tfgLd5ZSNPc
//
// Usage example:
//
//   <h1
//     className={cn(
//       'p-5 text-center font-black text-blue-500' /* unconditional */,
//       { 'text-orange-500': loading}
//     )}
//   >{loading ? 'Loading...' : 'Idle'}</h1>
//
///////////////////////////////////////////////////////////////////////////

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
