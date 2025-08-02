export type MasterProductTableType = Partial<{
  id: number
  product_name: string
  category_name: string
  unit_symbol: string
  harga_jual: number
  harga_beli: number
  current_stock: number
  minimum_stock: number
  supplier: string
  updated_at: string
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
}

export type MasterProductStore = {
  dataList: any
  isLoading: boolean
  isError: boolean
  isLoadingUpdate: boolean
  dataOptionProduct: any

  page: number
  limit: number
  search: string
  order_column: string
  order_direction: string
  total_data: number

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchMasterProduct: () => Promise<void>
  updateMasterProduct: (data: any, id: string) => Promise<boolean>
  deleteMasterProduct: (id: string) => Promise<boolean>
  fetchOptionProduct: () => Promise<void>
}
