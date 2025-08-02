export type TransactionTableType = Partial<{
  id: string
  product_id: number
  quantity: number
  unit_id: number
  movement_type: 'in' | 'out' // disesuaikan jika hanya ada 2 jenis
  notes: string
  date: string
  user_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  product_name: string
  unit_name: string
  username: string
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
  total_data: number

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchTransaction: () => Promise<void>
}
