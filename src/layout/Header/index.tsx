import { MenuIcon } from '@heroicons/react/solid'
import { Ui_Button, Ui_Label } from '@vermorxt/pandora_ui'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { logout } from '../../axios/auth'
import { DarkLightChanger } from '../../components/DarkLightChanger'
import { LanguageSelector } from '../../components/LanguageSelector'
import { StaticI18nLink } from '../../components/StaticI18nLink'
import { ThemeChanger } from '../../components/ThemeChanger'
import { useGlobalContext } from '../../system'
import { DRAWER_ID_SIDEBAR, GITHUB_REPO_LINK } from '../../_constants/main'

const GithubIconSvg = () => (
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="inline-block h-5 w-5 fill-current md:h-6 md:w-6"
  >
    <path d="M256,32C132.3,32,32,134.9,32,261.7c0,101.5,64.2,187.5,153.2,217.9a17.56,17.56,0,0,0,3.8.4c8.3,0,11.5-6.1,11.5-11.4,0-5.5-.2-19.9-.3-39.1a102.4,102.4,0,0,1-22.6,2.7c-43.1,0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1,1.4-14.1h.1c22.5,2,34.3,23.8,34.3,23.8,11.2,19.6,26.2,25.1,39.6,25.1a63,63,0,0,0,25.6-6c2-14.8,7.8-24.9,14.2-30.7-49.7-5.8-102-25.5-102-113.5,0-25.1,8.7-45.6,23-61.6-2.3-5.8-10-29.2,2.2-60.8a18.64,18.64,0,0,1,5-.5c8.1,0,26.4,3.1,56.6,24.1a208.21,208.21,0,0,1,112.2,0c30.2-21,48.5-24.1,56.6-24.1a18.64,18.64,0,0,1,5,.5c12.2,31.6,4.5,55,2.2,60.8,14.3,16.1,23,36.6,23,61.6,0,88.2-52.4,107.6-102.3,113.3,8,7.1,15.2,21.1,15.2,42.5,0,30.7-.3,55.5-.3,63,0,5.4,3.1,11.5,11.4,11.5a19.35,19.35,0,0,0,4-.4C415.9,449.2,480,363.1,480,261.7,480,134.9,379.7,32,256,32Z"></path>
  </svg>
)

export type T_SideBarContext = 'docu' | 'public' | 'dashboard' | 'docs'

const getSidebarContextBasedOnUrl = (url: string) => {
  const parts = url.split('/')

  return parts[1] as T_SideBarContext
}

const Header = () => {
  const router = useRouter()
  const [userData, setUserData] = useGlobalContext().userData
  const { t, i18n } = useTranslation('home')

  useEffect(() => {
    if (!router) return

    const sideBarContext = getSidebarContextBasedOnUrl(router.asPath)

    // console.log('----->>> sideBarContext: ', sideBarContext)

    if (sideBarContext === 'public') {
      // console.log('is public: ', true)
    }

    if (sideBarContext === 'dashboard') {
      // console.log('is dashboard: ', true)
    }

    if (sideBarContext === 'docs') {
      // console.log('is docs: ', true)
    }
  }, [router])

  return (
    <>
      <div className="header sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
        <nav className="navbar w-full">
          <div className="flex flex-1 md:gap-1 lg:gap-2 p-0">
            <Ui_Label as="button" size="small" htmlFor={DRAWER_ID_SIDEBAR} className="btn-ghost lg:hidden">
              <MenuIcon className="w-5" />
            </Ui_Label>
          </div>
          <div className="flex-0 mr-1">
            <DarkLightChanger />
            <ThemeChanger />
            <LanguageSelector />
            {/* <span className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="GitHub">
              <div className="flex-none items-center">
                <a
                  target={'_blank'}
                  href={GITHUB_REPO_LINK}
                  rel="noreferrer"
                  className="btn btn-ghost drawer-button btn-square normal-case"
                >
                  <GithubIconSvg />
                </a>
              </div>
            </span> */}
            <>
              {userData?.name && (
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
              {!userData?.name && (
                <>
                  <StaticI18nLink href="/de/public/login" locale={i18n.language === 'en' ? 'de' : 'en'}>
                    <Ui_Button size="small" className="btn-primary ml-2 mr-3">
                      Login
                    </Ui_Button>
                  </StaticI18nLink>
                </>
              )}
            </>
          </div>
        </nav>
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(Header), { ssr: false })
