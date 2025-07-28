import { z } from 'zod'

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.object({ label: z.string(), value: z.string() }, { message: 'Wajib diisi' }),
  satuan: z.string(),
  stock: z.number(),
  selling_price: z.number(),
  purchase_price: z.number(),
  min_stock: z.number()
})

export type ProductSchema = z.infer<typeof productSchema>
