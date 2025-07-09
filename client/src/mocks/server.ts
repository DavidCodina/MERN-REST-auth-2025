// // This configures a request mocking server with the given request handlers.
// export const server = setupServer(...handlers)

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
