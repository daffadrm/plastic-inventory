// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

const TablePaginationComponent = ({
  table,
  totalData,
  isManualPagination,
  setParamState
}: {
  table: ReturnType<typeof useReactTable>
  totalData?: number
  isManualPagination?: boolean //
  setParamState?: React.Dispatch<React.SetStateAction<any>>
}) => {
  const displayTotalData = isManualPagination && totalData ? totalData : table.getFilteredRowModel().rows.length

  const handlePageChange = (_: any, page: number) => {
    if (isManualPagination && setParamState) {
      setParamState({
        page: page
      })

      table.setPageIndex(page - 1)
    } else {
      table.setPageIndex(page - 1)
    }
  }

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Menampilkan ${
          table.getFilteredRowModel().rows.length === 0
            ? 0
            : (table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1).toLocaleString()
        }
          sampai ${Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            displayTotalData
          ).toLocaleString()} dari total ${displayTotalData.toLocaleString()} data`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(displayTotalData / table.getState().pagination.pageSize)}
        page={table.getState().pagination.pageIndex + 1}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
