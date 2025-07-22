import crypto from 'crypto'

const algorithm = process.env.NEXT_PUBLIC_SECRET_ALGORITHM
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

export const encryptData = (iv: string, data: string): string => {
  const ivBuffer = Buffer.from(iv, 'hex')

  const chiper = crypto.createCipheriv(
    algorithm || ('aes-256-cbc' as string),
    Buffer.from(secretKey as string),
    ivBuffer
  )

  let encrypted = chiper.update(data, 'utf8', 'hex')

  encrypted += chiper.final('hex')

  return encrypted
}

export const decryptData = (iv: string, encryptedData: string): string | null => {
  try {
    const ivBuffer = Buffer.from(iv, 'hex')
    const encryptedBuffer = Buffer.from(encryptedData, 'hex')

    const decipher = crypto.createDecipheriv(
      algorithm || ('aes-256-cbc' as string),
      Buffer.from(secretKey as string),
      ivBuffer
    )

    let decrypted = decipher.update(encryptedBuffer, undefined, 'utf8')

    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error: any) {
    console.error('Fail to decrypt data : ', error)

    return null
  }
}
