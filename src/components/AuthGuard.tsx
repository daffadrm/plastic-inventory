// src/components/AuthGuard.tsx
'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import Loading from './loading/Loading'
import { decryptData } from '@/utils/crypto'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname() || ''

  useEffect(() => {
    const tokenStorage = localStorage.getItem('token')
    const ivStorage = localStorage.getItem('iv')
    const encryptedToken = decryptData(ivStorage || '', tokenStorage || '')
    let token = null

    if (encryptedToken) {
      try {
        token = encryptedToken ? JSON.parse(encryptedToken)?.token : null
      } catch (error) {
        localStorage.removeItem('iv')
        localStorage.removeItem('token')
      }
    }

    if (token && pathname === '/login') {
      // If there's a token and the user is on the login page, redirect to home
      router.replace('/dashboard')
    } else if (!token && pathname !== '/login') {
      // If there's no token and the user is not on the login page, redirect to login
      router.replace('/login')
      localStorage.removeItem('iv')
      localStorage.removeItem('token')
    } else {
      setIsAuthenticated(false)
    }
  }, [router, pathname])

  if (isAuthenticated === null) {
    return (
      <div>
        <Loading />
      </div>
    ) // Show a loading state while checking authentication
  }

  return <>{children}</>
}

export default AuthGuard
