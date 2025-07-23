export type MasterUnitTableType = Partial<{
  id: number
  name: string
  simbol: string
  type: string
  description: string
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

  setQueryParams: (params: Partial<QueryParams>) => void
  fetchMasterUnit: (id: any) => Promise<void>
  updateMasterUnit: (data: any, id: string) => Promise<boolean>
}
