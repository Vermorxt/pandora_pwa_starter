import React, { FC, ReactNode } from 'react'
import scss from './text.module.scss'

export interface TextProps {
  type?: string
  children?: ReactNode
}

const Text: FC<TextProps> = props => (
  <p className={`${props.type ? scss[props?.type] : ''}`} {...props}>
    {props.children}
  </p>
)

export default Text
