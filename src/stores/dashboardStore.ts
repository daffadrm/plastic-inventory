import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { DashboardStore } from '@/types/apps/dashboardTypes'
import { getDashboard } from '@/app/server/dashboard'

export const useDashboardStore = create<DashboardStore>(set => ({
  isLoading: false,
  isError: false,
  dataList: null,
  fetchDashboard: async () => {
    set({ isLoading: true, isError: false })

    try {
      const response = await getDashboard()

      set({ dataList: response?.data || null })
    } catch (err: any) {
      set({ isError: true })
      set({ dataList: null })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  }
}))
