import { AnyType } from '../../../_types/anytype'
import { InitialFormValues } from '../_types/form/initial-form-values'
import { ValidationOptions } from '../_types/form/validation-options'
import { getFieldError } from './validation'

export type formError = { [key: string]: { message: string } }
export type formErrors = formError[]

export interface FormIsValid {
  isValid: boolean
  errors: formErrors
}

export const formIsValid = (formValues: AnyType, initialValues: InitialFormValues[]): FormIsValid => {
  const errors = []

  for (const key in formValues) {
    if (formValues.hasOwnProperty.call(formValues, key)) {
      const inputValue = formValues[key]
      const initialField = initialValues.find(i => i.name === key)
      const validation = initialField?.validation as ValidationOptions

      const errorMessage = getFieldError(inputValue as string, validation, initialField?.name)

      if (errorMessage) {
        errors.push({ [key]: errorMessage })
      }
    }
  }

  return { isValid: errors.length <= 0, errors }
}
