import { MenuIcon } from '@heroicons/react/solid'
import { Ui_Button, Ui_Label } from '@vermorxt/pandora_ui'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { logout, userIsLoggedIn } from '../../axios/auth'
import { DarkLightChanger } from '../../components/DarkLightChanger'
import { ThemeChanger } from '../../components/ThemeChanger'
import { useGlobalContext } from '../../system'
import { DRAWER_ID_SIDEBAR } from '../../_constants/main'

export type T_SideBarContext = 'docu' | 'public' | 'dashboard' | 'docs'

const getSidebarContextBasedOnUrl = (url: string) => {
  const parts = url.split('/')

  return parts[1] as T_SideBarContext
}

const Header = () => {
  const router = useRouter()
  const [userData, setUserData] = useGlobalContext().userData
  const [layout, setLayout] = useState<string>()

  useEffect(() => {
    if (!router) return

    const sideBarContext = getSidebarContextBasedOnUrl(router.asPath)

    setLayout(sideBarContext)

    console.log('----->>> sideBarContext: ', sideBarContext)

    if (sideBarContext === 'public') {
      console.log('is public: ', true)
    }

    if (sideBarContext === 'dashboard') {
      console.log('is dashboard: ', true)
    }

    if (sideBarContext === 'docs') {
      console.log('is docs: ', true)
    }
  }, [router])

  return (
    <>
      <div className="header sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
        <nav className="navbar w-full">
          <div className="flex flex-1 md:gap-1 lg:gap-2 p-0">
            {layout !== 'public' && (
              <Ui_Label as="button" size="small" htmlFor={DRAWER_ID_SIDEBAR} className="!btn-ghost lg:!hidden">
                <MenuIcon className="w-5" />
              </Ui_Label>
            )}
          </div>

          <div className="flex-0 mr-1">
            <DarkLightChanger />
            <ThemeChanger />
            <>
              {userIsLoggedIn() && (
                <Ui_Button
                  size="small"
                  className="btn-primary ml-2 mr-3"
                  onClick={() => {
                    setUserData({})
                    void logout()
                    void router.push('/public/login')
                  }}
                >
                  Logout
                </Ui_Button>
              )}
              {!userIsLoggedIn() && (
                <Ui_Button
                  size="small"
                  className="btn-primary ml-2 mr-3"
                  onClick={() => void router.push('/public/login')}
                >
                  Login
                </Ui_Button>
              )}
            </>
          </div>
        </nav>
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(Header), { ssr: false })
