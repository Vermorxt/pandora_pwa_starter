import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../../next-i18next.config'
import { GLOBAL_TRANSLATIONS } from '../../../src/_constants/main'

const Bluetooth = () => <h1>BLUETOOTH</h1>

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['bluetooth', ...GLOBAL_TRANSLATIONS], nextI18NextConfig)),
  },
})

export default Bluetooth
