import { z } from 'zod'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: Even though title is required, the Zod validation for title will
// only trigger when title is "". Why? Because the GraphQL layer has
// it's own validation based off of the type definition:
//
//   input CreateTodoInput {
//     title: String!
//     body: String
//   }
//
// Ultimately, this means that the validation can be coming from two different
// places and that the code may be the built-in "BAD_USER_INPUT" or the custom
// "FORM_ERRORS" error. That said, in practice it's unlikely that we will see
// "BAD_USER_INPUT" if the client properly handled the client-side validation.
// In other words, generic server errors are often an indication that a developer
// has not thoroughly accounted for all the possible scenarios.
//
// Note: if you want to customize the error messages coming back from GraphQL,
// that can be done in the formatError propery in the main ApolloServer setup.
// However, that will get super tedious.
//
//   formatError: (err) => {
//     return err
//   },
//
///////////////////////////////////////////////////////////////////////////

export const CreateTodoSchema = z.object({
  title: z.string().trim().min(1, 'A title is required.'),
  body: z.string().optional()
})
