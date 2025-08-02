'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import ModalConfirmationComponent from '../../confirmation/ModalConfirmation'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import type { ProductSchema } from '@/schema/masterProductSchema'
import { productSchema } from '@/schema/masterProductSchema'
import { useMasterProductStore } from '@/stores/masterProductStore'

interface OptionCategoryType {
  id: number
  category_name: string
  description: string
  created_at: string
  is_active: boolean
  updated_at: string
}

interface OptionUnitType {
  id: number
  unit_name: string
  unit_symbol: string
  unit_type: string
  description: string
  base_unit: boolean
  conversion_to_base: number
  created_at: string
  updated_at: string
}
interface AddEditProductType {
  open: boolean
  isEditMode: boolean
  productDetailData?: any
  onCancel: () => void
  dataOptionCategory: OptionCategoryType[]
  dataOptionUnit: OptionUnitType[]
}

export const defaultValues: ProductSchema = {
  product_name: '',
  category: {
    id: 0,
    category_name: '',
    description: '',
    created_at: '',
    is_active: false,
    updated_at: ''
  },
  unit_symbol: {
    id: 0,
    unit_name: '',
    unit_symbol: '',
    unit_type: '',
    base_unit: false,
    conversion_to_base: 0,
    description: '',
    created_at: '',
    updated_at: ''
  },
  current_stock: 0,
  minimum_stock: 0,
  harga_jual: 0,
  harga_beli: 0
}

const AddEditProduct = ({
  open,
  isEditMode,
  productDetailData,
  onCancel,
  dataOptionCategory,
  dataOptionUnit
}: AddEditProductType) => {
  const { updateMasterProduct, isLoadingUpdate } = useMasterProductStore()
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)

  const handleConfirmationModal = () => {
    setIsOpenConfirmationModalState(!isOpenConfirmationModalState)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: 'onChange'
  })

  const handleSubmitForm = async (dataParam: any) => {
    const payload = {
      harga_jual: dataParam?.harga_jual || '',
      harga_beli: dataParam?.harga_beli,
      product_name: dataParam?.product_name,
      minimum_stock: dataParam?.minimum_stock,
      current_stock: dataParam?.current_stock,
      unit_id: dataParam?.unit_symbol.id,
      category_id: dataParam?.category?.id
    } as any

    const success = await updateMasterProduct(productDetailData?.id, payload)

    if (success) {
      reset(defaultValues)
      handleConfirmationModal()
      onCancel()
    }
  }

  const MAX_SAFE_NUMBER = 9007199254740991

  const handleFormattedChange = (name: string, input: string, onChange: (value: number | null) => void) => {
    const raw = input.replace(/\D/g, '')

    const numeric = raw ? Number(raw) : 0

    if (numeric !== null && numeric > MAX_SAFE_NUMBER) return

    onChange(numeric)
  }

  useEffect(() => {
    if (productDetailData && open) {
      reset({
        ...productDetailData,
        category: dataOptionCategory.find(category => category.id === productDetailData?.category_id) ?? {
          label: '',
          value: ''
        },
        unit_symbol: dataOptionUnit.find(category => category.id === productDetailData?.unit_id) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [productDetailData, reset, open, dataOptionCategory, dataOptionUnit])

  return (
    <Dialog open={open} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          paddingLeft: 4,
          borderBottom: '2px solid #e0e0e0'
        }}
      >
        {isEditMode ? 'Edit Produk' : 'Tambah Produk'}
      </DialogTitle>
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(handleConfirmationModal)}
        className='flex-col gap-6 grid'
      >
        <DialogContent className='mt-5'>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='product_name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Nama <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Kresek'}
                    error={!!errors.product_name}
                    helperText={errors.product_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={dataOptionCategory || []}
                    getOptionLabel={option => option?.category_name || ''}
                    value={field.value || null} // langsung gunakan value sebagai object
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    onChange={(_, value) => field.onChange(value)} // simpan object, bukan id
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={
                          <>
                            Kategori <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder='Mika'
                        error={!!errors?.category}
                        helperText={errors?.category?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='current_stock'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Stok <span className='text-red-500'>*</span>
                      </>
                    }
                    value={field.value === 0 ? 0 : field.value ?? ''} // pastikan value selalu ada
                    type='text'
                    inputMode='numeric'
                    placeholder={'0'}
                    error={!!errors.current_stock}
                    helperText={errors.current_stock?.message}
                    onKeyDown={e => {
                      const invalidChars = ['-', '+', 'e', '.', ',']

                      if (invalidChars.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => handleFormattedChange('current_stock', e.target.value, field.onChange)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='minimum_stock'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Minimun Stok <span className='text-red-500'>*</span>
                      </>
                    }
                    value={field.value === 0 ? 0 : field.value ?? ''} // pastikan value selalu ada
                    type='text'
                    inputMode='numeric'
                    placeholder={'0'}
                    error={!!errors.minimum_stock}
                    helperText={errors.minimum_stock?.message}
                    onKeyDown={e => {
                      const invalidChars = ['-', '+', 'e', '.', ',']

                      if (invalidChars.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => handleFormattedChange('minimum_stock', e.target.value, field.onChange)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* <Controller
                name='unit_symbol'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Satuan <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Kantong plastik berbagai macam ukuran'}
                    error={!!errors.unit_symbol}
                    helperText={errors.unit_symbol?.message}
                  />
                )}
              /> */}
              <Controller
                name='unit_symbol'
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={dataOptionUnit || []}
                    getOptionLabel={option => option?.unit_symbol || ''}
                    value={field.value || null}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={
                          <>
                            Satuan <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder='Mika'
                        error={!!errors?.unit_symbol}
                        helperText={errors?.unit_symbol?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='harga_jual'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Harga Jual <span className='text-red-500'>*</span>
                      </>
                    }
                    value={field.value === 0 ? 0 : field.value ?? ''} // pastikan value selalu ada
                    type='text'
                    inputMode='numeric'
                    onKeyDown={e => {
                      const invalidChars = ['-', '+', 'e', '.', ',']

                      if (invalidChars.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => handleFormattedChange('harga_jual', e.target.value, field.onChange)}
                    placeholder={'Rp. 20.000'}
                    error={!!errors.harga_jual}
                    helperText={errors.harga_jual?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='harga_beli'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Harga Beli <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Rp. 5.000'}
                    error={!!errors.harga_beli}
                    helperText={errors.harga_beli?.message}
                    type='text'
                    inputMode='numeric'
                    onKeyDown={e => {
                      const invalidChars = ['-', '+', 'e', '.', ',']

                      if (invalidChars.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => handleFormattedChange('harga_beli', e.target.value, field.onChange)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-between pbs-0'>
          <Button color='primary' onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type='submit' variant='contained'>
            {isEditMode ? 'Perbarui' : 'Simpan'}
          </LoadingButton>
        </DialogActions>
      </form>
      <ModalConfirmationComponent
        isOpen={isOpenConfirmationModalState}
        toggle={handleConfirmationModal}
        title={`${isEditMode ? 'Perbarui' : 'Tambah'} Data Produk`}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={productDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
        isLoading={isLoadingUpdate}
      />
    </Dialog>
  )
}

export default AddEditProduct
