import { apiService, getHeader } from '../apiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getMasterCategoryList = async (params?: {
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
    response = apiService(`${versioning1}/categories/search/?${query.toString()}`, 'GET', null, getHeader())
  } else {
    response = apiService(`${versioning1}/categories/list/?${query.toString()}`, 'GET', null, getHeader())
  }

  return response
}

export const updateMasterCategory = async (id: any, data: any) => {
  const response = await apiService(`${versioning1}/categories/${id}`, 'PUT', data, getHeader())

  return response
}

export const createMasterCategory = async (data: any) => {
  const response = await apiService(`${versioning1}/categories/create`, 'POST', data, getHeader())

  return response
}

export const deleteMasterCategory = async (id: string) => {
  const response = await apiService(`${versioning1}/categories/${id}`, 'DELETE', null, getHeader())

  return response
}
