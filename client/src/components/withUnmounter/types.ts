// https://realfiction.net/2019/02/03/typescript-type-shenanigans-2-specify-at-least-one-property
// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198
type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

interface IWithUnmounterWide {
  show?: boolean
  isOpen?: boolean
  open?: boolean
  visible?: boolean
  isVisible?: boolean
}

export type IWithUnmounter = RequireOnlyOne<
  IWithUnmounterWide,
  'show' | 'isOpen' | 'open' | 'visible' | 'isVisible'
>
