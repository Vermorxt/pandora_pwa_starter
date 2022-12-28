import { ChevronDownIcon } from '@heroicons/react/solid'
import { Ui_Dropdown, Ui_Flag } from '@vermorxt/pandora_ui'
import { NextRouter, useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useGlobalContext } from '../../system'

const languages = [
  { name: 'de', icon: 'de', text: 'DE', label: 'Deutsch' },
  { name: 'en', icon: 'gb', text: 'EN', label: 'English' },
]
interface HandleLocaleChange {
  lang: string
  router: NextRouter
}

const _UTIL = {
  handleLocaleChange: ({ lang, router }: HandleLocaleChange) => {
    if (router.pathname.includes('[locale]')) {
      const pathName = router.pathname.replace('[locale]', lang)

      void router.replace(router.pathname, pathName)
    }
  },
  getLocaleFromPath: (router: NextRouter) => {
    const pathSplit = router.asPath.split('/')

    return { locale: pathSplit?.[1] }
  },
}

export const defaultUlMenuClassNames = 'menu menu-compact p-4'

export const LanguageSelector: FC = () => {
  const router = useRouter()
  const { locale } = _UTIL.getLocaleFromPath(router)
  const [appData, setAppData] = useGlobalContext().appData

  // useEffect(() => {
  //   // NOTE: set language based on path on browser refresh
  //   if (locale !== appData?.language) {
  //     setAppData({ ...appData, language: locale })
  //   }

  //   // NOTE: set route path based on language
  //   if (locale === appData?.language) {
  //     const pathName = router.pathname
  //     const path = router.asPath
  //     const pathContainsLocale = pathName.includes('[locale]')
  //     const pathSplit = path.split('/')
  //     const expectedLanguage = pathSplit?.[1]

  //     console.log('pathName: ', pathName)
  //     console.log('path: ', path)
  //     console.log('pathContainsLocale: ', pathContainsLocale)
  //     console.log('expectedLanguage: ', expectedLanguage)

  //     if (expectedLanguage) {
  //       // void router.replace(pathName, pathName)
  //     }
  //   }
  // }, [router])

  const changeLanguage = ({ langName }: { langName: string }) => {
    _UTIL.handleLocaleChange({ lang: langName, router })

    setAppData({ ...appData, language: langName })
  }

  return (
    <>
      <Ui_Dropdown tooltip={{ content: `Language: ${appData.language as string}`, position: 'left' }} end hover>
        <Ui_Dropdown.Label className="btn btn-ghost normal-case">
          <Ui_Flag name={appData.language as string} /> <ChevronDownIcon className="h-5 w-5 mx-1" />
        </Ui_Dropdown.Label>
        <Ui_Dropdown.Content>
          <ul className={defaultUlMenuClassNames}>
            {languages.map((langObj, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`my-1 ${langObj.name === appData.language ? 'active' : ''}`}
                  onClick={() => changeLanguage({ langName: langObj.name })}
                >
                  <Ui_Flag name={langObj.icon} /> {langObj.label}
                </button>
              </li>
            ))}
          </ul>
        </Ui_Dropdown.Content>
      </Ui_Dropdown>
    </>
  )
}
