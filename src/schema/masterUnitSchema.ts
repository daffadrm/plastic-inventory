import { z } from 'zod'

export const unitSchema = z.object({
  id: z.number(),
  name: z.string(),
  simbol: z.string(),
  type: z.string(),
  description: z.string()
})

export type UnitSchema = z.infer<typeof unitSchema>
