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

// import { dummyProducts } from './product'
import { LoadingButton } from '@mui/lab'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { useSnackbarStore } from '@/stores/snackbarStore'
import { useMasterProductStore } from '@/stores/masterProductStore'
import { useTransactionStore } from '@/stores/transactionStore'

type Unit = {
  unit_id: number
  unit_symbol: string
}

type Conversion = {
  from_unit: Unit
  to_unit: Unit
  conversion_value: number
}

type Product = {
  id: number
  product_name: string
  description: string
  url_image: string
  unit_id: number
  harga_jual: number
  current_stock: number
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
  const { dataOptionProduct, fetchOptionProduct } = useMasterProductStore()

  const { createTransaction, isLoadingUpdate } = useTransactionStore()

  //   const token = 'your_token_here'

  useEffect(() => {
    //   axios
    //     .get('https://api.example.com/products', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     })
    //     .then(res => setProducts(res.data))

    setProducts(dataOptionProduct)
  }, [dataOptionProduct])

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

  const totalPrice = orders.reduce((sum, item) => sum + item.quantity * item.product.harga_jual, 0)

  const addProductToOrder = (product: Product) => {
    const index = orders.findIndex(o => o.product.id === product.id)

    const defaultUnit = product?.base_unit?.unit_symbol

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

  const handleSaveOrder = async () => {
    if (orders.length === 0) {
      useSnackbarStore.getState().showSnackbar('Tidak ada transaksi!', 'error')

      return
    }

    console.log(orders, 'orders')

    const payload = orders.map(item => ({
      type: 'in',
      unit_id: item.product.unit_id,
      product_id: item.product.id,
      quantity: item.quantity * (item.conversion?.multiplier || 1)
    }))

    console.log('Saving order:', payload)
    const success = await createTransaction(payload)

    if (success) {
      setOrders([])
      fetchOptionProduct()
      useSnackbarStore.getState().showSnackbar('Barang berhasil ditambahkan!', 'success')
    }

    // Misal: panggil API di sini
    // await axios.post('/api/orders', { orders: payload })
  }

  useEffect(() => {
    fetchOptionProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          getOptionLabel={option => option.product_name}
          onChange={(_, value) => {
            if (value) {
              addProductToOrder(value)
              setSelectedProduct(null)
              setInputValue('')
            }
          }}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '6px 6px'
                }}
              >
                <Typography variant='body1' component='div' sx={{ fontWeight: 'bold' }}>
                  {option.product_name}
                </Typography>
                <Typography variant='body2' color={option.current_stock === 0 ? 'error' : 'text.secondary'}>
                  Stok: {option.current_stock}
                </Typography>
              </li>
            )
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => <CustomTextField {...params} label='Cari Product' fullWidth />}
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
                    {/* <img
                      src={order.product.url_image}
                      alt={order.product.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: 4, objectFit: 'cover' }}
                    /> */}
                    <Box>
                      <Typography fontWeight='bold'>{order.product.product_name}</Typography>
                      {/* <Typography variant='body2' color='text.secondary'>
                        {order.product.description}
                      </Typography> */}
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
                      { unit: order?.product?.base_unit?.unit_symbol, multiplier: 1 }, // base unit
                      ...order?.product?.conversions?.map(conv => ({
                        unit: conv?.from_unit?.unit_symbol,
                        multiplier: conv?.conversion_value
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
                <TableCell>Rp {order.product.harga_jual.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  Rp {(order.quantity * order.conversion.multiplier * order.product.harga_jual).toLocaleString('id-ID')}
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
        {/* <Button variant='con
         */}
        <LoadingButton
          className='min-w-[150px]'
          type='submit'
          variant='contained'
          color='primary'
          loading={isLoadingUpdate}
          loadingPosition='start'
          onClick={handleSaveOrder}
        >
          Simpan
        </LoadingButton>
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>Hapus Barang</DialogTitle>
        <DialogContent>
          Apakah anda yakin dengan menghapus barang{' '}
          {confirmDeleteIndex !== null && orders[confirmDeleteIndex].product.product_name}?
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
