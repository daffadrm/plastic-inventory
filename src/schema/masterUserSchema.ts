import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/

export const userSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Minimal 3 karakter.' })
      .regex(/^[a-zA-Z0-9_]+$/, { message: 'Hanya boleh berisi huruf, angka, dan garis bawah (_)' }),
    fullname: z.string().min(1, { message: 'Wajib diisi.' }),
    email: z.string().email({ message: 'Tidak valid.' }),
    role: z.object({ label: z.string(), value: z.string() }, { message: 'Wajib diisi' }),
    password: z
      .string()
      .optional()
      .refine(val => val === undefined || val.length >= 6, {
        message: 'Minimal 6 karakter.'
      })
      .refine(val => val === undefined || passwordRegex.test(val), {
        message: 'Gunakan minimal satu huruf besar, satu huruf kecil, angka, dan simbol supaya lebih aman.'
      }),
    confirm_password: z.string().optional()
  })
  .refine(
    data => {
      if (data.password || data.confirm_password) {
        return data.password === data.confirm_password
      }

      return true
    },
    {
      path: ['confirm_password'],
      message: 'Tidak cocok.'
    }
  )

export type UserSchema = z.infer<typeof userSchema>
