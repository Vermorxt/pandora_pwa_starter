import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { LayoutProvider } from '../src/layout/LayoutProvider'
import { GlobalContextProvider } from '../src/system'
// NOTE: keep import order to prevent style overrides
import '../styles/globals.scss'
// NOTE: keep import order to prevent style overrides
import './../styles/imports.scss'
// NOTE: keep import order to prevent style overrides
import '/node_modules/@vermorxt/pandora_ui/dist/esm/index.css'

const WebApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  console.log('ENVIRONMENT: ', process.env.NEXT_PUBLIC_ENVIRONMENT)

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

export default WebApp
