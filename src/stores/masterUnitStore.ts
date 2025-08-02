import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { MasterUnitStore, QueryParams } from '@/types/apps/masterUnitTypes'
import {
  createMasterUnits,
  deleteMasterUnits,
  getMasterUnitList,
  getSearchMasterUnit,
  updateMasterUnits
} from '@/app/server/master/unit'

export const useMasterUnitsStore = create<MasterUnitStore>((set, get) => ({
  isLoading: false,
  isError: false,
  dataList: null,
  isLoadingUpdate: false,
  dataOptionUnit: null,

  page: 1,
  limit: 10,
  search: '',
  order_column: 'username',
  order_direction: 'asc',
  total_data: 0,

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

      set({ dataList: response?.data || null, total_data: response?.meta?.total || 0 })
    } catch (err: any) {
      set({ isError: true, dataList: null, total_data: 0 })
      set({ dataList: null })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  updateMasterUnit: async (id: string, data: any) => {
    const { fetchMasterUnit } = get()

    set({ isLoadingUpdate: true })

    try {
      let response

      if (id) {
        response = await updateMasterUnits(id, data)
      } else {
        response = await createMasterUnits(data)
      }

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'perbarui berhasil', 'success')
      await fetchMasterUnit()

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'perbarui gagal', 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  },

  deleteMasterUnit: async (id: string) => {
    const { fetchMasterUnit } = get()

    set({ isLoadingUpdate: true })

    try {
      const response = await deleteMasterUnits(id)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'hapus berhasil', 'success')
      await fetchMasterUnit()

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'hapus gagal', 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  },
  fetchOptionUnit: async () => {
    try {
      const response = await getSearchMasterUnit()

      set({ dataOptionUnit: response?.data || null })
    } catch (err: any) {
      set({ isError: true, dataOptionUnit: null })
      useSnackbarStore.getState().showSnackbar(err?.message || 'hapus gagal', 'error')
    } finally {
      set({ isLoadingUpdate: false })
    }
  }
}))
