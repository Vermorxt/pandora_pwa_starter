import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getI18nPaths } from '../../../../lib/getI18nPaths'
import nextI18NextConfig from '../../../../next-i18next.config'
import PasswordRenew from '../../../../src/components/PasswordRenew'
import { GLOBAL_TRANSLATIONS } from '../../../../src/_constants/main'

const PasswordRenewPage = () => <PasswordRenew />

export const getStaticPaths = () => ({
  fallback: false,
  paths: getI18nPaths(),
})

export const getStaticProps = async (ctx: { params: { locale: string } }) => ({
  props: {
    ...(await serverSideTranslations(
      ctx?.params?.locale,
      ['password-renew', ...GLOBAL_TRANSLATIONS],
      nextI18NextConfig
    )),
  },
})

export default PasswordRenewPage
