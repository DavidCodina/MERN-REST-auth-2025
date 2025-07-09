import { RadixScrollArea } from './'

const items = Array.from({ length: 50 }).map((_, i, _a) => {
  return `Item ${i + 1}`
})

/* ========================================================================
                            RadixScrollAreaDemo
======================================================================== */

export const RadixScrollAreaDemo = () => {
  return (
    <RadixScrollArea
      vertical={true}
      horizontal={true}
      className={`mx-auto h-[200px] max-w-[200px] overflow-hidden rounded-2xl border border-gray-400 [background-color:floralWhite] shadow-xl [--radix-scrollarea-scrollbar-hover-bg:theme(colors.blue.500/20%)] [--radix-scrollarea-scrollbar-padding:theme(spacing[0.5])] [--radix-scrollarea-scrollbar-size:theme(spacing.2)] [--radix-scrollarea-thumb-bg:theme(colors.blue.500)]`}
    >
      <section className={`p-4`}>
        <div className='text-base leading-none font-black text-blue-500'>
          Items
        </div>

        {items.map((item) => (
          <div
            className='mt-2.5 border-t border-t-blue-500 pt-2.5 text-sm whitespace-nowrap'
            key={item}
          >
            <span className='font-bold text-blue-500'>{item}:</span> (a b c d e
            f g h i j k l m n o p q r s t u v w x y z)
          </div>
        ))}
      </section>
    </RadixScrollArea>
  )
}
