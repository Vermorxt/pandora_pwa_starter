/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnyType } from '../../../_types/anytype'
import { ValidationOptions } from '../_types/form/validation-options'

/* eslint-disable no-prototype-builtins */
export const validateUrlScheme = (url: string) => {
  const regexHttp = new RegExp('^(http)://', 'i')
  const regexHttps = new RegExp('^(https)://', 'i')
  const regexUri =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g
  const regexUrl = new RegExp(regexUri)

  if (url && regexHttp.test(url)) {
    return 'Please add secure url scheme to url (https:// instead of http://)'
  }

  if (url && !regexHttps.test(url)) {
    return 'Please add url scheme to url (https://)'
  }

  if (url && !regexUrl.test(url)) {
    return 'Something seems to be wrong with the url'
  }

  return null
}

export const validateRequired = (value: string | string[]) => {
  if (!value || (Array.isArray(value) && value.length <= 0)) {
    return { type: 'required', message: 'This field is required' }
  }

  return null
}

export const getFieldError = (
  value: string | number | undefined,
  validationOptions: ValidationOptions,
  name?: string
) => {
  if (!validationOptions || Object.keys(validationOptions).length <= 0) return null

  let error = null

  for (const objKey in validationOptions) {
    if (validationOptions.hasOwnProperty(objKey)) {
      const vOptionClone = validationOptions as AnyType
      const option = vOptionClone[objKey]

      if (objKey === 'required' && option === true) {
        if (!value || (Array.isArray(value) && value.length <= 0)) {
          error = validateRequired(value as string)
        }
      }

      if (objKey === 'minLength') {
        if (value) {
          const isNumber = !isNaN(Number(value))

          if (isNumber && value < option) {
            error = { type: 'minLength', message: `Minimum value is ${option as string}` }
          }

          if (!isNumber && value.toString().length < option) {
            error = { type: 'minLength', message: `Minimum ${option as string} characters required` }
          }
        }
      }

      if (objKey === 'maxLength') {
        const isNumber = !isNaN(Number(value))

        if (value) {
          if (isNumber && value > option) {
            error = { type: 'maxLength', message: `Maximum value is ${option as string}` }
          }

          if (!isNumber && value.toString().length > option) {
            error = { type: 'maxLength', message: `Maximum ${option as string} characters allowed` }
          }
        }
      }

      if (objKey === 'valueAsNumber') {
        const numberValue = Number(value)

        if (value && isNaN(numberValue)) {
          error = { type: 'valueAsNumber', message: 'Only numbers allowed' }
        }
      }

      if (objKey === 'pattern') {
        const patternValue = new RegExp(option as RegExp)
        const regexMatches = patternValue.test(value as string)

        if (value && !regexMatches) {
          error = { type: 'pattern', message: `Not a valid ${name ? name : 'pattern'}` }
        }
      }

      if (objKey === 'match') {
        const optionValueElement = document.getElementsByName(option as string)

        if (optionValueElement?.[0]) {
          const matchingElement = optionValueElement[0] as HTMLInputElement
          const matchingValue = matchingElement?.value

          if (value && matchingValue && value !== matchingValue) {
            error = { type: 'match', message: `${option as string} does not match.` }
          }
        }
      }

      if (objKey === 'url' && option === true) {
        const urlErrorMessage = validateUrlScheme(value as string)

        if (value && urlErrorMessage) {
          error = { type: 'url', message: urlErrorMessage }
        }
      }
    }
  }

  return error
}
