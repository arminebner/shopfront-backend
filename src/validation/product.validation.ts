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
    image_url: string(),
    price: string({
      required_error: 'Price is necessary',
    }),
  }),
})

export type ProductInput = TypeOf<typeof validProduct>['body']
