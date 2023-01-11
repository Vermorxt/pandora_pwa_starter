import { FC } from 'react'
import LogoPublic from '../LogoPublic'

const AppLoader: FC<any> = () => (
  <div className="w-full h-screen flex justify-center items-center flex-col">
    <LogoPublic style={{ maxWidth: 300 }} />

    <p>
      <small>Lade App Daten ...</small>
    </p>
  </div>
)

export default AppLoader
