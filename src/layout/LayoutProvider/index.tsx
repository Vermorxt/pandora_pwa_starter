import { Ui_Drawer, Ui_Select, Ui_Spinner } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { userIsLoggedIn } from '../../axios/auth'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import FooterMenu from '../../components/FooterMenu'
import { DRAWER_ID_SIDEBAR } from '../../_constants/main'
import globalSettings from '../../_settings/global.settings'
import { Container } from '../Container'
import { Content } from '../Content'
import Header from '../Header'
import Sidebar from '../Sidebar'

export type T_SideBarContext = 'docu' | 'public' | ''

export const getSidebarContextBasedOnUrl = (url: string) => {
  const parts = url.split('/')

  return parts[1] as T_SideBarContext
}

export const LayoutProvider: FC<any> = ({ children, ...rest }) => {
  const router = useRouter()
  const [layout, setLayout] = useState<string>()

  useEffect(() => {
    console.log('userIsLoggedIn: ', userIsLoggedIn())

    if (!router) return
    const sideBarContext = getSidebarContextBasedOnUrl(router.asPath)

    if (!userIsLoggedIn() && sideBarContext === '') {
      return void router.push('/public/')
    }

    if (!userIsLoggedIn() && sideBarContext !== 'public') {
      console.log('router: ', router)

      if (router.asPath !== '/public/login') {
        return void router.push('/public/login')
      }
    }

    if (userIsLoggedIn()) {
      console.log('router: ', router)

      if (router.asPath === '/') {
        return void router.push('/dashboard')
      }
    }

    setLayout(sideBarContext)
  }, [router])

  if (!layout) {
    return (
      <div className="flex h-screen">
        <Ui_Spinner />
      </div>
    )
  }

  if (layout === 'public') {
    return (
      <div
        style={{
          width: '100%',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          height: 'auto',
          overflow: 'hidden',
        }}
      >
        <Header />
        <Container>
          <Breadcrumbs />
          <Content>{children}</Content>
        </Container>
      </div>
    )
  }

  return (
    <Ui_Drawer
      id={DRAWER_ID_SIDEBAR}
      className="h-screen w-full"
      defaultOpenOnLargeScreen={globalSettings.publicPages.sideBarDefaultOpen}
    >
      <Ui_Drawer.Side id={DRAWER_ID_SIDEBAR}>
        <Sidebar />
      </Ui_Drawer.Side>
      <Ui_Drawer.Content id={DRAWER_ID_SIDEBAR} isNavbar className="max-w-none">
        <div
          style={{
            width: '100%',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            height: 'auto',
            overflow: 'hidden',
          }}
        >
          <Header />
          <Container>
            <Breadcrumbs />
            <Content>{children}</Content>
          </Container>
          <FooterMenu className="lg:!hidden" />
        </div>
      </Ui_Drawer.Content>
    </Ui_Drawer>
  )
}
