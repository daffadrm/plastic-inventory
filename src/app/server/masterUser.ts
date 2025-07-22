import { decryptData } from '@/utils/crypto'
import { apiService } from '@/app/server/apiService'

type LoadHandler = (isLoading: boolean) => void

const versioning1 = process.env.NEXT_PUBLIC_API_V1

const getHeader = () => {
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

  const headers = {
    Authorization: `Bearer ${resultsToken?.data?.token || ''}`
  }

  return headers
}

export const getDataUser = async (loadHandler: LoadHandler, search: string): Promise<any> => {
  const response = await apiService(
    `${versioning1}/user/get?search=${search}`,
    'GET',
    undefined,
    loadHandler,
    getHeader()
  )

  return response
}

export const postUser = async (
  laodHandler: LoadHandler,
  data: {
    uuid?: string
    username: string
    password: string
    fullname: string
    email: string
    phone: string
    cluster: string
    role: string
  }
): Promise<any> => {
  const endpoint = data.uuid ? `${versioning1}/user/update` : `${versioning1}/user/create`
  const response = apiService(endpoint, 'POST', data, laodHandler, getHeader())

  return response
}

export const deleteUser = async (loadHandler: LoadHandler, data: any): Promise<any> => {
  const response = await apiService(`${versioning1}/user/delete`, 'POST', data, loadHandler, getHeader())

  return response
}
