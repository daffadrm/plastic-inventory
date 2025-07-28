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

interface AddEditProductType {
  open: boolean
  isEditMode: boolean
  productDetailData?: any
  onCancel: () => void
}

const optionCategory = [
  {
    label: 'Kresek',
    value: 'Kresek'
  },
  {
    label: 'Sterofoam',
    value: 'Sterofoam'
  },
  {
    label: 'Mika',
    value: 'Mika'
  }
]

export const defaultValues: ProductSchema = {
  id: 0,
  name: '',
  category: {
    label: '',
    value: ''
  },
  satuan: '',
  stock: 0,
  selling_price: 0,
  purchase_price: 0,
  min_stock: 0
}

const AddEditProduct = ({ open, isEditMode, productDetailData, onCancel }: AddEditProductType) => {
  const { updateMasterProduct } = useMasterProductStore()
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
    console.log(dataParam, 'dataParam')
    updateMasterProduct(dataParam?.id, dataParam)
    reset(defaultValues)
    handleConfirmationModal()
    onCancel()
  }

  useEffect(() => {
    if (productDetailData && open) {
      reset({
        ...productDetailData,
        category: optionCategory.find(
          category => category.value?.toLowerCase() === productDetailData?.category?.toLowerCase()
        ) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [productDetailData, reset, open])

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
        {isEditMode ? 'Edit kategori' : 'Tambah Kategori'}
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
                name='name'
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
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name={'category'}
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={optionCategory || []}
                    getOptionLabel={option => option?.label || ''}
                    value={(field.value && optionCategory.find(opt => opt.value === field.value.value)) || null}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={
                          <>
                            Kategori <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder={'Mika'}
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
                name='stock'
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
                    placeholder={'Kantong plastik berbagai macam ukuran'}
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='satuan'
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
                    error={!!errors.satuan}
                    helperText={errors.satuan?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='selling_price'
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
                    placeholder={'Rp. 20.000'}
                    error={!!errors.selling_price}
                    helperText={errors.selling_price?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='purchase_price'
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
                    error={!!errors.purchase_price}
                    helperText={errors.purchase_price?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='min_stock'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Min Stok <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'100'}
                    error={!!errors.min_stock}
                    helperText={errors.min_stock?.message}
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
        title={'Perbarui Data Category'}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={productDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
      />
    </Dialog>
  )
}

export default AddEditProduct
