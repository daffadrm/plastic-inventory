'use client'

import crypto from 'crypto'

import type { FormEvent } from 'react'
import { useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

import { LoadingButton } from '@mui/lab'

import { Box } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

import { postLogin } from '@/app/server/auth'
import { decryptData, encryptData } from '@/utils/crypto'
import { useSnackbarStore } from '@/stores/snackbarStore'

import BackgroundLogin from '@/assets/images/backgroundLogin.jpg'

const ivGenerate = crypto.randomBytes(16)?.toString('hex')

const Login = () => {
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

      if (!username || !password) {
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
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${BackgroundLogin.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1
          }
        }}
      >
        {/* Left Side - Text Content */}
        <Box
          sx={{
            flex: 1,
            color: 'white',
            padding: { xs: 4, md: 18 },
            zIndex: 2,
            position: 'relative'
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
              marginBottom: 2,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            Pantau, Kelola, dan Lacak Stok Plastik Anda dengan Mudah
          </Typography>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 300,
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              lineHeight: 1.4,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            Solusi sistem inventaris plastik real-time untuk efisiensi gudang dan operasional.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '500px' },
            padding: { xs: 2, md: 4 },
            zIndex: 2,
            position: 'relative',
            marginRight: { xs: '5%', md: '5%' }
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              {/* Logo and Company Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                {/* <Box
                  component='img'
                  src='/images/login/Logo-only.svg' // Ganti dengan path icon SVG Anda
                  alt='Land Bank Logo'
                  sx={{
                    width: 40,
                    height: 40,
                    marginRight: 2
                  }}
                /> */}
                <Box>
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      lineHeight: 1,
                      fontSize: '1.1rem'
                    }}
                    color={'primary'}
                  >
                    PLASTIK INVENTORY SYSTEM
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#666',
                      fontSize: '0.8rem',
                      lineHeight: 1
                    }}
                  >
                    Point Of Stock
                  </Typography>
                </Box>
              </Box>

              {/* Login Title */}
              <form
                noValidate
                autoComplete='off'
                onSubmit={event => handleSubmit(event)}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <Box>
                  <CustomTextField
                    label='Username'
                    fullWidth
                    name='username'
                    placeholder='Masukkan username anda'
                    variant='outlined'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  />
                </Box>

                <Box>
                  <CustomTextField
                    fullWidth
                    name='password'
                    placeholder='Masukkan kata sandi anda'
                    type={isPasswordShown ? 'text' : 'password'}
                    variant='outlined'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                    label='Kata Sandi'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            sx={{ color: '#666' }}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                <LoadingButton
                  fullWidth
                  variant='contained'
                  type='submit'
                  loading={isLoadingState}
                  loadingIndicator={<span style={{ color: 'white', fontWeight: 'bold' }}>Loading...</span>}
                  sx={{
                    borderRadius: 2,
                    padding: '12px 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Masuk
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    )
  }
}

export default Login
