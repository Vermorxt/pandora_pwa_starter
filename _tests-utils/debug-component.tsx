import { render } from '@testing-library/react'
import { JSXElementConstructor, ReactElement } from 'react'

export function debugComponent(component: ReactElement<any, string | JSXElementConstructor<any>>) {
  const { debug } = render(component)
  debug()
}
