import {
  AdjustmentsIcon,
  CodeIcon,
  ColorSwatchIcon,
  CursorClickIcon,
  InboxInIcon,
  LightningBoltIcon,
  PencilIcon,
  ViewGridIcon,
} from '@heroicons/react/solid'
import { RoutesDocu } from '../../../_enums/routes-docu'

export const getRoutesDocu = (t: (arg0: string) => string) => [
  {
    topic: t('main'),
    routes: [
      {
        path: RoutesDocu.Install,
        icon: InboxInIcon,
        text: t('install'),
      },
      {
        path: RoutesDocu.Use,
        icon: LightningBoltIcon,
        text: t('use'),
      },
      {
        path: RoutesDocu.CustomizeComponents,
        icon: CodeIcon,
        text: t('customize_components'),
      },
      {
        path: RoutesDocu.Config,
        icon: AdjustmentsIcon,
        text: t('config'),
      },
      {
        path: RoutesDocu.Colors,
        icon: ViewGridIcon,
        text: t('colors'),
      },
      {
        path: RoutesDocu.Themes,
        icon: ColorSwatchIcon,
        text: t('themes'),
      },
      {
        path: RoutesDocu.ThemeGenerator,
        icon: CursorClickIcon,
        text: t('theme_generator'),
      },
      {
        path: RoutesDocu.LayoutAndTypography,
        icon: PencilIcon,
        text: t('typography'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('actions'),
    routes: [
      {
        path: RoutesDocu.Button,
        text: t('button'),
      },
      {
        path: RoutesDocu.Dropdown,
        text: t('dropdown'),
      },
      {
        path: RoutesDocu.Modal,
        text: t('modal'),
      },
      {
        path: RoutesDocu.Swap,
        text: t('swap'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('ui_elements'),
    routes: [
      {
        path: RoutesDocu.Alert,
        text: t('alert'),
      },
      {
        path: RoutesDocu.Avatar,
        text: t('avatar'),
      },
      {
        path: RoutesDocu.Badge,
        text: t('badge'),
      },
      {
        path: RoutesDocu.Card,
        text: t('card'),
      },
      {
        path: RoutesDocu.Carousel,
        text: t('carousel'),
      },
      {
        path: RoutesDocu.Collapse,
        text: t('collapse'),
      },
      {
        path: RoutesDocu.Countdown,
        text: t('countdown'),
      },
      {
        path: RoutesDocu.Kbd,
        text: t('kbd'),
      },
      {
        path: RoutesDocu.Progress,
        text: t('progress'),
      },
      {
        path: RoutesDocu.RadialProgress,
        text: t('radial_progress'),
      },
      {
        path: RoutesDocu.Stat,
        text: t('stat'),
      },
      {
        path: RoutesDocu.Table,
        text: t('table'),
      },
      {
        path: RoutesDocu.Tooltip,
        text: t('tooltip'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('form_elements'),
    routes: [
      {
        path: RoutesDocu.Checkbox,
        text: t('checkbox'),
      },
      {
        path: RoutesDocu.TextInput,
        text: t('text_input'),
      },
      {
        path: RoutesDocu.Radio,
        text: t('radio'),
      },
      {
        path: RoutesDocu.Range,
        text: t('range'),
      },
      {
        path: RoutesDocu.Rating,
        text: t('rating'),
      },
      {
        path: RoutesDocu.Select,
        text: t('select'),
      },
      {
        path: RoutesDocu.Textarea,
        text: t('textarea'),
      },
      {
        path: RoutesDocu.Toggle,
        text: t('toggle'),
      },
      {
        path: RoutesDocu.Label,
        text: t('label'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('layout'),
    routes: [
      {
        path: RoutesDocu.Artboard,
        text: t('artboard'),
      },
      {
        path: RoutesDocu.ButtonGroup,
        text: t('button_group'),
      },
      {
        path: RoutesDocu.Divider,
        text: t('divider'),
      },
      {
        path: RoutesDocu.Drawer,
        text: t('drawer'),
      },
      {
        path: RoutesDocu.Footer,
        text: t('footer'),
      },
      {
        path: RoutesDocu.Hero,
        text: t('hero'),
      },
      {
        path: RoutesDocu.Indicator,
        text: t('indicator'),
      },
      {
        path: RoutesDocu.InputGroup,
        text: t('input_group'),
      },
      {
        path: RoutesDocu.Mask,
        text: t('mask'),
      },
      {
        path: RoutesDocu.Stack,
        text: t('stack'),
      },
      {
        path: RoutesDocu.Spinner,
        text: t('spinner'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('navigation'),
    routes: [
      {
        path: RoutesDocu.Breadcrumbs,
        text: t('breadcrumbs'),
      },
      {
        path: RoutesDocu.Link,
        text: t('link'),
      },
      {
        path: RoutesDocu.Menu,
        text: t('menu'),
      },
      {
        path: RoutesDocu.Navbar,
        text: t('navbar'),
      },
      {
        path: RoutesDocu.Pagination,
        text: t('pagination'),
      },
      {
        path: RoutesDocu.Steps,
        text: t('steps'),
      },
      {
        path: RoutesDocu.Tab,
        text: t('tab'),
      },
      {
        path: RoutesDocu.NavLink,
        text: t('nav_link'),
      },
      {
        path: null,
      },
    ],
  },
  {
    topic: t('mockups'),
    routes: [
      {
        path: RoutesDocu.Code,
        text: t('code'),
      },
      {
        path: RoutesDocu.Phone,
        text: t('phone'),
      },
      {
        path: RoutesDocu.Window,
        text: t('window'),
      },
    ],
  },
  {
    separator: 'Enterprise',
  },
]
