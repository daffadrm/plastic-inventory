import { z } from 'zod'

export const userSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone_number: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid phone number format'),
  role: z.object({ label: z.string(), value: z.string() }, { message: 'Wajib diisi' }),
  status: z.enum(['Active', 'Inactive', 'Suspended']),
  profile_picture: z.string().url().nullable(), // null jika tidak ada
  createdAt: z.string(), // bisa pakai z.coerce.date() jika ingin validasi tanggal
  updatedAt: z.string()
})

export type UserSchema = z.infer<typeof userSchema>
