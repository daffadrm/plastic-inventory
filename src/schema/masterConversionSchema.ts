import { z } from 'zod'

export const conversionSchema = z.object({
  id: z.number(),
  product_id: z.string().optional(),
  product_name: z.string(),
  from_unit: z.string(),
  to_unit: z.string(),
  multiplier: z.string()
})

export type ConversionSchema = z.infer<typeof conversionSchema>
