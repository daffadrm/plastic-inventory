'use client'

import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import moment from 'moment'

interface dataTableType {
  date: string
  product_name: string
  product_description: string
  quantity: number
  unit_symbol: string
  price: string
}
interface TransactionTableProps {
  dataTable: dataTableType[]
}

export default function TransactionTable({ dataTable }: TransactionTableProps) {
  return (
    <div className='pb-4 h-full'>
      <TableContainer className='h-full overflow-y-auto'>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Tanggal</TableCell>
              <TableCell>Produk</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Harga</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable?.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className='text-xs'>
                    {order.date ? moment.utc(order.date).local().format('DD/MM/YYYY, HH:mm') : '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Box>
                      <div className='font-bold tex-xs'>{order.product_name}</div>
                      <div className='text-xs' color='text.secondary'>
                        {order.product_description}
                      </div>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <div className='text-xs'> {order.quantity || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className='text-xs'>{order.unit_symbol || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className='text-xs'>Rp {order.price.toLocaleString()}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
