import React, { FC } from 'react'
import scss from './global-content.module.scss'

export const Content: FC<any> = ({ children }) => <div className={`content ${scss.container}`}>{children}</div>
