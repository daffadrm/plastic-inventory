'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Grid
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

const typeRole = [
  { label: 'Sales', value: 'Sales' },
  { label: 'Engineer', value: 'Engineer' },
  { label: 'Admin', value: 'Admin' }
]

interface AddEditUserProps {
  open: boolean
  isEditMode: boolean
  userData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  datasOptionCluster: any
  isLoadingState: boolean
}

interface ErrorField {
  email: string
  phone: string
  password: string
  username: string
}

const AddEditUser = ({
  open,
  isEditMode,
  userData,
  onSubmit,
  onCancel,
  datasOptionCluster,
  isLoadingState
}: AddEditUserProps) => {
  const initialState = {
    username: '',
    full_name: '',
    email: '',
    phone: '',
    cluster: [],
    password: '',
    confirm_password: '',
    role: ''
  }

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordConfirmationShown, setIsPasswordConfirmationShown] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const [state, setState] = useState<any>(initialState)

  const [errorField, setErrorField] = useState<ErrorField>({
    email: '',
    phone: '',
    password: '',
    username: ''
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowPasswordConfirmation = () => setIsPasswordConfirmationShown(show => !show)

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/
    const hasUppercase = /[A-Z]/
    const hasLowercase = /[a-z]/
    const hasNumber = /[0-9]/
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/

    return (
      minLength.test(password) &&
      hasUppercase.test(password) &&
      hasLowercase.test(password) &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password)
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/

  const handleChange = (event: any) => {
    const { name, value } = event.target

    event.persist()
    setState({ ...state, [name]: value })

    if (name === 'email') {
      setErrorField(prev => ({
        ...prev,
        email: emailRegex.test(value) ? '' : 'Invalid email'
      }))
    } else if (name === 'username') {
      setErrorField(prev => ({
        ...prev,
        username: usernameRegex.test(value) ? '' : 'Username must be 4-20 characters, alphanumeric or underscore'
      }))
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const errors: ErrorField = { email: '', phone: '', password: '', username: '' }

    const isEmptyField = Object.entries(state).some(
      ([key, value]) =>
        key !== 'password' && key !== 'confirm_password' && typeof value === 'string' && value?.trim() === ''
    )

    // const isEmptyField = Object.values(state).some(value => value === '')

    if (isEmptyField) {
      isValid = false
    }

    if (!state.email) {
      errors.email = 'Required'
      isValid = false
    } else if (!emailRegex.test(state.email)) {
      errors.email = 'Invalid email'
      isValid = false
    }

    // Validate phone field
    if (!state.phone) {
      errors.phone = 'Required'
      isValid = false
    }

    if (!state.username) {
      errors.username = 'Required'
      isValid = false
    } else if (!usernameRegex.test(state.username)) {
      errors.username = 'Username must be 4-20 characters, alphanumeric or underscore'
      isValid = false
    }

    if (!isEditMode) {
      // Password required during creation
      if (!state.password) {
        errors.password = 'Required'
        isValid = false
      } else if (!validatePassword(state.password)) {
        errors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        isValid = false
      }
    } else if (state.password || state.confirm_password) {
      // If editing and password fields are provided, validate them
      if (state.password !== state.confirm_password) {
        errors.password = 'Password and confirmation password do not match.'
        isValid = false
      } else if (!validatePassword(state.password)) {
        errors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        isValid = false
      }
    }

    setErrorField(errors)

    return isValid
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)

    if (!validateForm()) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...payload } = state

    onSubmit(payload)
  }

  useEffect(() => {
    if (isEditMode && userData) {
      setState({
        ...userData,
        password: '',
        confirm_password: ''
      })
    } else if (!isEditMode) {
      // Jika mode add, reset form
      setState(initialState)
      setIsSubmitted(false)
      setErrorField({ email: '', phone: '', password: '', username: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, userData])

  useEffect(() => {
    if (!isEditMode && !open) {
      setState(initialState)
      setIsSubmitted(false)
      setErrorField({ email: '', phone: '', password: '', username: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEditMode])

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
        {isEditMode ? 'Edit User' : 'Add User'}
      </DialogTitle>
      <form noValidate autoComplete='off' onSubmit={event => handleSubmit(event)} className='flex-col gap-6 grid'>
        <DialogContent className='mt-5'>
          <Grid container spacing={6}>
            <Grid item xs={6} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Fullname'
                name='full_name'
                onChange={handleChange}
                value={state.full_name}
                placeholder='Enter your Fullname'
                error={isSubmitted && !state?.full_name}
                helperText={isSubmitted && !state?.full_name && 'Required'}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <CustomTextField
                fullWidth
                label='Username'
                name='username'
                onChange={handleChange}
                value={state.username}
                placeholder='Enter your username'
                disabled={isEditMode}
                error={!!errorField?.username || (isSubmitted && !state?.username)}
                helperText={errorField?.username || (isSubmitted && !state?.username && 'Required')}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                onChange={handleChange}
                value={state.email}
                placeholder='Enter your email'
                error={!!errorField?.email || (isSubmitted && !state.email)}
                helperText={errorField?.email || (isSubmitted && !state.email && 'Required')}

                // error={isSubmitted && !state?.email}
                // helperText={isSubmitted && !state?.email && 'Required'}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomTextField
                fullWidth
                label='NIK'
                name='phone'
                onChange={handleChange}
                value={state.phone}
                placeholder='Enter your NIK'
                error={!!errorField?.phone || (isSubmitted && !state.phone)}
                helperText={errorField?.phone || (isSubmitted && !state.phone && 'Required')}

                // error={isSubmitted && !state?.phone}
                // helperText={isSubmitted && !state?.phone && 'Required'}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomAutocomplete
                fullWidth
                options={typeRole || []}
                getOptionLabel={option => option?.label || ''}
                onChange={(e, value) => {
                  setState((prev: any) => ({ ...prev, role: value?.value }))
                }}
                value={typeRole?.find(option => option?.label === state?.role) || null}
                renderInput={params => (
                  <CustomTextField
                    placeholder='--Choose Role--'
                    {...params}
                    label='Role'
                    error={isSubmitted && !state?.role}
                    helperText={isSubmitted && !state?.role && 'Required'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomAutocomplete
                multiple
                fullWidth
                options={['All Cluster', ...(datasOptionCluster || [])]}
                getOptionLabel={(option: string) => option || ''}
                onChange={(e, value) => {
                  if (value.includes('All Cluster')) {
                    if (state.cluster.includes('All Cluster')) {
                      setState((prev: any) => ({
                        ...prev,
                        cluster: []
                      }))
                    } else {
                      setState((prev: any) => ({
                        ...prev,
                        cluster: datasOptionCluster
                      }))
                    }
                  } else {
                    setState((prev: any) => ({
                      ...prev,
                      cluster: value
                    }))
                  }
                }}
                value={state?.cluster.length === datasOptionCluster.length ? ['All Cluster'] : state?.cluster || []}
                renderInput={params => (
                  <CustomTextField
                    placeholder='--Choose Cluster--'
                    {...params}
                    label='Cluster'
                    error={isSubmitted && (!Array.isArray(state?.cluster) || state.cluster.length === 0)}
                    helperText={
                      isSubmitted && (!Array.isArray(state?.cluster) || state.cluster.length === 0) && 'Required'
                    }

                    // error={isSubmitted && !state?.cluster}
                    // helperText={isSubmitted && !state?.cluster && 'Required'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomTextField
                fullWidth
                label='Password'
                name='password'
                onChange={handleChange}
                placeholder='············'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={isSubmitted && !!errorField.password}
                helperText={errorField.password}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <CustomTextField
                fullWidth
                label='Confirmation Password'
                placeholder='············'
                type={isPasswordConfirmationShown ? 'text' : 'password'}
                name='confirm_password'
                value={state.confirm_password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPasswordConfirmation}>
                        <i className={isPasswordConfirmationShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-between pbs-0'>
          <Button color='primary' onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type='submit' loading={isLoadingState} variant='contained'>
            {isEditMode ? 'Update' : 'Submit'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditUser
