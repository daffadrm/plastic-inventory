'use client'

import crypto from 'crypto'

import type { FormEvent } from 'react'
import { useState } from 'react'

import Link from 'next/link'

import { redirect, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { LoadingButton } from '@mui/lab'

import { Divider } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import { postLogin } from '@/app/server/auth'
import { decryptData, encryptData } from '@/utils/crypto'
import { useSnackbarStore } from '@/stores/snackbarStore'

const ivGenerate = crypto.randomBytes(16)?.toString('hex')

const Login = () => {
  const versioning1 = process.env.NEXT_PUBLIC_API_V1
  const defaultURL = process.env.NEXT_PUBLIC_DEFAULT_API
  const domain = window.location.origin
  const router = useRouter()
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoadingState(true)

    try {
      const form = event.currentTarget

      const username = (form.elements.namedItem('username') as HTMLInputElement).value
      const password = (form.elements.namedItem('password') as HTMLInputElement).value

      if (!username && !password) {
        useSnackbarStore.getState().showSnackbar('Lengkapi data dahulu', 'error')

        return
      }

      const payload = {
        identifier: username,
        password
      }

      const response = await postLogin(payload)

      const stringifyResponse = JSON?.stringify(response?.data)

      const encrypt = encryptData(ivGenerate, stringifyResponse)

      localStorage.setItem('iv', ivGenerate)
      localStorage.setItem('token', encrypt)

      useSnackbarStore.getState().showSnackbar(response?.meta?.message || 'Login successfully', 'success')

      setTimeout(() => router.push('/dashboard'), 500)
    } catch (error: any) {
      useSnackbarStore.getState().showSnackbar(error?.message || 'Login error', 'error')

      console.error(error)
    } finally {
      setIsLoadingState(false)
    }
  }

  const tokenStorage = localStorage?.getItem('token')
  const iv = localStorage?.getItem('iv')
  const encryptedToken = decryptData(iv || '', tokenStorage || '')
  let token = null

  if (encryptedToken) {
    try {
      token = encryptedToken ? JSON?.parse(encryptedToken)?.token : null
    } catch (error) {
      localStorage.removeItem('iv')
      localStorage.removeItem('token')
    }
  }

  if (token) {
    redirect('/dashboard')
  } else {
    return (
      <div className='flex justify-center items-center h-screen relative'>
        <AuthIllustrationWrapper>
          <Card className='flex flex-col sm:is-[450px]'>
            <CardContent className='sm:!p-12 text-center'>
              <div className='flex flex-col gap-1 mbe-6'>
                <Typography variant='h4'>{`Plastik Inventory System`}</Typography>
              </div>
              <form
                noValidate
                autoComplete='off'
                onSubmit={event => handleSubmit(event)}
                className='flex flex-col gap-6'
              >
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Username'
                  name='username'
                  placeholder='Masukkan username anda'
                />
                <CustomTextField
                  fullWidth
                  label='Password'
                  name='password'
                  placeholder='············'
                  id='outlined-adornment-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <div className='hidden justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                  <FormControlLabel hidden control={<Checkbox />} label='Remember me' />
                  <Typography className='text-end' color='primary' component={Link} href={'/login'}>
                    Forgot password?
                  </Typography>
                </div>
                <LoadingButton
                  fullWidth
                  variant='contained'
                  type='submit'
                  loading={isLoadingState}
                  loadingIndicator={<span className='text-white font-bold'>Loading...</span>}
                >
                  Sign In
                </LoadingButton>
                <div className='hidden items-center'>
                  <Divider className='flex-grow' />
                  <Typography className='px-4 text-gray-500'>Or</Typography>
                  <Divider className='flex-grow' />
                </div>

                <LoadingButton
                  fullWidth
                  variant='contained'
                  loading={isLoadingState}
                  loadingIndicator={<span className='text-white font-bold'>Loading...</span>}
                  onClick={() =>
                    window.location.replace(
                      `${domain?.startsWith('http://') ? `${defaultURL}/${versioning1}/auth/sso-login` : `${domain}/${versioning1}/auth/sso-login`}`
                    )
                  }
                  className='hidden'
                >
                  Sign In with SSO
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationWrapper>
      </div>
    )
  }
}

export default Login
