'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import ModalConfirmationComponent from '../../confirmation/ModalConfirmation'
import type { UnitSchema } from '@/schema/masterUnitSchema'
import { unitSchema } from '@/schema/masterUnitSchema'
import { useMasterUnitsStore } from '@/stores/masterUnitStore'

interface AddEditUnitType {
  open: boolean
  isEditMode: boolean
  unitDetailData?: any
  onCancel: () => void
}

export const defaultValues: UnitSchema = {
  id: 0,
  name: '',
  simbol: '',
  type: '',
  description: ''
}

const AddEditUnit = ({ open, isEditMode, unitDetailData, onCancel }: AddEditUnitType) => {
  const { updateMasterUnit } = useMasterUnitsStore()
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)

  const handleConfirmationModal = () => {
    setIsOpenConfirmationModalState(!isOpenConfirmationModalState)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<UnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues,
    mode: 'onChange'
  })

  const handleSubmitForm = async (dataParam: any) => {
    console.log(dataParam, 'dataParam')
    updateMasterUnit(dataParam?.id, dataParam)
    reset(defaultValues)
    handleConfirmationModal()
    onCancel()
  }

  useEffect(() => {
    if (unitDetailData && open) {
      reset({
        ...unitDetailData
      })
    } else {
      reset(defaultValues)
    }
  }, [unitDetailData, reset, open])

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
        {isEditMode ? 'Edit Unit' : 'Tambah Unit'}
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
                name='simbol'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Simbol <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Pcs'}
                    error={!!errors.simbol}
                    helperText={errors.simbol?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Type <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'Unit'}
                    error={!!errors.type}
                    helperText={errors.type?.message}
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
                    placeholder={'Satuan terkecil'}
                    error={!!errors.description}
                    helperText={errors.description?.message}
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
        title={'Perbarui Data Unit'}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={unitDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
      />
    </Dialog>
  )
}

export default AddEditUnit
