export type MasterCategoryTableType = Partial<{
  id: number
  category_name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
  total_data: number
}

export type MasterCategoryStore = {
  dataList: any
  isLoading: boolean
  isError: boolean
  isLoadingUpdate: boolean
  dataOptionCategory: any

  page: number
  limit: number
  search: string
  order_column: string
  order_direction: string
  total_data: number

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchMasterCategory: () => Promise<void>
  updateMasterCategory: (data: any, id: string) => Promise<boolean>
  deleteMasterCategory: (id: string) => Promise<boolean>
  fetchOptionCategory: () => Promise<void>
}
