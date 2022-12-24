import { render } from '@testing-library/react'
import { JSXElementConstructor, ReactElement } from 'react'

export const itHasCssClass = async (
  component: ReactElement<any, string | JSXElementConstructor<any>>,
  expectedClass: string
) => {
  const { container } = await render(component)

  await expect(container.querySelectorAll(expectedClass)).toHaveLength(1)

  return container
}
