import { z } from 'zod'

/* ========================================================================

======================================================================== */

export const UpdateTodoSchema = z.object({
  title: z.string().trim().min(1, 'A title is required.').optional(),
  body: z.string().optional(),
  // In practice, the Zod boolean() error will never get triggered because
  // GraphQL would catch it first in the validation phase, and short-circuit
  // before the resolver ever executes.
  completed: z
    .boolean({
      // required_error?: string | undefined;
      // message?: string | undefined;
      // description?: string | undefined;
      // errorMap?: ZodErrorMap | undefined;
      invalid_type_error: 'The value must be a boolean.'
    })
    .optional()
})
