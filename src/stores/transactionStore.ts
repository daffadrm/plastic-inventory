import { create } from 'zustand'

import { useSnackbarStore } from './snackbarStore'

import type { QueryParams, TransactionStore } from '@/types/apps/transactionTypes'
import { getTransactionList } from '@/app/server/transaction/indesx'

export const useTransactionStore = create<TransactionStore>((set, get) => ({
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
      order_direction: overrideParams?.order_direction ?? order_direction
    }

    try {
      const response = await getTransactionList(finalParams)

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
