import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../../next-i18next.config'
import Login from '../../../src/components/Login'
import { GLOBAL_TRANSLATIONS } from '../../../src/_constants/main'

const LoginPage = () => <Login />

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['login', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default LoginPage
