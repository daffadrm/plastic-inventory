export type MasterProductTableType = Partial<{
  id: number
  name: string
  category: string
  satuan: string
  stock: number
  selling_price: number
  purchase_price: number
  min_stock: number
  supplier: string
  status: 'Active' | 'Inactive'
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

  page: number
  limit: number
  search: string
  order_column: string
  order_direction: string

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchMasterProduct: (id: any) => Promise<void>
  updateMasterProduct: (data: any, id: string) => Promise<boolean>
}
