// MUI Imports
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, MenuItem, SubMenu } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useUser } from '@/@core/contexts/userContext'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = () => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()
  const { dataUser } = useUser()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        {dataUser?.user?.role === 'admin' && (
          <MenuItem href='/dashboard' icon={<i className='tabler-home' />}>
            Beranda
          </MenuItem>
        )}
        {(dataUser?.user?.role === 'admin' || dataUser?.user?.role === 'staff') && (
          <MenuItem href='/items-out' icon={<i className='tabler-shopping-cart' />}>
            Barang Keluar
          </MenuItem>
        )}
        {dataUser?.user?.role === 'admin' && (
          <>
            <MenuItem href='/items-in' icon={<i className='tabler-database-plus' />}>
              Barang Masuk
            </MenuItem>
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
    </HorizontalNav>
  )
}

export default HorizontalMenu
