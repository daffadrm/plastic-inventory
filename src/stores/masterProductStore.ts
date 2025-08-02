import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { MasterProductStore, QueryParams } from '@/types/apps/masterProductTypes'
import {
  createMasterProduct,
  deleteMasterProduct,
  getMasterProductList,
  getSearchMasterProduct,
  updateMasterProduct
} from '@/app/server/master/product'

export const useMasterProductStore = create<MasterProductStore>((set, get) => ({
  isLoading: false,
  isError: false,
  dataList: null,
  dataOptionProduct: null,
  isLoadingUpdate: false,

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

  fetchMasterProduct: async (
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
      const response = await getMasterProductList(finalParams)

      set({ dataList: response?.data || null, total_data: response?.meta?.total || 0 })
    } catch (err: any) {
      console.log(err, 'err')
      set({ isError: true, dataList: null, total_data: 0 })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  updateMasterProduct: async (id: string, data: any) => {
    const { fetchMasterProduct } = get()

    set({ isLoadingUpdate: true })

    try {
      let response

      if (id) {
        response = await updateMasterProduct(id, data)
      } else {
        response = await createMasterProduct(data)
      }

      useSnackbarStore
        .getState()
        .showSnackbar(response?.meta?.message || `${id ? 'Update' : 'Tambah'} Produk Berhasil`, 'success')
      await fetchMasterProduct()

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || `${id ? 'Update' : 'Tambah'} Produk Gagal`, 'error')

      return false
    } finally {
      set({ isLoadingUpdate: false })
    }
  },
  deleteMasterProduct: async (id: string) => {
    const { fetchMasterProduct } = get()

    try {
      const response = await deleteMasterProduct(id)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'hapus berhasil', 'success')
      await fetchMasterProduct()

      return true
    } catch (err: any) {
      set({ isError: true })
      useSnackbarStore.getState().showSnackbar(err?.message || 'hapus gagal', 'error')

      return false
    }
  },
  fetchOptionProduct: async () => {
    try {
      const response = await getSearchMasterProduct()

      set({ dataOptionProduct: response?.data || null })
    } catch (err: any) {
      set({ isError: true, dataOptionProduct: null })
      useSnackbarStore.getState().showSnackbar(err?.message || 'hapus gagal', 'error')
    } finally {
      set({ isLoadingUpdate: false })
    }
  }
}))
