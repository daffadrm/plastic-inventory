import { Snackbar, Alert } from '@mui/material'

interface SnackbarProps {
  openSnackbar: boolean
  snackbarSeverity: 'success' | 'error'
  snackbarMessage: string
  handleCloseSnackbar: () => void
}

const CustomSnackbar = ({ openSnackbar, snackbarSeverity, snackbarMessage, handleCloseSnackbar }: SnackbarProps) => {
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={10000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant='filled'>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
