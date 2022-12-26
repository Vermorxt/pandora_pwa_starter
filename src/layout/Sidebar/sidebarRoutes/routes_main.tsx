import { InboxInIcon, LightningBoltIcon, ViewGridIcon } from '@heroicons/react/solid'
import { RoutesMain } from '../../../_enums/routes-main'

export const getRoutesMain = (t: (arg0: string) => string) => [
  {
    topic: t('main'),
    routes: [
      {
        path: RoutesMain.Dashboard,
        icon: ViewGridIcon,
        text: t('dashboard'),
      },
      {
        path: RoutesMain.Wifi,
        icon: LightningBoltIcon,
        text: t('wifi'),
      },
      {
        path: RoutesMain.Bluetooth,
        icon: InboxInIcon,
        text: t('bluetooth'),
      },
      {
        path: null,
      },
    ],
  },
]
