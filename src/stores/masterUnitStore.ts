import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { MasterUnitStore, QueryParams } from '@/types/apps/masterUnitTypes'
import { getMasterUnitList, updateMasterUnit } from '@/app/server/master/unit'

export const useMasterUnitsStore = create<MasterUnitStore>((set, get) => ({
  isLoading: false,
  isError: false,
  dataList: null,
  isLoadingUpdate: false,

  page: 1,
  limit: 10,
  search: '',
  order_column: 'username',
  order_direction: 'asc',

  setQueryParams: (params: Partial<QueryParams>) =>
    set(state => ({
      ...state,
      ...params
    })),

  fetchMasterUnit: async (
    overrideParams?: Partial<{
      page: number
      limit: number
      search: string
      order_column: any
      order_direction: string
    }>
  ) => {
    const { page, limit, search, order_column, order_direction } = get()

    set({ isLoading: true, isError: false })

    const finalParams = {
      page: overrideParams?.page ?? page,
      limit: overrideParams?.limit ?? limit,
      search: overrideParams?.search ?? search,
      order_column: overrideParams?.order_column ?? order_column,
      order_direction: overrideParams?.order_direction ?? order_direction
    }

    try {
      const response = await getMasterUnitList(finalParams)

      set({ dataList: response?.data || null })
    } catch (err: any) {
      set({ isError: true })
      set({ dataList: null })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  updateMasterUnit: async (data: any, id: string) => {
    const { fetchMasterUnit } = get()

    set({ isLoadingUpdate: true })

    try {
      const response = await updateMasterUnit(data, id)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'update berhasil', 'success')
      await fetchMasterUnit({ land_id: id })

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'update gagal', 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  }
}))
