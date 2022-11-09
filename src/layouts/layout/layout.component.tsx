import React from 'react'

import ConnectionAlert from '../../components/connection-alert/connection-alert.component'
import { onlyActive } from '../../guards/active.guard'
import { onlyAuth } from '../../guards/auth.guard'
import { useIsMobile } from '../../hooks/is-mobile.hook'
import DesktopLayout from '../desktop-layout/desktop-layout.component'
import MobileLayout from '../mobile-layout/mobile-layout.component'

type Props = {
  children: React.ReactNode
}
const Layout = ({ children }: Props) => {
  const isMobile = useIsMobile()
  return (
    <>
      {isMobile ? (
        <MobileLayout>{children}</MobileLayout>
      ) : (
        <DesktopLayout>{children}</DesktopLayout>
      )}
      <ConnectionAlert />
    </>
  )
}

export default onlyAuth(onlyActive(Layout))
