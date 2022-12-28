import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getI18nPaths } from '../../../../lib/getI18nPaths'
import nextI18NextConfig from '../../../../next-i18next.config'
import ForgotPassword from '../../../../src/components/ForgotPassword'
import { GLOBAL_TRANSLATIONS } from '../../../../src/_constants/main'

const ForgotPasswordPage = () => <ForgotPassword />

export const getStaticPaths = () => ({
  fallback: false,
  paths: getI18nPaths(),
})

export const getStaticProps = async (ctx: { params: { locale: string } }) => ({
  props: {
    ...(await serverSideTranslations(
      ctx?.params?.locale,
      ['forgot-password', ...GLOBAL_TRANSLATIONS],
      nextI18NextConfig
    )),
  },
})

export default ForgotPasswordPage
