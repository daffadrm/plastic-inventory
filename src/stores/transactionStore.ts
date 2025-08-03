import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { QueryParams, TransactionStore } from '@/types/apps/transactionTypes'
import { createTransaction, getTransactionList } from '@/app/server/transaction/indesx'

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  isLoading: false,
  isError: false,
  dataList: null,
  isLoadingUpdate: false,

  page: 1,
  limit: 30,
  search: '',
  order_column: 'created_at',
  order_direction: 'asc',
  total_data: 0,

  setQueryParams: (params: Partial<QueryParams>) =>
    set(state => ({
      ...state,
      ...params
    })),

  fetchTransaction: async (
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
      order_direction: overrideParams?.order_direction ?? order_direction,
      type: 'all'
    }

    try {
      const response = await getTransactionList(finalParams)

      set({ dataList: response?.data || null, total_data: response?.meta?.total || 0 })
    } catch (err: any) {
      set({ isError: true, dataList: null, total_data: 0 })

      useSnackbarStore.getState().showSnackbar(err?.message || 'Something went wrong', 'error')
    } finally {
      set({ isLoading: false })
    }
  },
  createTransaction: async (data: string) => {
    set({ isLoadingUpdate: true })

    try {
      const response = await createTransaction(data)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'update berhasil', 'success')

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
