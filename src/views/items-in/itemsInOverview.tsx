'use client'

import { useEffect, useRef, useState } from 'react'

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
import { useSnackbarStore } from '@/stores/snackbarStore'

type Unit = {
  id: number
  name: string
}

type Conversion = {
  from_unit: Unit
  to_unit: Unit
  multiplier: number
}

type Product = {
  id: number
  name: string
  description: string
  url_image: string
  price: number
  stock: number
  base_unit: Unit
  conversions: Conversion[]
}

type OrderItem = {
  product: Product
  quantity: number
  unit: string
  conversion: {
    unit: string
    multiplier: number
  }
}

export default function ItemsInOverview() {
  const autocompleteRef = useRef<any>(null)
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [inputValue, setInputValue] = useState('')

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
      prev.map((item, i) => {
        if (i !== index) return item

        const newQty = item.quantity + 1

        return { ...item, quantity: newQty }
      })
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

    const defaultUnit = product.base_unit.name

    // Biasanya base unit tidak punya entry konversi dari dirinya sendiri
    const defaultConversion = {
      unit: defaultUnit,
      multiplier: 1
    }

    if (index !== -1) {
      setOrders(prev => prev.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setOrders(prev => [
        ...prev,
        {
          product,
          quantity: 1,
          unit: defaultUnit,
          conversion: defaultConversion
        }
      ])
    }
  }

  const handleSaveOrder = () => {
    if (orders.length === 0) {
      useSnackbarStore.getState().showSnackbar('Tidak ada transaksi!', 'error')

      return
    }

    const payload = orders.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity * (item.conversion?.multiplier || 1)
    }))

    console.log('Saving order:', payload)

    setOrders([])

    // Misal: panggil API di sini
    // await axios.post('/api/orders', { orders: payload })

    useSnackbarStore.getState().showSnackbar('Barang berhasil ditambahkan!', 'success')
  }

  return (
    <Card className='p-4'>
      <div className='flex flex-row gap-2'>
        <Typography variant='h6' gutterBottom width={'100px'}>
          List Barang Masuk
        </Typography>
        <CustomAutocomplete
          fullWidth
          ref={autocompleteRef}
          options={products}
          value={selectedProduct}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue)
          }}
          getOptionLabel={option => option.name}
          onChange={(_, value) => {
            if (value) {
              addProductToOrder(value)
              setSelectedProduct(null)
              setInputValue('')
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
              <TableCell>Satuan</TableCell>
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
                    <CustomTextField
                      type='number'
                      size='small'
                      value={order.quantity}
                      inputProps={{ min: 1 }}
                      onChange={e => {
                        const value = parseInt(e.target.value, 10)

                        if (!isNaN(value) && value >= 1) {
                          setOrders(prev =>
                            prev.map((item, i) => {
                              if (i !== index) return item

                              return { ...item, quantity: value }
                            })
                          )
                        }
                      }}
                      sx={{ width: 100, mx: 1 }}
                    />
                    <Button size='small' variant='outlined' onClick={() => increment(index)}>
                      +
                    </Button>
                  </Stack>
                </TableCell>
                <TableCell>
                  <CustomAutocomplete
                    size='small'
                    options={[
                      { unit: order.product.base_unit.name, multiplier: 1 }, // base unit
                      ...order.product.conversions.map(conv => ({
                        unit: conv.from_unit.name,
                        multiplier: conv.multiplier
                      }))
                    ]}
                    getOptionLabel={option => option.unit}
                    value={order.conversion}
                    onChange={(_, value) => {
                      if (value) {
                        setOrders(prev =>
                          prev.map((item, i) => (i === index ? { ...item, unit: value.unit, conversion: value } : item))
                        )
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option.unit === value.unit}
                    renderInput={params => <CustomTextField {...params} placeholder='Satuan' size='small' />}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>Rp {order.product.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  Rp {(order.quantity * order.conversion.multiplier * order.product.price).toLocaleString('id-ID')}
                </TableCell>{' '}
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
          Simpan
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
