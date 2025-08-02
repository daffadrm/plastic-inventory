/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { type ChangeEvent, useState, useMemo, useEffect, useCallback, useRef } from 'react'

import { Button, Card, IconButton, InputAdornment, CircularProgress } from '@mui/material'

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

import moment from 'moment'

import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import styles from './styles.module.css'
import CustomTextField from '@/@core/components/mui/TextField'

import ModalConfirmationComponent from '@/components/modal/confirmation/ModalConfirmation'
import useDebounce from '@/@core/hooks/usedebounce'
import type { MasterConversionTableType } from '@/types/apps/masterConversionTypes'
import { useMasterConversionStore } from '@/stores/masterConversionStore'
import AddEditConversion from '@/components/modal/master/conversion/AddEditConversion'
import { useMasterUnitsStore } from '@/stores/masterUnitStore'
import { useMasterProductStore } from '@/stores/masterProductStore'

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
const columnHelper = createColumnHelper<MasterConversionTableType>()

export const MasterConversionOverview = () => {
  const isFirstRender = useRef(true)
  const [rowSelection, setRowSelection] = useState({})
  const [conversionState, setConversionState] = useState<MasterConversionTableType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedConversion, setSelectedConversion] = useState<any>(null)
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<any>()
  const [searchValue, setSearchValue] = useState<string>('')

  const {
    dataList,
    isLoading,
    fetchMasterConversion,
    setQueryParams,
    order_direction,
    limit,
    page,
    order_column,
    search,
    deleteMasterConversion
  } = useMasterConversionStore()

  const { fetchOptionUnit, dataOptionUnit } = useMasterUnitsStore()
  const { fetchOptionProduct, dataOptionProduct } = useMasterProductStore()

  const handleAddConversion = () => {
    setSelectedConversion(null) // Reset data pengguna
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleEditAssetGroup = (conversion: any) => {
    setSelectedConversion(conversion)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setSearchValue(event?.target?.value)
    }
  }

  const handleIconSearch = () => {
    setSearchValue(searchValue)
  }

  const handleConfirmationModal = useCallback((userParam: any | null) => {
    setIsOpenConfirmationModalState(true)
    setSelectedId(userParam)
  }, [])

  const handleDeleteConversion = useCallback(() => {
    try {
      deleteMasterConversion(selectedId?.id)
      setIsOpenConfirmationModalState(false)
    } catch (err: any) {
      console.error(err)
    }
  }, [deleteMasterConversion, selectedId])

  const debouncedSearchTerm = useDebounce(searchValue, 500)

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event?.target?.value)
  }, [])

  useEffect(() => {
    fetchMasterConversion()
  }, [limit, page, order_column, order_direction, search])

  useEffect(() => {
    if (dataList) {
      setConversionState(dataList)
    } else {
      setConversionState([])
    }
  }, [dataList])

  useEffect(() => {
    fetchOptionUnit()
    fetchOptionProduct()
  }, [])

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

  const columns = useMemo<ColumnDef<MasterConversionTableType, any>[]>(
    () => [
      {
        id: 'action',
        header: () => <div className='text-center'>Aksi</div>,
        cell: ({ row }) => (
          <div className='flex flex-row gap-1 justify-center'>
            <Button
              type='button'
              className='w-fit min-w-[16px] px-2 items-center'
              onClick={() => handleEditAssetGroup(row.original)}
            >
              <i className={'tabler-edit text-[16px]'} />
            </Button>

            <Button
              type='button'
              className='w-fit min-w-[16px] px-2 items-center'
              onClick={() => handleConfirmationModal(row.original)}
            >
              <i className={'tabler-trash text-[16px]'} />
            </Button>
          </div>
        )
      },
      columnHelper.accessor('product_name', {
        header: 'Nama Produk',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.product_name || '-'}`}</Typography>
      }),
      columnHelper.accessor('from_unit_symbol', {
        header: 'Dari unit',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.from_unit_symbol || '-'}`}</Typography>
      }),
      columnHelper.accessor('to_unit_symbol', {
        header: 'Ke unit',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.to_unit_symbol || '-'}`}</Typography>
      }),
      columnHelper.accessor('conversion_value', {
        header: 'Pengkali',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.conversion_value || '-'}`}</Typography>
      }),
      columnHelper.accessor('updated_at', {
        header: 'Diperbarui pada',
        cell: ({ row }) => (
          <Typography className='text-xs'>
            {row?.original?.updated_at ? moment.utc(row.original.updated_at).local().format('DD/MM/YYYY, HH:mm') : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('created_at', {
        header: 'Dibuat pada',
        cell: ({ row }) => (
          <Typography className='text-xs'>
            {row?.original?.created_at ? moment.utc(row.original.created_at).local().format('DD/MM/YYYY, HH:mm') : '-'}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: conversionState as MasterConversionTableType[],
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
              <Button
                startIcon={<i className={'tabler-plus text-[18px]'} />}
                variant='contained'
                onClick={handleAddConversion}
                className='ml-auto text-nowrap items-center gap-0 rounded-md xl:text-sm lg:text-xs md:text-[14px] sm:text-[11px] mb-2 py-1'
              >
                Konversi
              </Button>
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
      <AddEditConversion
        open={isDialogOpen}
        isEditMode={isEditMode}
        conversionDetailData={selectedConversion}
        onCancel={handleCloseDialog}
        dataOptionUnit={dataOptionUnit}
        dataOptionProduct={dataOptionProduct}
      />

      <ModalConfirmationComponent
        isOpen={isOpenConfirmationModalState}
        toggle={() => handleConfirmationModal(selectedId)}
        title='Hapus Konversi'
        warning={
          <>
            Aksi ini akan menghapus <strong>{selectedId?.product_name}</strong>. Apakah anda yakin?
          </>
        }
        icon='tabler-trash'
        actionText='Hapus'
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={selectedId}
        handleRequest={handleDeleteConversion}
      />
    </Card>
  )
}
