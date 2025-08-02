import { apiService, getHeader } from '../apiService'

// import { localApiService } from '../localApiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getTransactionList = async (params?: {
  page?: number
  limit?: number
  search?: string
  order_column: any
  order_direction: string
  type: string
}) => {
  const query = new URLSearchParams()

  if (params?.page) query.append('page', String(params.page))
  if (params?.limit) query.append('limit', String(params.limit))
  if (params?.search) query.append('search', params.search)
  if (params?.order_column) query.append('order_column', String(params.order_column))
  if (params?.order_direction) query.append('order_direction', String(params.order_direction))
  if (params?.type) query.append('type', params.type)

  // const response = await localApiService(`/dummyTransaction.json?${query.toString()}`, 'GET', null, () => false)
  const response = apiService(`${versioning1}/stocks/list/?${query.toString()}`, 'GET', null, getHeader())

  return response
}
