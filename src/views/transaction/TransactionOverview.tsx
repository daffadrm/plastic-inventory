/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { type ChangeEvent, useState, useMemo, useEffect, useCallback, useRef } from 'react'

import { Card, IconButton, InputAdornment, CircularProgress } from '@mui/material'

import TablePagination from '@mui/material/TablePagination'

import Typography from '@mui/material/Typography'

// third party import

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import styles from './styles.module.css'
import CustomTextField from '@/@core/components/mui/TextField'

import useDebounce from '@/@core/hooks/usedebounce'
import type { TransactionTableType } from '@/types/apps/transactionTypes'
import { useTransactionStore } from '@/stores/transactionStore'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper<TransactionTableType>()

export const TransactionOverview = () => {
  const isFirstRender = useRef(true)
  const [rowSelection, setRowSelection] = useState({})
  const [transactionState, setTransactionState] = useState<TransactionTableType[]>([])

  const [searchValue, setSearchValue] = useState<string>('')

  const { dataList, isLoading, fetchTransaction, setQueryParams, order_direction, limit, page, order_column, search } =
    useTransactionStore()

  console.log(dataList, 'dataList')

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setSearchValue(event?.target?.value)
    }
  }

  const handleIconSearch = () => {
    setSearchValue(searchValue)
  }

  const debouncedSearchTerm = useDebounce(searchValue, 500)

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event?.target?.value)
  }, [])

  useEffect(() => {
    fetchTransaction({ limit, page, order_column, order_direction })
  }, [limit, page, order_column, order_direction, search])

  useEffect(() => {
    if (dataList) {
      setTransactionState(dataList)
    }
  }, [dataList])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    // setParamState(prev => ({
    //   ...prev,
    //   page: 1,
    //   search: debouncedSearchTerm
    // }))

    setQueryParams({ search: debouncedSearchTerm, page: 1 })

    table.setPageIndex(0)
  }, [debouncedSearchTerm])

  const columns = useMemo<ColumnDef<TransactionTableType, any>[]>(
    () => [
      columnHelper.accessor('number_transaction', {
        header: 'Nomor Transaksi',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.number_transaction || '-'}`}</Typography>
      }),
      columnHelper.accessor('name_product', {
        header: 'Nama Produk',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.name_product || '-'}`}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'quantity',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.quantity || '-'}`}</Typography>
      }),
      columnHelper.accessor('unit', {
        header: 'Unit',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.unit || '-'}`}</Typography>
      }),
      columnHelper.accessor('type', {
        header: 'Tipe',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.type || '-'}`}</Typography>
      }),
      columnHelper.accessor('created_by', {
        header: 'Dibuat oleh',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.created_by || '-'}`}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Dibuat pada',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.created_at || '-'}`}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: transactionState as TransactionTableType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: limit
      }
    },
    manualPagination: true,
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card className='pb-1'>
      {/* <CardHeader title='List Data' className='pt-[10px] pb-[10px] pl-[24px] pr-[24px] ' /> */}
      <div className='overflow-x-auto mt-2'>
        <div className='flex flex-row gap-2'>
          {/* Table */}
          <Card className='is-full overflow-x-hidden customScrollbar'>
            <div className='flex flex-row items-end gap-2 px-2'>
              <div className='max-w-[300px]'>
                <CustomTextField
                  fullWidth
                  maxRows={2}
                  placeholder='Search...'
                  id='outlined-adornment-search'
                  type='text'
                  onKeyDown={handleKeyDown}
                  onChange={handleSearch}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={handleIconSearch}>
                          <i className={'tabler-search'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiInputBase-root': { height: '34px' } // Mengatur tinggi input field
                  }}

                  // label='Search'
                />
              </div>
            </div>
            <div
              className='is-full h-screen overflow-x-scroll overflow-y-scroll customScrollbar'
              style={{ maxHeight: 'calc(100vh - 211px)' }}
            >
              <table className={`${classnames(tableStyles.table, styles?.customTableInternal)}`}>
                <thead className='p-1'>
                  {table?.getHeaderGroups()?.map(headerGroup => (
                    <tr key={headerGroup?.id}>
                      {headerGroup?.headers?.map(header => (
                        <th key={header.id} className='bg-white top-0 z-20 sticky'>
                          {header?.isPlaceholder ? null : (
                            <>
                              <div
                                className={classnames({
                                  'flex items-center text-xs': header?.column.getIsSorted(),
                                  'cursor-pointer select-none text-xs': header?.column.getCanSort()
                                })}
                                onClick={() => {
                                  if (header.column.getCanSort()) {
                                    // setParamState(prev => ({
                                    //   ...prev,
                                    //   order_column: header.column.id,
                                    //   order_direction: prev.order_direction === 'asc' ? 'desc' : 'asc'
                                    // }))

                                    setQueryParams({
                                      order_column: header.column.id,
                                      order_direction: order_direction === 'asc' ? 'desc' : 'asc'
                                    })
                                  }
                                }}
                              >
                                {flexRender(header?.column?.columnDef.header, header.getContext())}
                                {order_column === header.column.id &&
                                  ({
                                    asc: <i className='tabler-chevron-up text-xs' />,
                                    desc: <i className='tabler-chevron-down text-xs' />
                                  }[order_direction as 'asc' | 'desc'] ??
                                    null)}
                              </div>
                            </>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                        <CircularProgress color='primary' />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {table.getFilteredRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={table?.getVisibleFlatColumns()?.length} className='text-center'>
                          No data available
                        </td>
                      </tr>
                    ) : (
                      table
                        ?.getRowModel()
                        ?.rows?.slice(0, table?.getState()?.pagination?.pageSize)
                        ?.map(row => {
                          return (
                            <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                              {row?.getVisibleCells()?.map(cell => (
                                <td key={cell?.id} className='h-[36px]'>
                                  {flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}
                                </td>
                              ))}
                            </tr>
                          )
                        })
                    )}
                  </tbody>
                )}
              </table>
            </div>
            <TablePagination
              component={() => <TablePaginationComponent table={table as any} />}
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, page) => {
                table.setPageIndex(page)
              }}
            />
          </Card>
        </div>
      </div>
    </Card>
  )
}
