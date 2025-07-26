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

interface AddEditCategoryType {
  open: boolean
  isEditMode: boolean
  conversionDetailData?: any
  onCancel: () => void
}

const optionStatus = [
  {
    label: 'Aktif',
    value: 'Aktif'
  },
  {
    label: 'Tidak Aktif',
    value: 'Tidak Aktif'
  }
]

export const defaultValues: ConversionSchema = {
  id: 0,
  product_name: '',
  from_unit: '',
  to_unit: '',
  multiplier: ''
}

const AddEditConversion = ({ open, isEditMode, conversionDetailData, onCancel }: AddEditCategoryType) => {
  const { updateMasterConversion } = useMasterConversionStore()
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
    updateMasterConversion(dataParam?.id, dataParam)
    reset(defaultValues)
    handleConfirmationModal()
    onCancel()
  }

  useEffect(() => {
    if (conversionDetailData && open) {
      reset({
        ...conversionDetailData,
        status: optionStatus.find(
          status => status.value?.toLowerCase() === conversionDetailData?.status?.toLowerCase()
        ) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [conversionDetailData, reset, open])

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
        {isEditMode ? 'Edit konversi' : 'Tambah konversi'}
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
                        Nama Produk <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Kresek'}
                    error={!!errors.product_name}
                    helperText={errors.product_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Controller
                name='from_unit'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Dari Unit <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Pcs'}
                    error={!!errors.from_unit}
                    helperText={errors.from_unit?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='to_unit'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Ke Unit <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Pcs'}
                    error={!!errors.to_unit}
                    helperText={errors.to_unit?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='multiplier'
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
                    error={!!errors.multiplier}
                    helperText={errors.multiplier?.message}
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
        title={'Perbarui Data Konversi'}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={conversionDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
      />
    </Dialog>
  )
}

export default AddEditConversion
