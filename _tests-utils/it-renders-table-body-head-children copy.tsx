import React from 'react'
import { renderWithAct } from './render-with-act'

export function itRendersTableBodyHeadChildren<P>(Component: React.ComponentType<P>, requiredProps: P) {
  it('renders table children', async () => {
    const { queryAllByText } = await renderWithAct(
      <Component {...requiredProps}>
        <tr className="test-children"></tr>
      </Component>
    )
    expect(queryAllByText('test-children')).toHaveLength(1)
  })
}
