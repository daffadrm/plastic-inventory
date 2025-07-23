import { localApiService } from '../localApiService'

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
  if (params?.search) query.append('search', params.search)
  if (params?.order_column) query.append('order_column', String(params.order_column))
  if (params?.order_direction) query.append('order_direction', String(params.order_direction))

  const response = await localApiService(`/dummyMasterProduct.json?${query.toString()}`, 'GET', null, () => false)

  return response
}

export const updateMasterProduct = async (id: any, data: any) => {
  console.log(id, data)
  const response = await localApiService('/dummyMasterProduct.json', 'GET', null, () => false)

  return response
}
