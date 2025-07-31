export type MasterUnitTableType = Partial<{
  id: number
  unit_name: string
  unit_symbol: string
  unit_type: string
  description: string
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

export type MasterUnitStore = {
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
  fetchMasterUnit: () => Promise<void>
  updateMasterUnit: (data: any, id: string) => Promise<boolean>
  deleteMasterUnit: (id: string) => Promise<boolean>
}
