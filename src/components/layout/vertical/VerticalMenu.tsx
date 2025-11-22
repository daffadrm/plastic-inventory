// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useUser } from '@/@core/contexts/userContext'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const { dataUser } = useUser()

  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {dataUser?.user?.role === 'admin' && (
          <MenuItem href='/dashboard' icon={<i className='tabler-home' />}>
            Dashboard
          </MenuItem>
        )}
        {(dataUser?.user?.role === 'admin' || dataUser?.user?.role === 'staff') && (
          <>
            <MenuItem href='/items-out' icon={<i className='tabler-shopping-cart' />}>
              Barang Keluar
            </MenuItem>
            <MenuItem href='/items-in' icon={<i className='tabler-database-plus' />}>
              Barang Masuk
            </MenuItem>
          </>
        )}
        {dataUser?.user?.role === 'admin' && (
          <>
            <MenuItem href='/history-transaction' icon={<i className='tabler-history' />}>
              Riwayat Aktivitas
            </MenuItem>

            <SubMenu label={'Master'} icon={<i className='tabler-settings' />}>
              <MenuItem href='/master/product' icon={<i className='tabler-database-star' />}>
                Produk
              </MenuItem>
              <MenuItem href='/master/unit' icon={<i className='tabler-arrows-shuffle' />}>
                Unit
              </MenuItem>
              <MenuItem href='/master/category' icon={<i className='tabler-category' />}>
                Kategori
              </MenuItem>
              <MenuItem href='/master/conversion' icon={<i className='tabler-chart-funnel' />}>
                Konversi
              </MenuItem>
              <MenuItem href='/master/user' icon={<i className='tabler-user' />}>
                Pengguna
              </MenuItem>
            </SubMenu>
          </>
        )}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
