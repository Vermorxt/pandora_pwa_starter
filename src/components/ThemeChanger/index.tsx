import { ChevronDownIcon, ColorSwatchIcon } from '@heroicons/react/solid'
import { Ui_Dropdown } from '@vermorxt/pandora_ui'
import { useTheme } from 'next-themes'
import { MouseEvent, useEffect } from 'react'

export interface UseThemeProps {
  theme: string
  setTheme: (arg: string) => void
}

export const THEMES = [
  { name: 'wireframe', icon: '📝', mode: 'light', active: true },
  { name: 'light', icon: '🌝', mode: 'light' },
  { name: 'dark', icon: '🌚', mode: 'dark' },
  { name: 'cupcake', icon: '🧁', mode: 'light' },
  { name: 'bumblebee', icon: '🐝', mode: 'light' },
  { name: 'emerald', icon: '✳️', mode: 'light' },
  { name: 'corporate', icon: '🏢', mode: 'light' },
  { name: 'synthwave', icon: '🌃', mode: 'dark' },
  { name: 'retro', icon: '👴', mode: 'light' },
  { name: 'cyberpunk', icon: '🤖', mode: 'light' },
  { name: 'valentine', icon: '🌸', mode: 'light' },
  { name: 'halloween', icon: '🎃', mode: 'dark' },
  { name: 'garden', icon: '🌷', mode: 'light' },
  { name: 'forest', icon: '🌲', mode: 'dark' },
  { name: 'aqua', icon: '🐟', mode: 'light' },
  { name: 'lofi', icon: '👓', mode: 'light' },
  { name: 'pastel', icon: '🖍', mode: 'light' },
  { name: 'fantasy', icon: '🧚‍♀️', mode: 'light' },
  { name: 'black', icon: '🏴', mode: 'dark' },
  { name: 'luxury', icon: '💎', mode: 'dark' },
  { name: 'dracula', icon: '🧛‍♂️', mode: 'dark' },
  { name: 'cmyk', icon: '🖨', mode: 'light' },
  { name: 'autumn', icon: '🍁', mode: 'light' },
  { name: 'business', icon: '💼', mode: 'dark' },
  { name: 'acid', icon: '💊', mode: 'light' },
  { name: 'lemonade', icon: '🍋', mode: 'light' },
  { name: 'night', icon: '🌙', mode: 'dark' },
  { name: 'coffee', icon: '☕️', mode: 'dark' },
  { name: 'winter', icon: '❄️', mode: 'light' },
]

export const DEFAULT_DROPDOWN_CLASSNAMES = 'menu menu-compact p-4'

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme() as UseThemeProps

  useEffect(() => {
    setTheme('wireframe')
  }, [])

  const changeTheme = (event: any, themeSelection: string) => {
    console.log('new theme: ', event)

    setTheme(themeSelection)
  }

  return (
    <>
      <Ui_Dropdown
        tooltip={{ content: `Current theme: ${theme}`, position: 'left' }}
        end
        hover
        className="p-0 hover:!bg-transparent"
      >
        <Ui_Dropdown.Label tabindex="0" className="p-0 !bg-transparent !btn-ghost hover:!bg-transparent">
          <ColorSwatchIcon className="h-5 w-5" />
          <span className="hidden md:inline">Theme</span>
          <ChevronDownIcon className="h-5 w-5" />
        </Ui_Dropdown.Label>
        <Ui_Dropdown.Content className="h-96 overflow-y-auto w-52" style={{ right: 0, pointerEvents: 'auto' }}>
          <ul tabIndex={0} className={DEFAULT_DROPDOWN_CLASSNAMES}>
            {THEMES.map((themeObj, index) => (
              <li key={index}>
                <button
                  onClick={event => changeTheme(event, themeObj?.name)}
                  data-set-theme={themeObj.name}
                  className={`${themeObj.name === theme ? 'active' : ''} my-0 py-0.5`}
                  style={{ paddingBottom: 5, paddingTop: 5 }}
                >
                  {themeObj.icon} {themeObj.name}
                </button>
              </li>
            ))}
          </ul>
        </Ui_Dropdown.Content>
      </Ui_Dropdown>
    </>
  )
}
