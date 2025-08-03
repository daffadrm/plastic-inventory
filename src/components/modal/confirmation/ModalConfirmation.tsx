import { useCallback, type FC } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import type { ModalConfirmationProps } from '@/types/apps/modalTypes'

const ModalConfirmationComponent: FC<ModalConfirmationProps> = ({
  isOpen,
  toggle,
  handleRequest,
  title,
  warning,
  icon,
  actionText,
  data,
  isLoading,
  handleClose
}) => {
  const handleAction = useCallback(() => {
    handleRequest(data)
  }, [data, handleRequest])

  return (
    <Dialog open={isOpen} onClose={() => toggle(null)}>
      <DialogContent className='flex flex-col items-center justify-center'>
        <i className={`${icon ? icon : 'tabler-alert-circle'} text-center text-[100px] text-primary mb-5`} />
        <h1 className='text-center'>{title || ''}</h1>
        <DialogContentText className='text-center'>{warning || ''}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type='button' onClick={handleClose} color='info'>
          Cancel
        </Button>
        <LoadingButton
          className='min-w-[150px]'
          type='submit'
          variant='contained'
          color='primary'
          loading={isLoading}
          loadingPosition='start'
          onClick={handleAction}
        >
          {actionText ? actionText : 'Deleted'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ModalConfirmationComponent
