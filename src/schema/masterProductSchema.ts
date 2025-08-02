import { z } from 'zod'

export const productSchema = z.object({
  product_name: z.string(),
  category: z.object(
    {
      id: z.number(),
      category_name: z.string(),
      description: z.string(),
      is_active: z.boolean(),
      created_at: z.string(),
      updated_at: z.string().nullable()
    },
    { message: 'Wajib diisi' }
  ),
  unit_symbol: z.object(
    {
      id: z.number(),
      unit_name: z.string(),
      unit_symbol: z.string(),
      unit_type: z.string(),
      description: z.string(),
      base_unit: z.boolean(),
      conversion_to_base: z.number().nullable(),
      created_at: z.string(),
      updated_at: z.string().nullable()
    },
    { message: 'Wajib diisi' }
  ),
  minimum_stock: z.coerce.number().optional(),
  current_stock: z.coerce.number().optional(),

  harga_jual: z.number(),
  harga_beli: z.number()
})

export type ProductSchema = z.infer<typeof productSchema>
