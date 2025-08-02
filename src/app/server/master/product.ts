import { apiService, getHeader } from '../apiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getMasterProductList = async (params?: {
  page?: number
  limit?: number
  search?: string
  order_column: any
  order_direction: string
}) => {
  const query = new URLSearchParams()

  if (params?.page) query.append('page', String(params.page))
  if (params?.limit) query.append('limit', String(params.limit))
  if (params?.search) query.append('query', params.search)
  if (params?.order_column) query.append('order_column', String(params.order_column))
  if (params?.order_direction) query.append('order_direction', String(params.order_direction))

  let response

  if (params?.search) {
    response = apiService(`${versioning1}/products/search/?${query.toString()}`, 'GET', null, getHeader())
  } else {
    response = apiService(`${versioning1}/products/list/?${query.toString()}`, 'GET', null, getHeader())
  }

  return response
}

export const updateMasterProduct = async (id: any, data: any) => {
  const formData = new FormData()

  // Tambahkan semua field dari data ke FormData
  Object.entries(data).forEach(([key, value]) => {
    // Jika value adalah array, tambahkan setiap item
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        formData.append(`${key}[${i}]`, v)
      })
    } else {
      formData.append(key, value as string | Blob)
    }
  })

  const headers = {
    ...getHeader(),
    'Content-Type': 'multipart/form-data' // opsional, tergantung implementasi apiService
  }

  const response = await apiService(`${versioning1}/products/${id}`, 'PUT', data, headers)

  return response
}

export const createMasterProduct = async (data: any) => {
  const formData = new FormData()

  // Tambahkan semua field dari data ke FormData
  Object.entries(data).forEach(([key, value]) => {
    // Jika value adalah array, tambahkan setiap item
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        formData.append(`${key}[${i}]`, v)
      })
    } else {
      formData.append(key, value as string | Blob)
    }
  })

  const headers = {
    ...getHeader(),
    'Content-Type': 'multipart/form-data' // opsional, tergantung implementasi apiService
  }

  const response = await apiService(`${versioning1}/products/create`, 'POST', data, headers)

  return response
}

export const deleteMasterProduct = async (id: string) => {
  const response = await apiService(`${versioning1}/products/${id}`, 'DELETE', null, getHeader())

  return response
}

export const getSearchMasterProduct = async () => {
  const response = apiService(`${versioning1}/products/search`, 'GET', null, getHeader())

  return response
}
