export type TransactionTableType = Partial<{
  number_transaction: string
  name_product: string
  quantity: string
  unit: string
  type: string
  created_by: string
  created_at: number
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
}

export type TransactionStore = {
  dataList: any
  isLoading: boolean
  isError: boolean

  page: number
  limit: number
  search: string
  order_column: string
  order_direction: string

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchTransaction: (id: any) => Promise<void>
}
