'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import ModalConfirmationComponent from '../../confirmation/ModalConfirmation'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import type { CategorySchema } from '@/schema/masterCategorySchema'
import { categorySchema } from '@/schema/masterCategorySchema'
import { useMasterCategoryStore } from '@/stores/masterCategoryStore'

interface AddEditCategoryType {
  open: boolean
  isEditMode: boolean
  categoryDetailData?: any
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

export const defaultValues: CategorySchema = {
  id: 0,
  name: '',
  description: '',
  status: {
    label: '',
    value: ''
  }
}

const AddEditCategory = ({ open, isEditMode, categoryDetailData, onCancel }: AddEditCategoryType) => {
  const { updateMasterCategory } = useMasterCategoryStore()
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)

  const handleConfirmationModal = () => {
    setIsOpenConfirmationModalState(!isOpenConfirmationModalState)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues,
    mode: 'onChange'
  })

  const handleSubmitForm = async (dataParam: any) => {
    console.log(dataParam, 'dataParam')
    updateMasterCategory(dataParam?.id, dataParam)
    reset(defaultValues)
    handleConfirmationModal()
    onCancel()
  }

  useEffect(() => {
    if (categoryDetailData && open) {
      reset({
        ...categoryDetailData,
        status: optionStatus.find(
          status => status.value?.toLowerCase() === categoryDetailData?.status?.toLowerCase()
        ) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [categoryDetailData, reset, open])

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

            <Grid item xs={12} sm={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Deskripsi <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Kantong plastik berbagai macam ukuran'}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name={'status'}
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={optionStatus || []}
                    getOptionLabel={option => option?.label || ''}
                    value={(field.value && optionStatus.find(opt => opt.value === field.value.value)) || null}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={
                          <>
                            Status <span className='text-red-500'>*</span>
                          </>
                        }
                        placeholder={'Aktif'}
                        error={!!errors?.status}
                        helperText={errors?.status?.message}
                      />
                    )}
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
        data={categoryDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
      />
    </Dialog>
  )
}

export default AddEditCategory
