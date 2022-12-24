import { render } from '@testing-library/react'
import React from 'react'

export interface SpecialProps {
  className: string
}
export function itSupportsSpecialProps<P>(Component: React.ComponentType<P>, specialProps: SpecialProps[]) {
  specialProps.forEach(prop => {
    const propKey = Object.keys(prop)[0]
    const className = Object.entries(prop)[1][1]

    it(`supports ${propKey} prop`, async () => {
      const { container: available } = render(<Component {...(prop as any)} ref={null} />)

      const noProps = {} as any
      const { container: notAvailable } = render(<Component {...noProps} ref={null} />)

      expect(available.querySelectorAll(`.${className}`)).toHaveLength(1)
      expect(notAvailable.querySelector(`.${className}`)).toBeNull()
    })
  })
}
