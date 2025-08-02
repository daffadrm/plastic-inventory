export type MasterConversionTableType = Partial<{
  id: number
  product_id: number
  product_name: string
  from_unit_id: number
  from_unit_name: string
  from_unit_symbol: string
  to_unit_id: number
  to_unit_name: string
  to_unit_symbol: string
  conversion_value: number
  created_at: string
  updated_at: string
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
  total_data: number

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchMasterConversion: () => Promise<void>
  updateMasterConversion: (id: string, data: any) => Promise<boolean>
  deleteMasterConversion: (id: string) => Promise<boolean>
}
