import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../../next-i18next.config'
import Login from '../../../src/components/Login'
import Register from '../../../src/components/Register'
import { GLOBAL_TRANSLATIONS } from '../../../src/_constants/main'

const RegisterPage = () => <Register />

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['register', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default RegisterPage
