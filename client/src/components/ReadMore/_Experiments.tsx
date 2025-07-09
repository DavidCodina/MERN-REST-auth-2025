// import ClampLines from 'react-clamp-lines'

// export const TruncatedText2 = (props: any) => {
//   return (
//     <ClampLines
//       text='Throughout human history, as our species has faced the frightening, terrorizing fact that we do not know who we are, or where we are going in this ocean of chaos, it has been the authorities, the political, the religious, the educational authorities who attempted to comfort us by giving us order, rules, regulations, informing, forming in our minds their view of reality. To think for yourself you must question authority and learn how to put yourself in a state of vulnerable, open-mindedness; chaotic, confused, vulnerability to inform yourself.'
//       id='really-unique-id'
//       lines={2}
//       ellipsis='...'
//       moreText='Read More'
//       lessText='Read Less'
//       className='rounded-lg border border-neutral-400 bg-white p-2 [&.clamp-lines__button]:ml-auto [&.clamp-lines__button]:mr-2 [&.clamp-lines__button]:block [&.clamp-lines__button]:text-sm [&.clamp-lines__button]:font-bold [&.clamp-lines__button]:text-blue-500 [&_p]:mb-1'
//       innerElement='p'
//     />
//   )
// }

/* ========================================================================
                              TruncatedText2
======================================================================== */

// import ShowMoreText from 'react-show-more-text'

// export const TruncatedText2 = (props: any) => {
//   const executeOnClick = (isExpanded: any) => {
//     console.log(isExpanded)
//   }

//   return (
//     <ShowMoreText
//       lines={3}
//       // The 'Show More' element is very janky on viewport resizing.
//       more='Show more'
//       less='Show less'
//       //! It will be janky if you put padding on it directly.
//       className='rounded-lg border border-gray-400 bg-white'
//       anchorClass='text-blue-500 font-bold cursor-pointer whitespace-nowrap'
//       onClick={executeOnClick}
//       expanded={false}
//       // width={280}
//       truncatedEndingComponent={'... '}
//     >
//       Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam, unde itaque
//       soluta a sint molestiae fugit quos eligendi beatae? Voluptate, sapiente
//       incidunt qui velit asperiores tempore, explicabo odit quod non obcaecati,
//       eveniet sit officia. Dolor porro itaque consequuntur earum eaque expedita
//       facere alias, ratione dignissimos, eius nemo numquam, repellat quaerat
//       error? Rem aperiam commodi aut tenetur adipisci quas quam consectetur
//       dignissimos accusamus debitis fuga, minima eligendi eos ut! Recusandae
//       numquam atque modi quisquam eligendi reiciendis, officiis, iste aliquam
//       iure, repellat dicta harum exercitationem? Est ullam dolorum sunt,
//       officiis quam voluptates autem ex consectetur vel voluptate, error aliquid
//       odio dolor quas.
//     </ShowMoreText>
//   )
// }

/* ========================================================================
  
======================================================================== */

// import { useState } from 'react'
// import TextTruncate from 'react-text-truncate'

// export const TruncatedText2 = (props: any) => {
//   const [line, setLine] = useState(2)
//   return (
//     <TextTruncate
//       // 0 or false will give you all lines and no Read On
//       // But then there's no read less button.
//       // Here we'd need to manually create our own 'read less' button to get back
//       // to the initial state.
//       line={line}
//       element='span'
//       truncateText='…'
//       text='Throughout human history, as our species has faced the frightening, terrorizing fact that we do not know who we are, or where we are going in this ocean of chaos, it has been the authorities, the political, the religious, the educational authorities who attempted to comfort us by giving us order, rules, regulations, informing, forming in our minds their view of reality. To think for yourself you must question authority and learn how to put yourself in a state of vulnerable, open-mindedness; chaotic, confused, vulnerability to inform yourself.'
//       textTruncateChild={
//         <button
//           onClick={() => {
//             setLine((v) => {
//               if (v === 2) {
//                 return 0
//               }
//               return 2
//             })
//           }}
//         >
//           Read on
//         </button>
//       }
//     />
//   )
// }

/* ========================================================================

======================================================================== */

// import { ComponentProps } from 'react'
// import LinesEllipsis from 'react-lines-ellipsis'
// import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
// const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)
// interface ITruncatedText extends ComponentProps<typeof ResponsiveEllipsis> {}

// export const TruncatedText2 = (props: ITruncatedText) => {
//   return (
//     <ResponsiveEllipsis
//       text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui id quibusdam vitae. Quisquam sit et veritatis iure, doloremque, nostrum impedit ad earum magni debitis numquam excepturi natus molestiae iusto cum perspiciatis atque in! Deleniti magnam mollitia molestias, quidem aliquam libero non. Illo dolorum, quis incidunt iusto dolores a nisi, provident suscipit, eos tempore harum eaque assumenda ratione quisquam! Et, earum sed sunt incidunt blanditiis quis omnis quisquam voluptates mollitia ratione, corrupti deleniti tenetur explicabo nemo numquam libero assumenda tempore! Omnis in voluptatum corporis, eligendi dolorum, ducimus architecto porro eos quis aliquid officiis. Modi nobis odit dolores in nulla esse neque.'
//       maxLine='3'
//       ellipsis='...'
//       trimRight
//       basedOn='letters'
//     />
//   )
// }
