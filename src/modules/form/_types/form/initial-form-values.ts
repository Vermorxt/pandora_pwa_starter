import { FormFieldTypes } from './formfield-types'
import { ValidationOptions } from './validation-options'

export interface InitialFormValues {
  name: string
  value: string | number
  label?: string
  quantity?: number
  type: FormFieldTypes // NOTE: use not InputHTMLAttributes<HTMLInputElement> for now because validation handled by browser otherwise
  validation?: ValidationOptions
  radioOptions?: string[]
}
