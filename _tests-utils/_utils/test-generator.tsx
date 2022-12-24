import { render } from '@testing-library/react'
import { ComponentType, FC, JSXElementConstructor, ReactElement } from 'react'
import { checkAccessibility } from '../check-accessibility'
import { itRendersChildren } from '../it-renders-children'
import { itRendersTableChildren } from '../it-renders-table-children'
import { itShouldHaveClass } from '../it-should-have-class'
import { SpecialProps } from '../it-supports-special-props'
import { itSupportsSystemProps } from '../it-supports-system-props'

// NOTE: this is a proof of concept that failed

export enum SkipTests {
  SkipChildren = 'skipChildren',
  CheckAccessibility = 'checkAccessibility',
  ItSupportsSystemProps = 'itSupportsSystemProps',
  ItShouldHaveClass = 'itShouldHaveClass',
  Snapshot = 'snapshot',
}

export type IsTableType = 'table' | 'thead' | 'tbody' | 'tr' | 'th' | 'td' | 'caption' | 'tfood'

export interface TestGeneratorProps {
  testName: string
  component: ComponentType<any>
  componentName: FC<{}>
  componentProps?: SpecialProps[]
  defaultProps?: any
  selector?: string
  refType?: any
  skipTests?: SkipTests[]
  isTable?: IsTableType
}

export const testGenerator = (props: TestGeneratorProps) => {
  const { testName, component, componentName, componentProps, defaultProps, skipTests, isTable, selector, refType } =
    props

  const TestComponent = component as unknown as ReactElement<any, string | JSXElementConstructor<any>>

  return describe(testName, () => {
    if (!skipTests?.includes(SkipTests.SkipChildren)) {
      if (isTable) itRendersTableChildren(componentName, defaultProps as any, isTable)
      if (!isTable) itRendersChildren(componentName, defaultProps as any)
    }

    if (!skipTests?.includes(SkipTests.CheckAccessibility)) {
      checkAccessibility([TestComponent])
    }

    if (!skipTests?.includes(SkipTests.ItSupportsSystemProps)) {
      itSupportsSystemProps({
        component: componentName,
        props: defaultProps,
        refType: refType,
      })
    }

    if (!skipTests?.includes(SkipTests.ItShouldHaveClass)) {
      if (componentProps && componentProps.length > 0) {
        itShouldHaveClass<SpecialProps[]>(componentName as any, componentProps)
      }
    }

    if (!skipTests?.includes(SkipTests.Snapshot)) {
      it('should create snapshot', () => {
        const { container } = render(TestComponent)
        expect(container).toMatchSnapshot()
      })
    }

    if (selector) {
      it('renders default class', () => {
        const { container: available } = render(TestComponent)

        expect(available.querySelectorAll(`.${selector}`)).toHaveLength(1)
      })
    }
  })
}
