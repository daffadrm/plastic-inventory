export type DashboardStore = {
  dataList: any
  isLoading: boolean
  isError: boolean
  fetchDashboard: () => Promise<void>
}
