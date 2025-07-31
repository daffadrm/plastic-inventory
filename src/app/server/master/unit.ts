import { apiService, getHeader } from '../apiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getMasterUnitList = async (params?: {
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
    response = apiService(`${versioning1}/units/search/?${query.toString()}`, 'GET', null, getHeader())
  } else {
    response = apiService(`${versioning1}/units/list/?${query.toString()}`, 'GET', null, getHeader())
  }

  return response
}

export const updateMasterUnits = async (id: any, data: any) => {
  const response = await apiService(`${versioning1}/units/${id}`, 'PUT', data, getHeader())

  return response
}

export const createMasterUnits = async (data: any) => {
  const response = await apiService(`${versioning1}/units/create`, 'POST', data, getHeader())

  return response
}

export const deleteMasterUnits = async (id: string) => {
  const response = await apiService(`${versioning1}/units/${id}`, 'DELETE', null, getHeader())

  return response
}
