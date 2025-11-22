'use client'

import { useEffect, useState, useCallback } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import Loading from './loading/Loading'
import { decryptData } from '@/utils/crypto'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname() || ''

  const isRestrictedForStaff = useCallback((path: string): boolean => {
    const restrictedPaths = ['/dashboard']

    return restrictedPaths.includes(path) || path.startsWith('/master')
  }, [])

  useEffect(() => {
    const tokenStorage = localStorage.getItem('token')
    const ivStorage = localStorage.getItem('iv')
    const encryptedToken = decryptData(ivStorage || '', tokenStorage || '')
    let token = null
    let user = null

    if (encryptedToken) {
      try {
        const parsed = JSON.parse(encryptedToken)

        token = parsed?.token
        user = parsed?.user
      } catch (error) {
        localStorage.removeItem('iv')
        localStorage.removeItem('token')
      }
    }

    // Kondisi: tidak ada token dan bukan halaman login
    if (!token && pathname !== '/login') {
      localStorage.removeItem('iv')
      localStorage.removeItem('token')
      router.replace('/login')

      return
    }

    // Kondisi: ada token dan sedang di halaman login
    if (token && pathname === '/login') {
      if (user?.role === 'staff') {
        router.replace('/items-out')
      } else {
        router.replace('/dashboard')
      }

      return
    }

    // Kondisi: role staff mencoba akses halaman restricted
    if (token && isRestrictedForStaff(pathname) && user?.role === 'staff') {
      router.replace('/items-out')

      return
    }

    setIsAuthenticated(true)
    setChecking(false)
  }, [router, pathname, isRestrictedForStaff])

  // Jangan render apa pun sampai proses pengecekan selesai
  if (checking || isAuthenticated === null) {
    return <Loading />
  }

  return <>{children}</>
}

export default AuthGuard
