import React from 'react'
import { itSupportsClassName } from './it-supports-classname'
import { itSupportsRef } from './it-supports-ref'
import { itSupportsStyle } from './it-supports-style'

interface Options<T extends React.FC> {
  component: T
  props: any
  refType?: any
}

export function itSupportsSystemProps<T extends React.FC>(options: Options<T>) {
  options.refType && itSupportsRef(options.component, options.props, options.refType)
  itSupportsClassName(options.component, options.props)
  itSupportsStyle(options.component, options.props)
}
