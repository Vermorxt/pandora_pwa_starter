import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getI18nPaths } from '../../../../lib/getI18nPaths'
import nextI18NextConfig from '../../../../next-i18next.config'
import { GLOBAL_TRANSLATIONS } from '../../../../src/_constants/main'

const Bluetooth = () => <h1>BLUETOOTH</h1>

export const getStaticPaths = () => ({
  fallback: false,
  paths: getI18nPaths(),
})

export const getStaticProps = async (ctx: { params: { locale: string } }) => ({
  props: {
    ...(await serverSideTranslations(ctx?.params?.locale, ['bluetooth', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default Bluetooth
