import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  status: z.object({ label: z.string(), value: z.string() }, { message: 'Wajib diisi' })
})

export type CategorySchema = z.infer<typeof categorySchema>
