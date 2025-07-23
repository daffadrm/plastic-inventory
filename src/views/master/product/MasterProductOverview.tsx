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

import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import styles from './styles.module.css'
import CustomTextField from '@/@core/components/mui/TextField'

import CustomSnackbar from '@/components/snackbar/CustomSnackbar'
import ModalConfirmationComponent from '@/components/modal/confirmation/ModalConfirmation'
import useDebounce from '@/@core/hooks/usedebounce'
import type { MasterProductTableType } from '@/types/apps/masterProuctTypes'
import { useMasterProductStore } from '@/stores/masterProductStore'
import AddEditProduct from '@/components/modal/master/product/AddEditProduct'

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
const columnHelper = createColumnHelper<MasterProductTableType>()

export const MasterProductOverview = () => {
  const isFirstRender = useRef(true)
  const [rowSelection, setRowSelection] = useState({})
  const [productState, setProductState] = useState<MasterProductTableType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<any>()
  const [searchValue, setSearchValue] = useState<string>('')

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const {
    dataList,
    isLoading,
    fetchMasterProduct,
    setQueryParams,
    order_direction,
    limit,
    page,
    order_column,
    search
  } = useMasterProductStore()

  console.log(dataList, 'dataList')

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleSnackbar = useCallback(
    (severity: 'success' | 'error', message: string) => {
      setSnackbarSeverity(severity)
      setSnackbarMessage(message)
      setOpenSnackbar(true)
    },
    [setOpenSnackbar, setSnackbarMessage, setSnackbarSeverity]
  )

  const handleAddProduct = () => {
    setSelectedProduct(null) // Reset data pengguna
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (assetGroup: any) => {
    setSelectedProduct(assetGroup)
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

  const handleDeleteProduct = useCallback(() => {
    try {
      handleSnackbar('success', 'Success Delete Asset Group')

      setIsOpenConfirmationModalState(false)
    } catch (err: any) {
      handleSnackbar('error', 'Error')
      console.error(err)
    }
  }, [])

  const debouncedSearchTerm = useDebounce(searchValue, 500)

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event?.target?.value)
  }, [])

  // useEffect(() => {
  //   fetchDataAssetGroup()
  // }, [paramState])

  useEffect(() => {
    fetchMasterProduct({ limit, page, order_column, order_direction })
  }, [limit, page, order_column, order_direction, search])

  useEffect(() => {
    if (dataList) {
      setProductState(dataList)
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

  const columns = useMemo<ColumnDef<MasterProductTableType, any>[]>(
    () => [
      {
        id: 'action',
        header: () => <div className='text-center'>Aksi</div>,
        cell: ({ row }) => (
          <div className='flex flex-row gap-1 justify-center'>
            <Button
              type='button'
              className='w-fit min-w-[16px] px-2 items-center'
              onClick={() => handleEditProduct(row.original)}
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
      columnHelper.accessor('name', {
        header: 'Nama',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.name || '-'}`}</Typography>
      }),
      columnHelper.accessor('category', {
        header: 'Kategori',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.category || '-'}`}</Typography>
      }),
      columnHelper.accessor('satuan', {
        header: 'Satuan',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.satuan || '-'}`}</Typography>
      }),
      columnHelper.accessor('stock', {
        header: 'Stok',
        cell: ({ row }) => (
          <Typography className='text-xs text-right'>{`${row.original.stock?.toLocaleString() || '-'}`}</Typography>
        )
      }),
      columnHelper.accessor('selling_price', {
        header: 'Harga Jual',
        cell: ({ row }) => (
          <Typography className='text-xs text-right'>{`Rp. ${row.original.selling_price?.toLocaleString() || '-'}`}</Typography>
        )
      }),
      columnHelper.accessor('purchase_price', {
        header: 'Harga Beli',
        cell: ({ row }) => (
          <Typography className='text-xs text-right'>{`RP. ${row.original.purchase_price?.toLocaleString() || '-'}`}</Typography>
        )
      }),
      columnHelper.accessor('min_stock', {
        header: 'Min Stok',
        cell: ({ row }) => (
          <Typography className='text-xs text-right'>{`${row.original.min_stock?.toLocaleString() || '-'}`}</Typography>
        )
      }),
      columnHelper.accessor('supplier', {
        header: 'Supplier',
        cell: ({ row }) => <Typography className='text-xs'>{`${row.original.supplier || '-'}`}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: productState as MasterProductTableType[],
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
                onClick={handleAddProduct}
                className='ml-auto text-nowrap items-center gap-0 rounded-md xl:text-sm lg:text-xs md:text-[14px] sm:text-[11px] mb-2 py-1'
              >
                Produk
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
      <AddEditProduct
        open={isDialogOpen}
        isEditMode={isEditMode}
        productDetailData={selectedProduct}
        onCancel={handleCloseDialog}
      />
      <CustomSnackbar
        openSnackbar={openSnackbar}
        snackbarSeverity={snackbarSeverity}
        snackbarMessage={snackbarMessage}
        handleCloseSnackbar={handleCloseSnackbar}
      />
      <ModalConfirmationComponent
        isOpen={isOpenConfirmationModalState}
        toggle={() => handleConfirmationModal(selectedId)}
        title='Hapus Produk'
        warning={
          <>
            Aksi ini akan menghapus <strong>{selectedId?.name}</strong>. Apakah anda yakin?
          </>
        }
        icon='tabler-trash'
        actionText='Hapus'
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={selectedId}
        handleRequest={handleDeleteProduct}
      />
    </Card>
  )
}
