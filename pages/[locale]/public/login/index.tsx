import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getI18nPaths } from '../../../../getI18nPaths'
import nextI18NextConfig from '../../../../next-i18next.config'
import Login from '../../../../src/components/Login'
import { GLOBAL_TRANSLATIONS } from '../../../../src/_constants/main'

const LoginPage = () => <Login />

export const getStaticPaths = () => ({
  fallback: false,
  paths: getI18nPaths(),
})

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['login', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default LoginPage
