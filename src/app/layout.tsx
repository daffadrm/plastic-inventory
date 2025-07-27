// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import GlobalSnackbar from '@/components/snackbar/GlobalSnackbar'

export const metadata = {
  title: 'PLINPOS',
  description: 'Plastic Inventory Point of Stock'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {children} <GlobalSnackbar />
      </body>
    </html>
  )
}

export default RootLayout
