export type MasterCategoryTableType = Partial<{
  id: number
  name: string
  description: string
  status: 'Active' | 'Inactive'
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
}

export type MasterCategoryStore = {
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
  fetchMasterCategory: (id: any) => Promise<void>
  updateMasterCategory: (data: any, id: string) => Promise<boolean>
}
