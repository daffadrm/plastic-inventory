export type MasterUserTableType = Partial<{
  user_id: number
  username: string
  fullname: string
  email: string
  phone_number: string
  role: 'Admin' | 'Operator' | 'User' // enum-like
  status: 'Active' | 'Inactive' | 'Suspended'
  profile_picture: string | null
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}>

export type QueryParams = {
  page: number
  limit: number
  search: string
  order_column: string
  order_direction: 'asc' | 'desc'
}

export type MasterUserStore = {
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
  fetchMasterUser: (id: any) => Promise<void>
  updateMasterUser: (data: any, id: string) => Promise<boolean>
  deleteMasterUser: (id: string) => Promise<boolean>
}
