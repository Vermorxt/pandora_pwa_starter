import React, { CSSProperties } from 'react'

interface LogoPublicProps {
  cleanLogo?: boolean
  style?: CSSProperties
}

const LogoPublic = (props: LogoPublicProps) => {
  let logo = '/media/images/svg/logo-flash-text-colored.svg'

  if (props?.cleanLogo === true) {
    logo = '/media/images/svg/logo-flash-colored.svg'
  }

  return <img src={logo} alt=" " style={props?.style} />
}

export default LogoPublic
