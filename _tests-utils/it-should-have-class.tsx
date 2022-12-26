import { render } from '@testing-library/react'
import React from 'react'

export interface SpecialProps {
  className: string
}
export function itShouldHaveClass<P>(Component: React.ComponentType<P>, colorProps: SpecialProps[]) {
  colorProps.forEach(prop => {
    const property = Object.entries(prop)[0][1]
    const className = Object.entries(prop)[1][1]

    it(`should have .${className as string} css class`, () => {
      const { container: available } = render(<Component {...(property as any)} />)

      // console.log('TEST PROP: ', property)
      // console.log('TEST CLASS: ', className)
      // debugComponent(<Component {...(property as any)} />)

      expect(available.querySelectorAll(`.${className as string}`)).toHaveLength(1)
    })
  })
}
