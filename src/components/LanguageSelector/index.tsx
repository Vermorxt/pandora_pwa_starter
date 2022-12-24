import { ChevronDownIcon } from '@heroicons/react/solid'
import { Ui_Dropdown, Ui_Flag } from '@vermorxt/pandora_ui'
import { NextRouter, useRouter } from 'next/router'
import { FC } from 'react'

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
    void router.replace(router.pathname, router.pathname, { locale: lang })
  },
}

export const defaultUlMenuClassNames = 'menu menu-compact p-4'

export const LanguageSelector: FC = () => {
  const router = useRouter()
  const { locale } = useRouter()

  console.log('locale: ', locale)

  return (
    <>
      <Ui_Dropdown tooltip={{ content: `Language: ${locale as string}`, position: 'left' }} end hover>
        <Ui_Dropdown.Label className="btn btn-ghost normal-case">
          <Ui_Flag name={locale as string} /> <ChevronDownIcon className="h-5 w-5 mx-1" />
        </Ui_Dropdown.Label>
        <Ui_Dropdown.Content>
          <ul className={defaultUlMenuClassNames}>
            {languages.map((langObj, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`my-1 ${langObj.name === locale ? 'active' : ''}`}
                  onClick={() => _UTIL.handleLocaleChange({ lang: langObj.name, router })}
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
