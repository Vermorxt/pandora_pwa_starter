import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { T_SideBarContext2 } from '../FooterMenu'
import { T_SideBarContext } from '../Header'
import scss from './global-container.module.scss'

export const Container: FC<any> = ({ children }) => {
  const [publicStyle, setPublicStyle] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!router) return

    const parts = router.asPath.split('/')
    const sideBarContext = parts[1] as T_SideBarContext
    const sideBarContext2 = parts[2] as T_SideBarContext2

    setPublicStyle(false)

    if (sideBarContext === 'dashboard') {
      if (sideBarContext2 !== 'welcome') {
        setPublicStyle(true)
      }
    }
  }, [router])
  return (
    <div
      className={`main-container ${scss.container} bg-base-100`}
      style={{ marginBottom: `${publicStyle === true ? '100px' : '10px'}` }}
    >
      {children}
    </div>
  )
}
