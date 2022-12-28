import { InboxInIcon, LightningBoltIcon, ViewGridIcon } from '@heroicons/react/solid'
import { RoutesMain } from '../../../_enums/routes-main'

export const getRoutesMain = () => [
  {
    topic: 'Main',
    routes: [
      {
        path: RoutesMain.Dashboard,
        icon: ViewGridIcon,
        text: 'Dashboard',
      },
      {
        path: RoutesMain.Wifi,
        icon: LightningBoltIcon,
        text: 'Wifi',
      },
      {
        path: RoutesMain.Bluetooth,
        icon: InboxInIcon,
        text: 'Bluetooth',
      },
      {
        path: null,
      },
    ],
  },
]
