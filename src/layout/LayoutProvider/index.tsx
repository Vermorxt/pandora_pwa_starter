import { Ui_Drawer } from '@vermorxt/pandora_ui'
import { FC } from 'react'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { DRAWER_ID_SIDEBAR } from '../../_constants/main'
import globalSettings from '../../_settings/global.settings'
import { Container } from '../Container'
import { Content } from '../Content'
import Header from '../Header'
import Sidebar from '../Sidebar'

export const LayoutProvider: FC<any> = ({ children, ...rest }) => (
  <Ui_Drawer
    id={DRAWER_ID_SIDEBAR}
    className="h-screen w-full"
    defaultOpenOnLargeScreen={globalSettings.publicPages.sideBarDefaultOpen}
  >
    <Ui_Drawer.Side id={DRAWER_ID_SIDEBAR}>
      <Sidebar />
    </Ui_Drawer.Side>
    <Ui_Drawer.Content id={DRAWER_ID_SIDEBAR} isNavbar className="max-w-none">
      <div style={{ width: '100%', padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container>
          <Breadcrumbs />
          <Content>{children}</Content>
        </Container>
      </div>
    </Ui_Drawer.Content>
  </Ui_Drawer>
)
