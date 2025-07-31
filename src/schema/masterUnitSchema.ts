import { z } from 'zod'

export const unitSchema = z.object({
  unit_name: z.string().min(1, { message: 'Wajib diisi.' }),
  unit_symbol: z.string().min(1, { message: 'Wajib diisi.' }),
  unit_type: z.string().min(1, { message: 'Wajib diisi.' }),
  description: z.string().min(1, { message: 'Wajib diisi.' })
})

export type UnitSchema = z.infer<typeof unitSchema>
