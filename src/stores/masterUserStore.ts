import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'
import { createMasterUser, deleteMasterUser, getMasterUserList, updateMasterUser } from '@/app/server/master/user'
import type { MasterUserStore, QueryParams } from '@/types/apps/masterUserTypes'

export const useMasterUserStore = create<MasterUserStore>((set, get) => ({
  isLoading: false,
  isError: false,
  dataList: null,
  isLoadingUpdate: false,

  page: 1,
  limit: 30,
  search: '',
  order_column: 'username',
  order_direction: 'asc',
  total_data: 0,

  //   setQueryParams: (
  //     params: Partial<{ page: number; limit: number; search: string; order_column: any; order_direction: string }>
  //   ) => {
  //     set(params) // update page, limit, atau search sesuai yang dikirim
  //   },

  setQueryParams: (params: Partial<QueryParams>) =>
    set(state => ({
      ...state,
      ...params
    })),

  fetchMasterUser: async (
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
      const response = await getMasterUserList(finalParams)

      set({ dataList: response?.data || null, total_data: response?.meta?.total || 0 })
    } catch (err: any) {
      set({ isError: true })
      set({ dataList: null })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  updateMasterUser: async (id: string, data: any) => {
    const { fetchMasterUser } = get()

    set({ isLoadingUpdate: true })

    try {
      let response

      if (id) {
        response = await updateMasterUser(id, data)
      } else {
        response = await createMasterUser(data)
      }

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'perbarui berhasil', 'success')
      await fetchMasterUser({ land_id: id })

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'perbarui gagal', 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  },

  deleteMasterUser: async (id: string) => {
    const { fetchMasterUser } = get()

    set({ isLoadingUpdate: true })

    try {
      const response = await deleteMasterUser(id)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'hapus berhasil', 'success')
      await fetchMasterUser({ land_id: id })

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'hapus gagal', 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  }
}))
