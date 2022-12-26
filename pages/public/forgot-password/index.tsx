import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../../next-i18next.config'
import ForgotPassword from '../../../src/components/ForgotPassword'
import { GLOBAL_TRANSLATIONS } from '../../../src/_constants/main'

const ForgotPasswordPage = () => <ForgotPassword />

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['forgot-password', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default ForgotPasswordPage
