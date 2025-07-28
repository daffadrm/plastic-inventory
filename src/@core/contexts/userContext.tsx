'use client'
import { createContext, useContext, useState, useEffect } from 'react'

import { decryptData } from '@/utils/crypto'

type UserContextType = {
  dataUser: any
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataUser, setDataUser] = useState<any>({})

  useEffect(() => {
    const iv = localStorage.getItem('iv')
    const token = localStorage.getItem('token')

    if (iv && token) {
      try {
        const decrypting = decryptData(iv, token)
        const parseDecrypt = JSON.parse(decrypting as string)

        setDataUser(parseDecrypt)
      } catch (error) {
        setDataUser(null)
      }
    } else {
      setDataUser(null)
    }
  }, [])

  return <UserContext.Provider value={{ dataUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
