import { Ui_BottomNavigation } from '@vermorxt/pandora_ui'
import { FC, useState } from 'react'

export interface BottomNavigation {
  id?: number | string
  title?: string
  active?: boolean
  disabled?: boolean
  onClick?: (args?: any) => void
  icon?: string
}

const FooterMenu: FC<any> = props => {
  const receiveClick = (arg: any) => {
    const n = navigation.map(navi => {
      navi.active = false

      if (navi.id === arg?.id) {
        navi.active = true
      }

      return navi
    })

    setNavi([...n])
  }

  const navigation = [
    {
      id: 1,
      title: 'Haushalte',
      active: true,
      onClick: receiveClick,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
    },
    {
      id: 2,
      title: 'Statistik',
      onClick: receiveClick,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    },
    {
      id: 3,
      title: 'Einstellungen',
      onClick: receiveClick,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
    },
  ] as BottomNavigation[]

  const [navi, setNavi] = useState<BottomNavigation[]>(navigation)

  return (
    <Ui_BottomNavigation
      className={props?.className}
      navigation={navi}
      bordered="true"
      size="mini"
      bgColor="none"
      variant="none"
      activeColor="primary"
      rounded={true}
      shadow={true}
    />
  )
}

export default FooterMenu
