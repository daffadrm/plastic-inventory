'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import type { UserSchema } from '@/schema/masterUserSchema'
import { userSchema } from '@/schema/masterUserSchema'
import ModalConfirmationComponent from '../../confirmation/ModalConfirmation'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { useMasterUserStore } from '@/stores/masterUserStore'

interface AddEditUserType {
  open: boolean
  isEditMode: boolean
  userDetailData?: any
  onCancel: () => void
}

const optionRole = [
  {
    label: 'Admin',
    value: 'Admin'
  },
  {
    label: 'Operator',
    value: 'Operator'
  },
  {
    label: 'User',
    value: 'User'
  }
]

export const defaultValues: UserSchema = {
  user_id: 0,
  username: '',
  full_name: '',
  email: '',
  phone_number: '',
  role: {
    label: '',
    value: ''
  },
  status: 'Active',
  profile_picture: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const AddEditUser = ({ open, isEditMode, userDetailData, onCancel }: AddEditUserType) => {
  const { updateMasterUser } = useMasterUserStore()
  const [isOpenConfirmationModalState, setIsOpenConfirmationModalState] = useState<boolean>(false)

  const handleConfirmationModal = () => {
    setIsOpenConfirmationModalState(!isOpenConfirmationModalState)
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues,
    mode: 'onChange'
  })

  const handleSubmitForm = async (dataParam: any) => {
    console.log(dataParam, 'dataParam')
    updateMasterUser(dataParam?.user.id, dataParam)
    reset(defaultValues)
    handleConfirmationModal()
    onCancel()
  }

  useEffect(() => {
    if (userDetailData && open) {
      reset({
        ...userDetailData,
        role: optionRole.find(status => status.value?.toLowerCase() === userDetailData?.role?.toLowerCase()) ?? {
          label: '',
          value: ''
        }
      })
    } else {
      reset(defaultValues)
    }
  }, [userDetailData, reset, open])

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
        {isEditMode ? 'Edit Pengguna' : 'Add Pengguna'}
      </DialogTitle>
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(handleConfirmationModal)}
        className='flex-col gap-6 grid'
      >
        <DialogContent className='mt-5'>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='username'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Username <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'daffa'}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='full_name'
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
                    placeholder={'daffa'}
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Email <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'daffa@gmail.com'}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Nomor Telepon <span className='text-red-500'>*</span>
                      </>
                    }
                    placeholder={'082112121212'}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name={'role'}
                control={control}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    fullWidth
                    options={optionRole || []}
                    getOptionLabel={option => option?.label || ''}
                    value={(field.value && optionRole.find(opt => opt.value === field.value.value)) || null}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label={'Role Saat Ini'}
                        placeholder={'Admin'}
                        error={!!errors?.role}
                        helperText={errors?.role?.message}
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
        title={'Perbarui Data Pengguna'}
        warning={'Tindakan ini akan menyimpan perubahan. Apakah Anda yakin ingin melanjutkan?'}
        icon={'tabler-send'}
        actionText={'Simpan'}
        handleClose={() => setIsOpenConfirmationModalState(false)}
        data={userDetailData}
        handleRequest={handleSubmit(formData => handleSubmitForm(formData))}
      />
    </Dialog>
  )
}

export default AddEditUser
