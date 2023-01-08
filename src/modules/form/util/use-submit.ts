import { Helper } from '@vermorxt/pandora_utils'
import { FormEvent } from 'react'
import { AnyType } from '../../../_types/anytype'

const isCheckbox = (element: AnyType): boolean => element.type === 'checkbox'

const isRadio = (element: AnyType): boolean => element.type === 'radio'

const isMultiSelect = (element: AnyType): boolean => (element.options as boolean) && (element.multiple as boolean)

const isValidElement = (element: AnyType): boolean => element.name as boolean

const isSingleInputValue = (element: AnyType): boolean =>
  (!['checkbox', 'radio'].includes(element.type as string) as unknown as boolean) || (element.checked as boolean)

const getMultiSelectValues = (options: any) => {
  const useOptions = options as any[]

  return [].reduce.call(
    useOptions,
    (values, option) => {
      const o = option as { selected?: boolean; value?: string[] | undefined }
      const v = values as AnyType[]
      return o.selected ? v.concat(o.value as unknown as string[]) : values
    },
    []
  )
}

const formToJSON = (elements: HTMLFormControlsCollection) =>
  [].reduce.call(
    elements,
    (data: any, element: HTMLInputElement) => {
      // NOTE: Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isSingleInputValue(element)) {
        if (isCheckbox(element)) {
          data[element.name] = element.value === 'on' ? true : false
        } else if (isMultiSelect(element)) {
          data[element.name] = getMultiSelectValues(element)
        } else {
          data[element.name] = element.value
        }
      } else {
        if (isRadio(element)) data[element.name] = element.value
        if (!isRadio(element)) isValidElement(element) ? (data[element.name] = false) : null
      }

      return data as AnyType
    },
    {}
  )

const getFormValues = (event: FormEvent<HTMLFormElement>) => {
  const dataJson = formToJSON(event.currentTarget?.elements)

  return dataJson
}

export const useSubmit =
  (fn: (values: AnyType, errors: string[], touched: string[]) => void) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const formNodeList = event?.target as unknown as NodeList
    const formElements = Array.from(formNodeList) as unknown as HTMLInputElement[]

    const errors = formElements
      .map(t => (t && t?.classList.contains('input-error') ? t?.name : null))
      .filter(n => n) as unknown as string[]

    const touched = formElements
      .map(t => (t && t?.classList.contains('input-touched') ? t?.name : null))
      .filter(n => n) as unknown as string[]

    const uniqueTouched = Helper.getUniqueArrayValueSingle(touched)

    const values = getFormValues(event) as AnyType

    delete values?.submit // NOTE: remove submit button form element

    return fn(values, errors, uniqueTouched)
  }
