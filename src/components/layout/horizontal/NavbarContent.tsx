'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import Navigation from './Navigation'

import VuexyLogo from '@core/svg/Logo'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center gap-4 is-full')}>
      <VuexyLogo width={40} className='text-4xl text-primary mb-2' />

      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
        <Navigation />
      </div>
      <div className='flex items-center ml-auto'>
        {/* <ModeDropdown /> */}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
