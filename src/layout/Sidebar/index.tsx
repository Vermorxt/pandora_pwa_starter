import { Ui_Collapse, Ui_Divider, Ui_Label, Ui_NavLink } from '@vermorxt/pandora_ui'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { DRAWER_ID_SIDEBAR } from '../../_constants/main'
import SidebarFooter from './SidebarFooter'
import { getRoutesMain } from './sidebarRoutes/routes_main'

export interface RoutesInterface {
  topic?: string
  separator?: string
  routes?: {
    path?: string
    icon?: any
    text?: string
  }[]
}

export type T_SideBarContext = 'docu' | 'public'

const getSidebarContextBasedOnUrl = (url: string) => {
  const parts = url.split('/')

  return parts[1] as T_SideBarContext
}

const Sidebar: FC = props => {
  const { t } = useTranslation('sideMenuDocu')
  const router = useRouter()

  const [routes, setRoutes] = useState<RoutesInterface[]>([])
  const [hideSideBar, setHideSidebar] = useState<boolean>(false)

  useEffect(() => {
    if (!router) return

    const sideBarContext = getSidebarContextBasedOnUrl(router.asPath)

    if (sideBarContext === 'public') {
      setHideSidebar(true)
    } else {
      setHideSidebar(false)
    }

    const useRoutes = getRoutesMain(t) as unknown as RoutesInterface[]
    if (useRoutes) setRoutes([...useRoutes])
  }, [router])

  if (hideSideBar) return <></>

  return (
    <aside className="bg-base-200 w-80 flex flex-col px-2">
      <div className="z-20 bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 shadow-sm gap-2 p-4 flex justify-between h-16 w-full items-baseline ">
        <Ui_NavLink href={'/'}>
          <div className="font-title text-primary text-xl transition-all duration-200 lg:text-3xl">
            <span className="lowercase">App</span>
            <span className="text-base-content uppercase"> Title</span>
            <span className="text-base-content lowercase text-xs"> postfix</span>
          </div>
        </Ui_NavLink>
        <span className="text-base-content lowercase text-xs ml-0"> v0.0.1</span>

        <Ui_Label
          as="button"
          size="small"
          variant="primary"
          outline
          htmlFor={DRAWER_ID_SIDEBAR}
          className="drawer-button bg-transparent !min-h-0 h-auto px-4 py-1 lg:hidden hover:!bg-base-300"
        >
          x
        </Ui_Label>
      </div>
      <div className="h-4"></div>
      <div className="wrap flex-grow">
        {routes.map((route, routeIndex) => (
          <React.Fragment key={routeIndex}>
            {route?.separator && (
              <Ui_Divider className="text-secondary" key={`${routeIndex}_w`}>
                <small>{route?.separator}</small>
              </Ui_Divider>
            )}
            {route?.topic && (
              <Ui_Collapse arrow defaultOpen={routeIndex === 0 || routeIndex === 1} key={routeIndex}>
                <Ui_Collapse.Title className="menu-title px-4 py-2 bg-base-200 min-h-0 text-gray-500 text-sm after:!top-3">
                  {route?.topic}
                </Ui_Collapse.Title>
                <Ui_Collapse.Content className="!p-0">
                  <ul key={`${routeIndex}_ul`} className="menu menu-compact flex flex-col p-0">
                    {route?.routes?.map((routeItem, index) => (
                      <li key={index}>
                        {routeItem?.path && (
                          <Ui_NavLink href={routeItem?.path as string} className="text-base-content">
                            {routeItem?.icon && <routeItem.icon className="h-5 w-5" />}
                            {routeItem?.text}
                          </Ui_NavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </Ui_Collapse.Content>
              </Ui_Collapse>
            )}
            {!route?.topic && (
              <ul key={`${routeIndex}_ul_clean`} className="menu menu-compact flex flex-col p-0">
                {route?.routes?.map((routeItem, index) => (
                  <li key={index}>
                    {routeItem?.path && (
                      <Ui_NavLink href={routeItem?.path as string}>
                        {routeItem?.icon && <routeItem.icon className="h-5 w-5" />}
                        {routeItem?.text}
                      </Ui_NavLink>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </div>

      <SidebarFooter />
    </aside>
  )
}

export default dynamic(() => Promise.resolve(Sidebar), { ssr: false })
