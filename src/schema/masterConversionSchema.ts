import { z } from 'zod'

export const conversionSchema = z.object({
  id: z.number(),
  product_name: z.object(
    {
      id: z.number(),
      product_name: z.string(),
      category_id: z.number(),
      category_name: z.string(),
      unit_id: z.number(),
      unit_name: z.string(),
      unit_symbol: z.string(),
      minimum_stock: z.number(),
      harga_beli: z.number(),
      harga_jual: z.number(),
      created_at: z.string(), // ISO date string
      updated_at: z.string().nullable(),
      current_stock: z.number()
    },
    { message: 'Wajib diisi' }
  ),
  from_unit: z.object(
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
  to_unit: z.object(
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
  conversion_value: z.number()
})

export type ConversionSchema = z.infer<typeof conversionSchema>
