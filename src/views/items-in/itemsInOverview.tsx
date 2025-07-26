'use client'

import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card
} from '@mui/material'

import { dummyProducts } from './product'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'

type Product = {
  id: number
  name: string
  description: string
  url_image: string
  price: number
  stock: number
}

type OrderItem = {
  product: Product
  quantity: number
}

export default function ItemsInOverview() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null)

  //   const token = 'your_token_here'

  useEffect(() => {
    //   axios
    //     .get('https://api.example.com/products', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     })
    //     .then(res => setProducts(res.data))

    setProducts(dummyProducts)
  }, [])

  const increment = (index: number) => {
    setOrders(prev =>
      prev.map((item, i) =>
        i === index && item.quantity < item.product.stock ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrement = (index: number) => {
    const item = orders[index]

    if (item.quantity === 1) {
      setConfirmDeleteIndex(index)

      return
    }

    setOrders(prev => prev.map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item)))
  }

  const deleteOrder = () => {
    if (confirmDeleteIndex === null) return
    setOrders(prev => prev.filter((_, i) => i !== confirmDeleteIndex))
    setConfirmDeleteIndex(null)
  }

  const totalPrice = orders.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  const addProductToOrder = (product: Product) => {
    const index = orders.findIndex(o => o.product.id === product.id)

    if (index !== -1) {
      setOrders(prev =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                quantity: item.quantity < product.stock ? item.quantity + 1 : item.quantity
              }
            : item
        )
      )
    } else {
      setOrders(prev => [...prev, { product, quantity: 1 }])
    }
  }

  const handleSaveOrder = () => {
    if (orders.length === 0) {
      alert('Order is empty.')

      return
    }

    const payload = orders.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }))

    console.log('Saving order:', payload)

    // Misal: panggil API di sini
    // await axios.post('/api/orders', { orders: payload })

    alert('Order saved successfully!')
  }

  return (
    <Card className='p-4'>
      <div className='flex flex-row gap-2'>
        <Typography variant='h6' gutterBottom width={'100px'}>
          List Barang Masuk
        </Typography>
        <CustomAutocomplete
          fullWidth
          options={products}
          getOptionLabel={option => option.name}
          onChange={(_, value) => {
            if (value) {
              addProductToOrder(value)
            }
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => <CustomTextField {...params} label='Search Product' fullWidth />}
        />
      </div>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Produk</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Harga Unit</TableCell>
              <TableCell>Total Harga</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.product.id}>
                <TableCell size='small'>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <img
                      src={order.product.url_image}
                      alt={order.product.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: 4, objectFit: 'cover' }}
                    />
                    <Box>
                      <Typography fontWeight='bold'>{order.product.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {order.product.description}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Button size='small' variant='outlined' onClick={() => decrement(index)}>
                      -
                    </Button>
                    <Typography>{order.quantity}</Typography>
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => increment(index)}
                      disabled={order.quantity >= order.product.stock}
                    >
                      +
                    </Button>
                  </Stack>
                </TableCell>
                <TableCell>Rp {order.product.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>Rp {(order.quantity * order.product.price).toLocaleString('id-ID')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3} display='flex' justifyContent='flex-end' gap={2} alignItems='right'>
        <Typography variant='h6' textAlign={'end'} alignSelf={'center'}>
          Total: Rp {totalPrice.toLocaleString('id-ID')}
        </Typography>
        <Button variant='contained' color='primary' onClick={handleSaveOrder}>
          Save Order
        </Button>
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>Hapus Barang</DialogTitle>
        <DialogContent>
          Apakah anda yakin dengan menghapus barang{' '}
          {confirmDeleteIndex !== null && orders[confirmDeleteIndex].product.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)}>Batal</Button>
          <Button color='error' onClick={deleteOrder}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
