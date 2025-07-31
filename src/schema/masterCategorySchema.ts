import { z } from 'zod'

export const categorySchema = z.object({
  category_name: z.string().min(1, { message: 'Wajib diisi.' }),
  description: z.string().min(1, { message: 'Wajib diisi.' }),
  is_active: z.object({
    label: z.string(),
    value: z.boolean()
  })
})

export type CategorySchema = z.infer<typeof categorySchema>
