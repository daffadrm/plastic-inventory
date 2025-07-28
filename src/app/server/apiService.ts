import crypto from 'crypto'

import axios from 'axios'

import { errorNetwork } from '@/constants/wording'

import { decryptData, encryptData } from '@/utils/crypto'

const ivGenerate = crypto.randomBytes(16)?.toString('hex')

const defaultURL = process.env.NEXT_PUBLIC_DEFAULT_API
const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const apiService = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers?: any
) => {
  const tokenStorage = localStorage.getItem('token')
  const ivStorage = localStorage.getItem('iv')
  const encryptedToken = decryptData(ivStorage || '', tokenStorage || '')
  let resultsToken = null

  if (encryptedToken) {
    try {
      resultsToken = encryptedToken ? JSON.parse(encryptedToken) : null
    } catch (error: any) {
      localStorage.removeItem('iv')
      localStorage.removeItem('token')

      throw error
    }
  }

  try {
    const url = `${defaultURL}/${endpoint}`

    const response = await axios({
      url: url,
      method,
      data,
      headers
    })

    return response.data
  } catch (error: any) {
    let customError

    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 404:
          customError = new Error('Resource not found (404).')
          Object.assign(customError, error)
          Object.defineProperty(customError, 'message', { value: 'Resource not found (404).' })

          throw customError
          break
        case 401:
          try {
            const urlRefreshToken = `${defaultURL}/${versioning1}/auth/refresh-token/`

            const refreshTokenResult = await axios({
              url: urlRefreshToken,
              method: 'POST',
              headers: {
                ...headers,
                Authorization: `Bearer ${resultsToken?.data?.token || ''}`
              },
              data: {
                refresh_token: resultsToken?.data?.refresh_token
              }
            })

            resultsToken.data.token = refreshTokenResult?.data?.data?.token
            resultsToken.data.refresh_token = refreshTokenResult?.data?.data?.refreshToken

            headers = {
              ...headers,
              Authorization: `Bearer ${resultsToken?.data?.token || ''}`
            }

            const urlRetryResult = `${defaultURL}/${endpoint}`

            const retryResult = await axios({
              url: urlRetryResult,
              method,
              data,
              headers
            })

            localStorage.setItem('iv', ivGenerate)
            localStorage.setItem('token', encryptData(ivGenerate, JSON.stringify(resultsToken)))

            console.log('Berhasil refresh token')

            return retryResult?.data
          } catch (refreshError: any) {
            console.error('Error refresh token: ', refreshError)

            localStorage.removeItem('iv')
            localStorage.removeItem('token')

            window.location.reload()

            customError = new Error('Unauthorized access (401).')
            Object.assign(customError, error)
            Object.defineProperty(customError, 'message', { value: 'Unauthorized access (401).' })

            throw customError
          }

          break
        case 500:
          customError = new Error('Internal server error (500).')
          Object.assign(customError, error)
          Object.defineProperty(customError, 'message', { value: 'Internal server error (500).' })

          throw customError
          break
        default:
          customError = new Error(error?.response?.data?.meta?.message)
          Object.assign(customError, error)
          Object.defineProperty(customError, 'message', {
            value: error?.response?.data?.meta?.message || 'Unknown error occurred.'
          })

          throw customError
      }
    } else if (!error?.response) {
      customError = new Error(errorNetwork)
      Object.assign(customError, error)
      Object.defineProperty(customError, 'message', { value: errorNetwork })

      throw customError
    }

    throw error
  }
}

export const getHeader = (headerParam?: { [key: string]: string }) => {
  const tokenStorage = localStorage.getItem('token')
  const ivStorage = localStorage.getItem('iv')
  const encryptedToken = decryptData(ivStorage || '', tokenStorage || '')
  let resultsToken = null

  if (encryptedToken) {
    try {
      resultsToken = encryptedToken ? JSON.parse(encryptedToken) : null
    } catch (error: any) {
      localStorage.removeItem('iv')
      localStorage.removeItem('token')

      throw error
    }
  }

  let headers = {
    Authorization: `Bearer ${resultsToken?.data?.token || ''}`
  }

  if (headerParam) {
    headers = {
      ...headers,
      ...headerParam
    }
  }

  return headers
}
