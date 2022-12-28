import { appWithTranslation } from 'next-i18next'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { NextRouter, Router, useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { LayoutProvider } from '../src/layout/LayoutProvider'
import { GlobalContextProvider, useGlobalContext } from '../src/system'
import '/node_modules/@vermorxt/pandora_ui/dist/esm/index.css'

import '../styles/globals.scss'
import './../styles/imports.scss'

import i18nConfig from './../next-i18next.config'

const _UTIL = {
  getLocaleFromPath: (router: NextRouter) => {
    const pathSplit = router.asPath.split('/')

    return { locale: pathSplit?.[1] }
  },
}

const useWarnIfUnsavedChanges = (unsavedChanges: boolean, callback: () => boolean) => {
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = callback()
        if (!ok) {
          Router.events.emit('routeChangeError')
          throw 'Abort route change. Please ignore this error.'
        }
      }
      Router.events.on('routeChangeStart', routeChangeStart)

      return () => {
        Router.events.off('routeChangeStart', routeChangeStart)
      }
    }
  }, [unsavedChanges])
}

const WebApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const { locale } = _UTIL.getLocaleFromPath(router)
  const [appData, setAppData] = useGlobalContext().appData
  const languages = i18nConfig.i18n.locales
  // console.log('ENVIRONMENT: ', process.env.NEXT_PUBLIC_ENVIRONMENT)

  useEffect(() => {
    console.log('router query: ', router.query)
  }, [router.query])

  useEffect(() => {
    // NOTE: set language based on path on browser refresh
    if (locale !== appData?.language && languages.includes(locale)) {
      setAppData({ ...appData, language: locale })
    }

    // NOTE: set route path based on language

    console.log(i18nConfig.i18n.locales, 'locale -> locale: ', locale, appData.language)

    if (!languages.includes(locale)) {
      console.log('do sth with path: ', locale)

      const pathName = router.pathname
      const path = router.asPath
      const pathContainsLocale = pathName.includes('[locale]')
      const pathSplit = path.split('/')
      const expectedLanguage = pathSplit?.[1]

      console.log('-> pathName: ', pathName)
      console.log('-> path: ', path)
      console.log('-> pathContainsLocale: ', pathContainsLocale)
      console.log('-> expectedLanguage: ', expectedLanguage)

      const pathNameNew = (appData.language as string) + path

      // void router.replace(router.pathname, pathNameNew)
    }
  }, [router])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Next.js Pandora UI - PWA Template</title>

        <link rel="manifest" href="/manifest.json" />
        <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>

      <GlobalContextProvider>
        <ThemeProvider>
          <LayoutProvider>
            <Component {...pageProps} key={router.asPath} />
          </LayoutProvider>
        </ThemeProvider>
      </GlobalContextProvider>
    </>
  )
}

export default appWithTranslation(WebApp)
