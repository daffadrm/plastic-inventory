import { apiService, getHeader } from '../apiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getMasterConversionList = async (params?: {
  page?: number
  limit?: number
  search?: string
  order_column: any
  order_direction: string
}) => {
  const query = new URLSearchParams()

  if (params?.page) query.append('page', String(params.page))
  if (params?.limit) query.append('limit', String(params.limit))
  if (params?.search) query.append('search', params.search)
  if (params?.order_column) query.append('order_column', String(params.order_column))
  if (params?.order_direction) query.append('order_direction', String(params.order_direction))

  let response

  if (params?.search) {
    response = apiService(`${versioning1}/conversions/search/?${query.toString()}`, 'GET', null, getHeader())
  } else {
    response = apiService(`${versioning1}/conversions/list/?${query.toString()}`, 'GET', null, getHeader())
  }

  return response
}

export const updateMasterConversion = async (id: any, data: any) => {
  console.log(id, data)
  const response = await apiService(`${versioning1}/conversions/${id}`, 'PUT', data, getHeader())

  return response
}

export const createMasterConversion = async (data: any) => {
  const response = await apiService(`${versioning1}/conversions/create`, 'POST', data, getHeader())

  return response
}

export const deleteMasterConversion = async (id: any) => {
  const response = await apiService(`${versioning1}/conversions/${id}`, 'DELETE', null, getHeader())

  return response
}
