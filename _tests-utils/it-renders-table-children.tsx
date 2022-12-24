import React from 'react'
import { renderWithAct } from './render-with-act'
import { IsTableType } from './_utils/test-generator'

export function itRendersTableChildren<P>(Component: React.ComponentType<P>, requiredProps: P, isTable: IsTableType) {
  it('renders table children', async () => {
    const { queryAllByText } = await renderWithAct(
      <>
        {isTable === 'table' && (
          <Component {...requiredProps}>
            <caption className="test-children">test-children</caption>
          </Component>
        )}
        {isTable === 'thead' && (
          <table>
            <Component {...requiredProps}>
              <tr className="test-children">
                <th>test</th>
              </tr>
            </Component>
          </table>
        )}
        {isTable === 'tbody' && (
          <table>
            <Component {...requiredProps}>
              <tr className="test-children"></tr>
            </Component>
          </table>
        )}
      </>
    )
    expect(queryAllByText('test-children')).toHaveLength(1)
  })
}
