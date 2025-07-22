import { CircularProgress, Box } from '@mui/material'

export default function Loading() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Box className='relative'>
        <CircularProgress
          className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
          color='primary'
        />
      </Box>
    </div>
  )
}
