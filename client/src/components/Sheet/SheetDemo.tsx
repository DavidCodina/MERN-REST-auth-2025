import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const
// type SheetSide = (typeof SHEET_SIDES)[number]

/* ========================================================================

======================================================================== */

export const SheetDemo = () => {
  return (
    <div className='mx-auto grid max-w-[300px] grid-cols-2 gap-4'>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <button className='btn-blue btn-sm'>{side}</button>
          </SheetTrigger>

          <SheetContent
            className={`overflow-auto`}
            side={side}
            style={{ zIndex: 9999 }}
          >
            <SheetHeader>
              <SheetTitle className={'font-black text-blue-500 italic'}>
                Oh Sheet!
              </SheetTitle>
              <SheetDescription>
                Bla, bla, bla... This is the description.
              </SheetDescription>
            </SheetHeader>

            <div className='grid gap-4 py-4'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <button className='btn-blue btn-sm min-w-[100px]'>Close</button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
