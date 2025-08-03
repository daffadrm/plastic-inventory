'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import ModalConfirmationComponent from '../../confirmation/ModalConfirmation'
import type { ConversionSchema } from '@/schema/masterConversionSchema'
import { conversionSchema } from '@/schema/masterConversionSchema'
import { useMasterConversionStore } from '@/stores/masterConversionStore'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

interface OptionProductType {
  id: number
  product_name: string
  category_id: number
  category_name: string
  unit_id: number
  unit_name: string
  unit_symbol: string
  minimum_stock: number
  harga_beli: number
  harga_jual: number
  created_at: string
  updated_at: string
  current_stock: number
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
interface AddEditCategoryType {
  open: boolean
  isEditMode: boolean
  conversionDetailData?: any
  onCancel: () => void
  dataOptionUnit: OptionUnitType[]
  dataOptionProduct: OptionProductType[]
}

export const defaultValues: ConversionSchema = {
  id: 0,
  product_name: {
    id: 0,
    product_name: '',
    category_id: 0,
    category_name: '',
    unit_id: 0,
    unit_name: '',
    unit_symbol: '',
    minimum_stock: 0,
    harga_beli: 0,
    harga_jual: 0,
    created_at: '',
    updated_at: '',
    current_stock: 0
  },
  from_unit: {
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
  to_unit: {
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
  conversion_value: 0
}

const AddEditConversion = ({
  open,
  isEditMode,
  conversionDetailData,
  onCancel,
  dataOptionProduct,
  dataOptionUnit
}: AddEditCategoryType) => {
  const { updateMasterConversion, isLoadingUpdate } = useMasterConversionStore()
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)

  const handleConfirmationModal = () => {
    setIsOpenConfirmationModalState(!isOpenConfirmationModalState)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ConversionSchema>({
    resolver: zodResolver(conversionSchema),
    defaultValues,
    mode: 'onChange'
  })

  const handleSubmitForm = async (dataParam: any) => {
    console.log(dataParam, 'dataParam')

    // return

    const payload = {
      product_id: dataParam?.product_name?.id || '',
      from_unit_id: dataParam?.from_unit?.id,
      to_unit_id: dataParam?.to_unit?.id,
      conversion_value: dataParam?.conversion_value
    } as any

    const success = await updateMasterConversion(conversionDetailData?.id, payload)

    if (success) {
      reset(defaultValues)
      handleConfirmationModal()
      onCancel()
    }
  }

  const MAX_SAFE_NUMBER = 90071

  const handleFormattedChange = (name: string, input: string, onChange: (value: number | null) => void) => {
    const raw = input.replace(/\D/g, '')

    const numeric = raw ? Number(raw) : 0

    if (numeric !== null && numeric > MAX_SAFE_NUMBER) return

    onChange(numeric)
  }

  useEffect(() => {
    if (conversionDetailData && open) {
      reset({
        ...conversionDetailData,
        product_name: dataOptionProduct?.find(product => product?.id === conversionDetailData?.product_id) ?? {
          label: '',
          value: ''
        },
        from_unit: dataOptionUnit?.find(from => from?.id === conversionDetailData?.from_unit_id) ?? {
          label: '',
          value: ''
        },
        to_unit: dataOptionUnit?.find(to => to?.id === conversionDetailData?.to_unit_id) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [conversionDetailData, reset, open, dataOptionProduct, dataOptionUnit])

  return (
    <Dialog open={open} maxWidth='sm' fullWidth scroll='body'>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          paddingLeft: 4,
          borderBottom: '2px solid #e0e0e0'
        }}
      >
        {isEditMode ? 'Edit Konversi' : 'Tambah Konversi'}
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
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={dataOptionProduct || []}
                    getOptionLabel={option => option?.product_name || ''}
                    value={field.value || null}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={
                          <>
                            Nama Produk <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder='Mika'
                        error={!!errors?.product_name}
                        helperText={errors?.product_name?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='from_unit'
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
                            Dari Unit <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder='Pack'
                        error={!!errors?.from_unit}
                        helperText={errors?.from_unit?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='to_unit'
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
                            Ke Unit <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder='Pcs'
                        error={!!errors?.to_unit}
                        helperText={errors?.to_unit?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name='conversion_value'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Pengkali <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Pcs'}
                    type='text'
                    inputMode='numeric'
                    error={!!errors.conversion_value}
                    helperText={errors.conversion_value?.message}
                    onKeyDown={e => {
                      const invalidChars = ['-', '+', 'e', '.', ',']

                      if (invalidChars.includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => handleFormattedChange('conversion_value', e.target.value, field.onChange)}
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
        title={`${isEditMode ? 'Perbarui' : 'Tambah'} Data Konversi`}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={conversionDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
        isLoading={isLoadingUpdate}
      />
    </Dialog>
  )
}

export default AddEditConversion
