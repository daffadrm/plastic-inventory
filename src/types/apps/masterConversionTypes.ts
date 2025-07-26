export type MasterConversionTableType = Partial<{
  id: number
  product_id: string
  product_name: string
  from_unit: string
  to_unit: string
  multiplier: string
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
}

export type MasterConversionStore = {
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
  fetchMasterConversion: (id: any) => Promise<void>
  updateMasterConversion: (data: any, id: string) => Promise<boolean>
}
