import React, { FC } from 'react'
import scss from './global-content.module.scss'

export const Content: FC<any> = ({ children }) => (
  <div className={`content ${scss.container} bg-base-100 px-8`}>{children}</div>
)
