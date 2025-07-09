// https://mswjs.io/docs/migrations/1.x-to-2.x/
import { http, HttpResponse } from 'msw'

///////////////////////////////////////////////////////////////////////////
//
// declare const http: {
//   all: HttpRequestHandler;
//   head: HttpRequestHandler;
//   get: HttpRequestHandler;
//   post: HttpRequestHandler;
//   put: HttpRequestHandler;
//   delete: HttpRequestHandler;
//   patch: HttpRequestHandler;
//   options: HttpRequestHandler;
// };
//
///////////////////////////////////////////////////////////////////////////

export const handlers = [
  http.get(
    'https://jsonplaceholder.typicode.com/posts',
    (/*{ cookies, params, request, requestId }*/) => {
      const body = [
        {
          userId: 1,
          id: 1,
          title: 'MSW Title 1',
          body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
        },
        {
          userId: 1,
          id: 2,
          title: 'MSW Title 2',
          body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
        },
        {
          userId: 1,
          id: 3,
          title: 'MSW Title 3',
          body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut'
        }
      ]

      ///////////////////////////////////////////////////////////////////////////
      //
      // This is how it's done in the official documentation.
      // https://mswjs.io/docs/migrations/1.x-to-2.x/#response-declaration
      //
      //   return new Response(JSON.stringify(body), {
      //     headers: { Content-Type': 'application/json' }
      //   })
      //
      // However, in Mosh's Testing React Apps with React Testing Library, 28
      // he uses HttpResponse.json().
      //
      ///////////////////////////////////////////////////////////////////////////

      return HttpResponse.json(body)
    }
  )

  // http.get('http://localhost:3030/scoops', (_req, res, ctx) => {
  //   // It's important to return res().
  //   return res(
  //     ctx.json([
  //       { name: 'Chocolate', imagePath: '/images/chocolate.png' },
  //       { name: 'Vanilla', imagePath: '/images/vanilla.png' }
  //     ])
  //   )
  // }),
  // http.get('http://localhost:3030/toppings', (_req, res, ctx) => {
  //   return res(
  //     ctx.json([
  //       { name: 'Cherries', imagePath: '/images/cherries.png' },
  //       { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
  //       { name: 'Hot fudge', imagePath: '/images/hot-fudge.png' }
  //     ])
  //   )
  // }),
  // http.post('http://localhost:3030/order', (_req, res, ctx) => {
  //   return res(ctx.json({ orderNumber: 123455676 }))
  // })
]
