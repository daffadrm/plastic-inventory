'use client'

import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

interface dataTableType {
  date: string
  product_name: string
  product_description: string
  quantity: number
  unit: string
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
                  <div className='text-xs'>{order.date}</div>
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
                  <div className='text-xs'> {order.quantity}</div>
                </TableCell>
                <TableCell>
                  <div className='text-xs'>{order.unit}</div>
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
