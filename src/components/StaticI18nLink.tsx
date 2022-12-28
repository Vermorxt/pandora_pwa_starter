import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const StaticI18nLink = (props: any) => {
  const { href } = props

  const { i18n } = useTranslation()
  const router = useRouter()

  const locale = props.locale || i18n.language || ''

  // console.log('i18n.language: ', i18n.language)
  // console.log('static path locale: ', locale, props?.locale)

  return <Link {...props}></Link>

  if (!locale) {
    const href = props.href || router.asPath
    return <Link {...props} href={href}></Link>
  } else {
    const href2 = props.href
      ? `/${locale as string}${href as string}`
      : router.pathname.replace('[locale]', locale as string)
    return <Link {...props} href={href2} locale={undefined}></Link>
  }
}
