import React from 'react'
import { FC, InputHTMLAttributes, ReactNode } from 'react'

interface Ui_FormProps extends InputHTMLAttributes<HTMLFormElement> {
  children?: ReactNode
  className?: string
}

export const Field: FC<Ui_FormProps> = (props: Ui_FormProps) => {
  const { children, className } = props
  return <div className={`${className ? className : ''} form-control`}>{children}</div>
}
