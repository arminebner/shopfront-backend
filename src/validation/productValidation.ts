import { object, string, TypeOf } from 'zod'
import crypto from 'crypto'

export const validProduct = object({
  body: object({
    id: string().default(crypto.randomUUID()),
    name: string({
      required_error: 'Product name is necessary',
    }),
    short_description: string({
      required_error: 'Short description is necessary',
    }).max(100, 'Short description should contain a max of 100 characters'),
    description: string().max(300, 'Short description should contain a max of 300 characters'),
    price: string({
      required_error: 'Price is necessary',
    }),
  }),
})

export type ProductInput = TypeOf<typeof validProduct>['body']

// extra model for image

// This is a file validation with a few extra checks in the `superRefine`.
// The `refine` method could also be used, but `superRefine` offers better
// control over when the errors are added and can include specific information
// about the value being parsed.
/* const imageSchema = z.instanceof(File).superRefine((f, ctx) => {
  // First, add an issue if the mime type is wrong.
  if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
        ", "
      )}] but was ${f.type}`
    });
  }
  // Next add an issue if the file size is too large.
  if (f.size > 3 * MB_BYTES) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      type: "array",
      message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${
        f.size
      }`,
      maximum: 3 * MB_BYTES,
      inclusive: true
    });
  }
}); */
